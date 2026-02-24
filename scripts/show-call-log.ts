import { config } from "dotenv"
import { resolve } from "path"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { debriefCalls } from "../db/schema"
import { desc } from "drizzle-orm"
import Retell from "retell-sdk"

// Load .env.local first
config({ path: resolve(process.cwd(), ".env.local") })

// Initialize Retell client
const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
})

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not set")
  process.exit(1)
}

const client = postgres(process.env.DATABASE_URL)
const db = drizzle(client)

async function showCallLog() {
  try {
    console.log("Fetching recent debrief calls...\n")
    
    const recent = await db
      .select()
      .from(debriefCalls)
      .orderBy(desc(debriefCalls.createdAt))
      .limit(10)
    
    if (recent.length === 0) {
      console.log("No debrief calls found in database.")
      await client.end()
      return
    }
    
    console.log(`Found ${recent.length} recent call(s):\n`)
    
    for (const call of recent) {
      console.log("=".repeat(60))
      console.log(`Meeting: ${call.meetingTitle}`)
      console.log(`Date: ${call.meetingDate}`)
      console.log(`Status: ${call.status}`)
      console.log(`Created: ${call.createdAt}`)
      
      if (call.retellCallId) {
        console.log(`Retell Call ID: ${call.retellCallId}`)
        
        // Try to get call details from Retell
        try {
          const callDetails = await retellClient.call.retrieve(call.retellCallId)
          console.log(`\nCall Details:`)
          console.log(`  Status: ${callDetails.call_status}`)
          console.log(`  Duration: ${callDetails.call_duration_seconds}s`)
          
          if (callDetails.transcript) {
            console.log(`\nTranscript:`)
            console.log("-".repeat(60))
            console.log(callDetails.transcript)
            console.log("-".repeat(60))
          } else {
            console.log("\nTranscript: Not available yet (may still be processing)")
          }
          
          if (callDetails.call_analysis) {
            console.log(`\nCall Analysis:`)
            console.log(JSON.stringify(callDetails.call_analysis, null, 2))
          }
        } catch (error: any) {
          console.log(`\nCould not fetch call details: ${error.message}`)
        }
      }
      
      if (call.errorMessage) {
        console.log(`\nError: ${call.errorMessage}`)
      }
      
      console.log("")
    }
    
    await client.end()
  } catch (error: any) {
    console.error("Error:", error)
    await client.end()
  }
}

showCallLog()



