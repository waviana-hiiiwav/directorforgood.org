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

const client = postgres(process.env.DATABASE_URL, {
  connect_timeout: 60,
  idle_timeout: 20,
  max_lifetime: 60 * 30,
})

const db = drizzle(client)

async function verifyTable() {
  try {
    console.log("Verifying debrief_calls table...\n")
    
    // Check columns
    const columns = await db.execute(
      sql`SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'debrief_calls'
        ORDER BY ordinal_position`
    )
    
    console.log("Columns:")
    columns.forEach((col: any) => {
      const nullable = col.is_nullable === "YES" ? "nullable" : "NOT NULL"
      const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : ""
      console.log(`  ✓ ${col.column_name} (${col.data_type}) ${nullable}${defaultVal}`)
    })
    
    // Check unique constraint
    const constraints = await db.execute(
      sql`SELECT 
          tc.constraint_name,
          kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'debrief_calls'
          AND tc.constraint_type = 'UNIQUE'`
    )
    
    console.log("\nUnique constraints:")
    if (constraints.length > 0) {
      constraints.forEach((constraint: any) => {
        console.log(`  ✓ ${constraint.constraint_name} on ${constraint.column_name}`)
      })
    } else {
      console.log("  ✗ No unique constraints found!")
    }
    
    // Check primary key
    const primaryKeys = await db.execute(
      sql`SELECT 
          kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'debrief_calls'
          AND tc.constraint_type = 'PRIMARY KEY'`
    )
    
    console.log("\nPrimary key:")
    primaryKeys.forEach((pk: any) => {
      console.log(`  ✓ ${pk.column_name}`)
    })
    
    console.log("\n✓ Table verification complete!")
    await client.end()
    process.exit(0)
  } catch (error) {
    console.error("✗ Verification failed:")
    console.error(error)
    await client.end()
    process.exit(1)
  }
}

verifyTable()



