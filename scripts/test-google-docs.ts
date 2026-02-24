/**
 * Test script to manually fetch a call transcript from Retell
 * and write it to Google Docs
 * 
 * Usage:
 *   npx tsx scripts/test-google-docs.ts <call_id>
 * 
 * Example:
 *   npx tsx scripts/test-google-docs.ts call_e488564e6cf584035e83969357a
 */

import dotenv from "dotenv"
import { resolve } from "path"
import Retell from "retell-sdk"
import { writeDebriefToGoogleDoc } from "../lib/google-docs"
import type { StructuredDebriefNotes } from "../app/api/meetings/webhook/route"

// Load .env.local file FIRST before importing anything that uses env vars
dotenv.config({ path: resolve(process.cwd(), ".env.local") })

// Create Retell client after env vars are loaded
const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
})

const callId = process.argv[2]

if (!callId) {
  console.error("Usage: npx tsx scripts/test-google-docs.ts <call_id>")
  console.error("Example: npx tsx scripts/test-google-docs.ts call_e488564e6cf584035e83969357a")
  process.exit(1)
}

async function main() {
  console.log(`📞 Fetching call details for: ${callId}\n`)

  if (!process.env.RETELL_API_KEY) {
    console.error("❌ RETELL_API_KEY not set in .env.local")
    process.exit(1)
  }

  try {
    // Fetch call details from Retell
    const call = await retellClient.call.retrieve(callId)
    
    console.log("Call Status:", call.call_status)
    console.log("Call Type:", call.call_type)
    
    // Check if transcript is available
    if (!call.transcript) {
      console.log("\n⚠️  No transcript available yet.")
      console.log("The call might still be in progress or hasn't ended yet.")
      console.log("Wait a few minutes after the call ends and try again.")
      process.exit(1)
    }

    console.log("\n✅ Transcript found!")
    console.log(`Transcript length: ${call.transcript.length} characters\n`)

    // Extract metadata
    const metadata = call.metadata as any || {}
    const meetingTitle = metadata.meeting_title || metadata.meetingTitle || "Meeting"
    const meetingDate = metadata.meeting_date || metadata.meetingDate || new Date().toLocaleDateString()
    const executiveName = metadata.executive_name || metadata.executiveName || "Executive"
    const attendees = metadata.attendees || ""

    console.log("Meeting Info:")
    console.log(`  Title: ${meetingTitle}`)
    console.log(`  Date: ${meetingDate}`)
    console.log(`  Executive: ${executiveName}`)
    console.log(`  Attendees: ${attendees}\n`)

    // Structure the notes (simple extraction for now)
    const notes: StructuredDebriefNotes = {
      meetingTitle,
      meetingDate,
      executiveName,
      attendees: typeof attendees === "string" ? attendees : attendees.toString(),
      rawTranscript: call.transcript,
      keyTakeaways: extractSection(call.transcript, ["takeaway", "main point", "went well", "overall"]),
      asksCommitments: extractSection(call.transcript, ["commitment", "ask", "action item", "follow up", "dollar", "amount"]),
      funderInterest: extractSection(call.transcript, ["excited", "interested", "resonate", "liked"]),
      concerns: extractSection(call.transcript, ["concern", "hesitation", "worried", "issue", "problem"]),
      nextSteps: extractSection(call.transcript, ["next step", "follow up", "schedule", "send", "next meeting"]),
      sentiment: (call as any).call_analysis?.user_sentiment || "neutral",
      callDuration: (call as any).call_duration_seconds,
    }

    console.log("📝 Writing to Google Doc...\n")

    // Write to Google Doc
    const docUrl = await writeDebriefToGoogleDoc(notes)

    console.log("✅ Success!")
    console.log(`📄 Notes written to: ${docUrl}\n`)
  } catch (error) {
    console.error("❌ Error:", error)
    if (error instanceof Error) {
      console.error("Message:", error.message)
      console.error("Stack:", error.stack)
    }
    process.exit(1)
  }
}

function extractSection(transcript: string, keywords: string[]): string[] {
  const sentences = transcript.split(/[.!?]+/).map(s => s.trim()).filter(Boolean)
  const relevant: string[] = []

  for (const sentence of sentences) {
    const lower = sentence.toLowerCase()
    if (keywords.some(kw => lower.includes(kw))) {
      relevant.push(sentence)
    }
  }

  return relevant.slice(0, 5) // Max 5 items per section
}

main()



