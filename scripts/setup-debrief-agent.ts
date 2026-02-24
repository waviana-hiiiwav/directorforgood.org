/**
 * Interactive setup script for Meeting Debrief Agent
 * 
 * Usage:
 *   npx tsx scripts/setup-debrief-agent.ts
 * 
 * This will guide you through collecting all the required values
 * and generate a .env.local file with the configuration.
 */

import * as fs from "fs"
import * as path from "path"
import { createDebriefDocument } from "../lib/google-docs"

async function main() {
  console.log("🎯 Meeting Debrief Agent Setup\n")
  console.log("This script will help you configure all required environment variables.\n")

  const config: Record<string, string> = {}

  // Step 1: Retell API Key
  console.log("=".repeat(60))
  console.log("STEP 1: Retell AI Configuration")
  console.log("=".repeat(60))
  console.log("\n1. Go to Retell Dashboard → Settings → API Keys")
  console.log("2. Copy your API Key")
  const retellApiKey = await prompt("Retell API Key: ")
  config.RETELL_API_KEY = retellApiKey.trim()

  console.log("\n3. Go to Retell Dashboard → Agents")
  console.log("4. Find your 'HiiiWAV Meeting Debrief Agent'")
  console.log("5. Copy the Agent ID (starts with something like 'oBeDLo...')")
  const agentId = await prompt("Retell Agent ID: ")
  config.RETELL_DEBRIEF_AGENT_ID = agentId.trim()

  console.log("\n6. Go to Retell Dashboard → Phone Numbers")
  console.log("7. Find your purchased number")
  console.log("8. Copy it in E.164 format (e.g., +14157774444)")
  const retellPhone = await prompt("Retell Phone Number (E.164): ")
  config.RETELL_PHONE_NUMBER = retellPhone.trim()

  // Step 2: Executive Phone
  console.log("\n" + "=".repeat(60))
  console.log("STEP 2: Executive Phone Number")
  console.log("=".repeat(60))
  console.log("\nEnter the phone number to receive debrief calls")
  console.log("Format: +1XXXXXXXXXX (E.164 format)")
  const execPhone = await prompt("Executive Phone Number: ")
  config.EXECUTIVE_PHONE_NUMBER = execPhone.trim()

  // Step 3: Google Service Account
  console.log("\n" + "=".repeat(60))
  console.log("STEP 3: Google Service Account")
  console.log("=".repeat(60))
  console.log("\n1. Go to Google Cloud Console → IAM & Admin → Service Accounts")
  console.log("2. Create a new service account (or use existing)")
  console.log("3. Create a JSON key and download it")
  console.log("4. Copy the entire JSON content here (or path to file)")
  const serviceAccountInput = await prompt("Service Account JSON (or file path): ")
  
  let serviceAccountKey: string
  if (serviceAccountInput.trim().startsWith("/") || serviceAccountInput.trim().startsWith("./")) {
    // It's a file path
    const filePath = path.resolve(serviceAccountInput.trim())
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`)
      process.exit(1)
    }
    serviceAccountKey = fs.readFileSync(filePath, "utf-8")
  } else {
    // It's the JSON content directly
    serviceAccountKey = serviceAccountInput.trim()
  }

  // Validate JSON
  try {
    JSON.parse(serviceAccountKey)
  } catch {
    console.error("❌ Invalid JSON. Please check your service account key.")
    process.exit(1)
  }

  // Option to base64 encode (more secure for env vars)
  console.log("\nWould you like to base64 encode the key? (recommended for .env files)")
  const encodeChoice = await prompt("Encode? (y/n): ")
  if (encodeChoice.toLowerCase() === "y") {
    config.GOOGLE_SERVICE_ACCOUNT_KEY = Buffer.from(serviceAccountKey).toString("base64")
  } else {
    config.GOOGLE_SERVICE_ACCOUNT_KEY = serviceAccountKey
  }

  // Step 4: Google Doc
  console.log("\n" + "=".repeat(60))
  console.log("STEP 4: Google Doc for Meeting Notes")
  console.log("=".repeat(60))
  console.log("\nOption 1: Create a new Google Doc automatically")
  console.log("Option 2: Use an existing Google Doc")
  const docChoice = await prompt("Create new or use existing? (new/existing): ")

  let docId: string
  if (docChoice.toLowerCase() === "new") {
    console.log("\nCreating new Google Doc...")
    try {
      // Temporarily set the key to create the doc
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY = serviceAccountKey
      const newDocId = await createDebriefDocument("Meeting Debriefs - HiiiWAV")
      docId = newDocId
      console.log(`✅ Created new Google Doc!`)
      console.log(`   Document ID: ${docId}`)
      console.log(`   URL: https://docs.google.com/document/d/${docId}`)
    } catch (error) {
      console.error("❌ Failed to create Google Doc:", error)
      console.log("\nFalling back to manual creation...")
      const manualDocId = await prompt("Enter existing Google Doc ID: ")
      docId = manualDocId.trim()
    }
  } else {
    console.log("\n1. Open your Google Doc")
    console.log("2. Copy the Document ID from the URL:")
    console.log("   https://docs.google.com/document/d/DOCUMENT_ID/edit")
    const manualDocId = await prompt("Google Doc ID: ")
    docId = manualDocId.trim()
  }

  config.GOOGLE_DEBRIEF_DOC_ID = docId

  // Step 5: Share doc with service account
  console.log("\n" + "=".repeat(60))
  console.log("STEP 5: Share Google Doc with Service Account")
  console.log("=".repeat(60))
  
  // Extract service account email from JSON
  const saJson = JSON.parse(serviceAccountKey)
  const serviceAccountEmail = saJson.client_email
  
  console.log(`\n⚠️  IMPORTANT: Share your Google Doc with this email:`)
  console.log(`   ${serviceAccountEmail}`)
  console.log(`\n1. Open your Google Doc`)
  console.log(`2. Click Share → Add ${serviceAccountEmail}`)
  console.log(`3. Give it "Editor" permission`)
  console.log(`4. Click Done`)
  
  await prompt("\nPress Enter when you've shared the doc...")

  // Step 6: Optional webhook secret
  console.log("\n" + "=".repeat(60))
  console.log("STEP 6: Webhook Security (Optional)")
  console.log("=".repeat(60))
  console.log("\nFor production, set a webhook secret in Retell dashboard")
  console.log("and enter it here for signature verification")
  const webhookSecret = await prompt("Retell Webhook Secret (optional, press Enter to skip): ")
  if (webhookSecret.trim()) {
    config.RETELL_WEBHOOK_SECRET = webhookSecret.trim()
  }

  // Generate .env.local
  console.log("\n" + "=".repeat(60))
  console.log("Generating .env.local file...")
  console.log("=".repeat(60))

  const envContent = Object.entries(config)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n")

  const envPath = path.join(process.cwd(), ".env.local")
  fs.writeFileSync(envPath, envContent + "\n")

  console.log(`\n✅ Configuration saved to ${envPath}`)
  console.log("\nNext steps:")
  console.log("1. Verify configuration:")
  console.log("   npm run dev")
  console.log("   curl http://localhost:3000/api/meetings/status")
  console.log("\n2. Test a debrief call:")
  console.log("   curl -X POST http://localhost:3000/api/meetings/trigger \\")
  console.log("     -H 'Content-Type: application/json' \\")
  console.log("     -d '{\"meetingTitle\":\"Test Meeting\",\"executiveName\":\"Bosko\"}'")
  console.log("\n🎉 Setup complete!")
}

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(question)
    process.stdin.once("data", (data) => {
      resolve(data.toString().trim())
    })
  })
}

main().catch((error) => {
  console.error("Setup failed:", error)
  process.exit(1)
})



