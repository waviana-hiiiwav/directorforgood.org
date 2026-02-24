import { config } from "dotenv"
import { resolve } from "path"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { debriefCalls } from "../db/schema"
import { eq } from "drizzle-orm"
import Retell from "retell-sdk"

config({ path: resolve(process.cwd(), ".env.local") })

if (!process.env.DATABASE_URL || !process.env.RETELL_API_KEY) {
  console.error("DATABASE_URL or RETELL_API_KEY not set")
  process.exit(1)
}

const client = postgres(process.env.DATABASE_URL)
const db = drizzle(client)
const retellClient = new Retell({ apiKey: process.env.RETELL_API_KEY })

async function backfillTranscript() {
  try {
    console.log("Fetching calls without transcripts...\n")
    
    const callsWithoutTranscripts = await db
      .select()
      .from(debriefCalls)
      .where(sql`transcript IS NULL AND retell_call_id IS NOT NULL`)
    
    if (callsWithoutTranscripts.length === 0) {
      console.log("No calls need transcript backfill.")
      await client.end()
      return
    }
    
    console.log(`Found ${callsWithoutTranscripts.length} call(s) to backfill\n`)
    
    for (const call of callsWithoutTranscripts) {
      if (!call.retellCallId) continue
      
      try {
        console.log(`Fetching transcript for: ${call.meetingTitle} (${call.retellCallId})`)
        const callDetails = await retellClient.call.retrieve(call.retellCallId)
        
        if (callDetails.transcript) {
          await db
            .update(debriefCalls)
            .set({
              transcript: callDetails.transcript,
              callAnalysis: callDetails.call_analysis ? {
                call_summary: callDetails.call_analysis.call_summary,
                user_sentiment: callDetails.call_analysis.user_sentiment,
                call_successful: callDetails.call_analysis.call_successful,
                call_duration_seconds: callDetails.call_analysis.call_duration_seconds,
              } : null,
            })
            .where(eq(debriefCalls.id, call.id))
          
          console.log(`  ✓ Updated transcript\n`)
        } else {
          console.log(`  ⚠️  No transcript available yet\n`)
        }
      } catch (error: any) {
        console.log(`  ✗ Error: ${error.message}\n`)
      }
    }
    
    await client.end()
    console.log("Backfill complete!")
  } catch (error: any) {
    console.error("Error:", error)
    await client.end()
  }
}

import { sql } from "drizzle-orm"
backfillTranscript()



