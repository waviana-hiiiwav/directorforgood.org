import { config } from "dotenv"
import { resolve } from "path"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { debriefCalls } from "../db/schema"
import { eq } from "drizzle-orm"
import { writeDebriefToGoogleDoc } from "../lib/google-docs"
import type { StructuredDebriefNotes } from "../app/api/meetings/webhook/route"

config({ path: resolve(process.cwd(), ".env.local") })

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not set")
  process.exit(1)
}

const client = postgres(process.env.DATABASE_URL)
const db = drizzle(client)

async function writeToDoc() {
  try {
    console.log("Finding calls with transcripts that haven't been written to Google Doc...\n")
    
    // Get the most recent call with a transcript
    const calls = await db
      .select()
      .from(debriefCalls)
      .where(sql`transcript IS NOT NULL`)
      .orderBy(desc(debriefCalls.createdAt))
      .limit(1)
    
    if (calls.length === 0) {
      console.log("No calls with transcripts found.")
      await client.end()
      return
    }
    
    const call = calls[0]
    console.log(`Found call: ${call.meetingTitle}`)
    console.log(`Status: ${call.status}`)
    console.log(`Has transcript: ${!!call.transcript}\n`)
    
    if (!call.transcript) {
      console.log("This call doesn't have a transcript.")
      await client.end()
      return
    }
    
    // Structure the notes
    const structuredNotes: StructuredDebriefNotes = {
      meetingTitle: call.meetingTitle,
      meetingDate: new Date(call.meetingDate).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      executiveName: "Bosko",
      attendees: "",
      rawTranscript: call.transcript,
      keyTakeaways: extractSection(call.transcript, ["takeaway", "main point", "went well", "overall"]),
      asksCommitments: extractSection(call.transcript, ["commitment", "ask", "action item", "follow up", "dollar", "amount"]),
      funderInterest: extractSection(call.transcript, ["excited", "interested", "resonate", "liked"]),
      concerns: extractSection(call.transcript, ["concern", "hesitation", "worried", "issue", "problem"]),
      nextSteps: extractSection(call.transcript, ["next step", "follow up", "schedule", "send", "next meeting"]),
      sentiment: call.callAnalysis?.user_sentiment || "neutral",
      callDuration: call.callAnalysis?.call_duration_seconds,
    }
    
    console.log("Writing to Google Doc...")
    const docUrl = await writeDebriefToGoogleDoc(structuredNotes)
    
    console.log(`\n✓ Success! Written to Google Doc:`)
    console.log(docUrl)
    console.log("\nOpen the document to verify.")
    
    await client.end()
  } catch (error: any) {
    console.error("\n✗ Error:", error.message)
    await client.end()
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
  
  return relevant.slice(0, 5)
}

import { desc, sql } from "drizzle-orm"
writeToDoc()



