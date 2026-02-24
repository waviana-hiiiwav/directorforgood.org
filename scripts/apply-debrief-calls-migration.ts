import { config } from "dotenv"
import { resolve } from "path"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { sql } from "drizzle-orm"

// Load .env.local file
config({ path: resolve(process.cwd(), ".env.local") })

if (!process.env.DATABASE_URL) {
  console.error("✗ DATABASE_URL is not set in .env.local")
  process.exit(1)
}

// Create database connection
const client = postgres(process.env.DATABASE_URL, {
  connect_timeout: 60,
  idle_timeout: 20,
  max_lifetime: 60 * 30,
})

const db = drizzle(client)

const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS "debrief_calls" (
	"id" serial PRIMARY KEY NOT NULL,
	"calendar_event_id" text NOT NULL,
	"meeting_title" text NOT NULL,
	"meeting_date" timestamp NOT NULL,
	"call_id" text,
	"status" text DEFAULT 'pending',
	"retell_call_id" text,
	"transcript" text,
	"call_analysis" jsonb,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "debrief_calls_calendar_event_id_unique" UNIQUE("calendar_event_id")
);
`

const ADD_COLUMNS_SQL = `
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'debrief_calls' AND column_name = 'transcript') THEN
    ALTER TABLE debrief_calls ADD COLUMN transcript text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'debrief_calls' AND column_name = 'call_analysis') THEN
    ALTER TABLE debrief_calls ADD COLUMN call_analysis jsonb;
  END IF;
END $$;
`

async function applyMigration() {
  try {
    console.log("Checking if debrief_calls table exists...")
    
    // Check if table exists
    const checkResult = await db.execute(
      sql`SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'debrief_calls'
      )`
    )
    
    const exists = checkResult[0]?.exists
    
    if (exists) {
      console.log("✓ debrief_calls table already exists.")
      console.log("Checking for transcript columns...")
      
      // Add columns if they don't exist
      await db.execute(sql.raw(ADD_COLUMNS_SQL))
      console.log("✓ Columns verified/added")
      
      await client.end()
      process.exit(0)
    }
    
    console.log("Applying migration...")
    await db.execute(sql.raw(MIGRATION_SQL))
    console.log("✓ Table created/verified")
    
    console.log("Adding transcript columns if needed...")
    await db.execute(sql.raw(ADD_COLUMNS_SQL))
    console.log("✓ Columns verified")
    
    console.log("✓ Migration applied successfully!")
    
    // Verify the table was created
    const verifyResult = await db.execute(
      sql`SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'debrief_calls'
        ORDER BY ordinal_position`
    )
    
    console.log("\nTable columns:")
    verifyResult.forEach((col: any) => {
      console.log(`  - ${col.column_name} (${col.data_type})`)
    })
    
    // Verify unique constraint
    const constraintResult = await db.execute(
      sql`SELECT constraint_name, constraint_type
        FROM information_schema.table_constraints
        WHERE table_name = 'debrief_calls'
        AND constraint_type = 'UNIQUE'`
    )
    
    console.log("\nUnique constraints:")
    constraintResult.forEach((constraint: any) => {
      console.log(`  - ${constraint.constraint_name}`)
    })
    
    await client.end()
    process.exit(0)
  } catch (error) {
    console.error("✗ Migration failed:")
    console.error(error)
    await client.end()
    process.exit(1)
  }
}

applyMigration()



