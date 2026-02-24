import { config } from "dotenv"
import { resolve } from "path"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { debriefCalls } from "../db/schema"
import { desc, sql } from "drizzle-orm"

config({ path: resolve(process.cwd(), ".env.local") })

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not set")
  process.exit(1)
}

const client = postgres(process.env.DATABASE_URL)
const db = drizzle(client)

async function checkCalls() {
  const recent = await db
    .select()
    .from(debriefCalls)
    .orderBy(desc(debriefCalls.createdAt))
    .limit(5)
  
  if (recent.length === 0) {
    console.log("No debrief calls found in database yet.")
  } else {
    console.log(`Found ${recent.length} recent debrief call(s):\n`)
    recent.forEach((call, i) => {
      console.log(`${i + 1}. ${call.meetingTitle}`)
      console.log(`   Status: ${call.status}`)
      console.log(`   Created: ${call.createdAt}`)
      if (call.retellCallId) console.log(`   Call ID: ${call.retellCallId}`)
      if (call.errorMessage) console.log(`   Error: ${call.errorMessage}`)
      console.log("")
    })
  }
  
  await client.end()
}

checkCalls().catch(console.error)



