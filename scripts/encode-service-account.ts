/**
 * Helper script to base64 encode your Google Service Account JSON
 * 
 * Usage:
 *   npx tsx scripts/encode-service-account.ts path/to/service-account.json
 * 
 * This will output the base64-encoded string you can paste into .env.local
 */

import * as fs from "fs"
import * as path from "path"

const filePath = process.argv[2]

if (!filePath) {
  console.error("Usage: npx tsx scripts/encode-service-account.ts <path-to-service-account.json>")
  process.exit(1)
}

const fullPath = path.resolve(filePath)

if (!fs.existsSync(fullPath)) {
  console.error(`❌ File not found: ${fullPath}`)
  process.exit(1)
}

try {
  const jsonContent = fs.readFileSync(fullPath, "utf-8")
  
  // Validate it's valid JSON
  JSON.parse(jsonContent)
  
  // Encode to base64
  const encoded = Buffer.from(jsonContent).toString("base64")
  
  console.log("\n✅ Base64 encoded service account key:\n")
  console.log(encoded)
  console.log("\n📋 Copy this into your .env.local as GOOGLE_SERVICE_ACCOUNT_KEY\n")
  
  // Also show the client_email for sharing the Google Doc
  const sa = JSON.parse(jsonContent)
  if (sa.client_email) {
    console.log(`📧 Don't forget to share your Google Doc with: ${sa.client_email}\n`)
  }
} catch (error) {
  console.error("❌ Error:", error instanceof Error ? error.message : error)
  process.exit(1)
}



