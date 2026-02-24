import { config } from "dotenv"
import { resolve } from "path"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { debriefCalls } from "../db/schema"
import { desc, sql } from "drizzle-orm"

// Load .env.local file
config({ path: resolve(process.cwd(), ".env.local") })

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not set")
  process.exit(1)
}

const client = postgres(process.env.DATABASE_URL)
const db = drizzle(client)

async function checkStatus() {
  try {
    console.log("Checking debrief call status...\n")
    
    // Get recent debrief calls from the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    
    const recentCalls = await db
      .select()
      .from(debriefCalls)
      .where(sql`created_at > ${oneHourAgo}`)
      .orderBy(desc(debriefCalls.createdAt))
      .limit(10)
    
    if (recentCalls.length === 0) {
      console.log("⚠️  No debrief calls found in the last hour")
      console.log("\nThis could mean:")
      console.log("1. The meeting hasn't ended yet")
      console.log("2. The webhook hasn't been received")
      console.log("3. The meeting was already processed")
      console.log("\nCheck your server logs for webhook activity.")
    } else {
      console.log(`✓ Found ${recentCalls.length} recent debrief call(s):\n`)
      
      recentCalls.forEach((call, index) => {
        console.log(`${index + 1}. ${call.meetingTitle}`)
        console.log(`   Status: ${call.status}`)
        console.log(`   Created: ${call.createdAt}`)
        if (call.retellCallId) {
          console.log(`   Retell Call ID: ${call.retellCallId}`)
        }
        if (call.errorMessage) {
          console.log(`   Error: ${call.errorMessage}`)
        }
        console.log("")
      })
    }
    
    // Check webhook endpoint accessibility
    const webhookUrl = process.env.NEXT_PUBLIC_APP_URL
    if (webhookUrl) {
      console.log(`Webhook URL: ${webhookUrl}/api/meetings/calendar`)
      try {
        const response = await fetch(`${webhookUrl}/api/meetings/calendar`, {
          method: "GET",
        })
        console.log(`Webhook endpoint status: ${response.status}`)
      } catch (error: any) {
        console.log(`⚠️  Could not reach webhook endpoint: ${error.message}`)
      }
    }
    
  } catch (error: any) {
    console.error("Error checking status:", error)
  }
}

// Import sql from drizzle-orm
import { sql } from "drizzle-orm"

checkStatus()



