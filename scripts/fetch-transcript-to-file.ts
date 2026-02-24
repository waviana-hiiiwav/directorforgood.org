/**
 * Fetch transcript and save to markdown file
 */

import dotenv from "dotenv"
import { resolve } from "path"
import Retell from "retell-sdk"
import * as fs from "fs"

// Load .env.local file
dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
})

const callId = "call_e488564e6cf584035e83969357a"

async function main() {
  try {
    const call = await retellClient.call.retrieve(callId)
    
    const metadata = call.metadata as any || {}
    const meetingTitle = metadata.meeting_title || metadata.meetingTitle || "Meeting"
    const meetingDate = metadata.meeting_date || metadata.meetingDate || new Date().toLocaleDateString()
    const executiveName = metadata.executive_name || metadata.executiveName || "Executive"
    const attendees = metadata.attendees || ""

    const markdown = `# Meeting Debrief Transcript

**Call ID:** ${callId}
**Status:** ${call.call_status}
**Date:** ${meetingDate}
**Executive:** ${executiveName}
**Attendees:** ${attendees}

## Transcript

${call.transcript || "No transcript available"}

## Call Metadata

\`\`\`json
${JSON.stringify(call.metadata || {}, null, 2)}
\`\`\`

## Call Analysis

\`\`\`json
${JSON.stringify((call as any).call_analysis || {}, null, 2)}
\`\`\`
`

    const filePath = resolve(process.cwd(), "call_transcript_test.md")
    fs.writeFileSync(filePath, markdown, "utf-8")
    
    console.log(`✅ Transcript saved to: ${filePath}`)
    console.log(`📄 File path: ${filePath}`)
  } catch (error) {
    console.error("❌ Error:", error)
    process.exit(1)
  }
}

main()



