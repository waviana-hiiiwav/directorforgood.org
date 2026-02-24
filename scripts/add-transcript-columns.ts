import { config } from "dotenv"
import { resolve } from "path"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { sql } from "drizzle-orm"

config({ path: resolve(process.cwd(), ".env.local") })

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not set")
  process.exit(1)
}

const client = postgres(process.env.DATABASE_URL)
const db = drizzle(client)

async function addColumns() {
  try {
    console.log("Adding transcript and call_analysis columns...\n")
    
    // Check if columns exist
    const checkTranscript = await db.execute(
      sql`SELECT column_name FROM information_schema.columns 
          WHERE table_name = 'debrief_calls' AND column_name = 'transcript'`
    )
    
    const checkAnalysis = await db.execute(
      sql`SELECT column_name FROM information_schema.columns 
          WHERE table_name = 'debrief_calls' AND column_name = 'call_analysis'`
    )
    
    if (checkTranscript.length === 0) {
      await db.execute(sql`ALTER TABLE debrief_calls ADD COLUMN transcript text`)
      console.log("✓ Added transcript column")
    } else {
      console.log("✓ transcript column already exists")
    }
    
    if (checkAnalysis.length === 0) {
      await db.execute(sql`ALTER TABLE debrief_calls ADD COLUMN call_analysis jsonb`)
      console.log("✓ Added call_analysis column")
    } else {
      console.log("✓ call_analysis column already exists")
    }
    
    console.log("\n✓ Migration complete!")
    await client.end()
  } catch (error: any) {
    console.error("Error:", error.message)
    await client.end()
    process.exit(1)
  }
}

addColumns()



