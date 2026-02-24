import * as fs from "fs"
import * as path from "path"

const envPath = path.join(process.cwd(), ".env.local")

if (!fs.existsSync(envPath)) {
  console.error("✗ .env.local file not found")
  process.exit(1)
}

let content = fs.readFileSync(envPath, "utf-8")

// Check for duplicate NEXT_PUBLIC_APP_URL entries
const lines = content.split("\n")
const urlLines = lines.filter(line => line.trim().startsWith("NEXT_PUBLIC_APP_URL"))

if (urlLines.length > 1) {
  console.log("⚠️  Found multiple NEXT_PUBLIC_APP_URL entries. Here's what you should do:\n")
  console.log("Remove all NEXT_PUBLIC_APP_URL lines and add ONE of these:\n")
  console.log("For LOCAL testing (with ngrok):")
  console.log("  NEXT_PUBLIC_APP_URL=https://your-ngrok-url.ngrok.io\n")
  console.log("For PRODUCTION (deployed):")
  console.log("  NEXT_PUBLIC_APP_URL=https://yourdomain.com\n")
  console.log("Or if you're testing locally without webhooks, you can skip this for now.")
  console.log("\nCurrent entries found:")
  urlLines.forEach((line, i) => {
    console.log(`  ${i + 1}. ${line.trim()}`)
  })
} else if (urlLines.length === 1) {
  const url = urlLines[0].split("=")[1]?.trim()
  if (url === "https://yourdomain.com" || url === "https://your-ngrok-url.ngrok.io") {
    console.log("⚠️  NEXT_PUBLIC_APP_URL is set to a placeholder value.")
    console.log("Update it to your actual URL:\n")
    console.log("For local testing: Get ngrok URL and set:")
    console.log("  NEXT_PUBLIC_APP_URL=https://your-actual-ngrok-url.ngrok.io\n")
    console.log("For production: Set to your domain:")
    console.log("  NEXT_PUBLIC_APP_URL=https://your-actual-domain.com")
  } else {
    console.log(`✓ NEXT_PUBLIC_APP_URL is set to: ${url}`)
  }
} else {
  console.log("⚠️  NEXT_PUBLIC_APP_URL is not set.")
  console.log("Add it to .env.local:\n")
  console.log("For local testing (with ngrok):")
  console.log("  NEXT_PUBLIC_APP_URL=https://your-ngrok-url.ngrok.io\n")
  console.log("For production:")
  console.log("  NEXT_PUBLIC_APP_URL=https://yourdomain.com")
}



