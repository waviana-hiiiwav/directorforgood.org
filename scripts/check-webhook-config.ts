import { config } from "dotenv"
import { resolve } from "path"

config({ path: resolve(process.cwd(), ".env.local") })

console.log("Checking webhook configuration...\n")

const webhookUrl = process.env.NEXT_PUBLIC_APP_URL
const webhookPath = "/api/meetings/webhook"
const fullWebhookUrl = webhookUrl ? `${webhookUrl}${webhookPath}` : null

console.log("Environment Variables:")
console.log(`  NEXT_PUBLIC_APP_URL: ${webhookUrl || "NOT SET"}`)
console.log(`  RETELL_WEBHOOK_SECRET: ${process.env.RETELL_WEBHOOK_SECRET ? "SET" : "NOT SET"}\n`)

if (fullWebhookUrl) {
  console.log("Webhook URL for Retell:")
  console.log(`  ${fullWebhookUrl}\n`)
  
  console.log("To configure in Retell Dashboard:")
  console.log("1. Go to: https://platform.retellai.com")
  console.log("2. Navigate to your agent settings")
  console.log("3. Find 'Webhook URL' section")
  console.log(`4. Set webhook URL to: ${fullWebhookUrl}`)
  console.log("5. (Optional) Set webhook secret if you have RETELL_WEBHOOK_SECRET\n")
  
  console.log("Testing webhook endpoint...")
  fetch(fullWebhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ test: true }),
  })
    .then((response) => {
      console.log(`  Status: ${response.status}`)
      if (response.status === 200 || response.status === 400) {
        console.log("  ✓ Webhook endpoint is accessible")
      } else {
        console.log(`  ⚠️  Unexpected status: ${response.status}`)
      }
    })
    .catch((error: any) => {
      console.log(`  ✗ Cannot reach webhook: ${error.message}`)
      console.log("  Make sure your dev server is running and ngrok is active")
    })
} else {
  console.log("⚠️  NEXT_PUBLIC_APP_URL is not set")
  console.log("Set it to your ngrok URL or production domain")
}

console.log("\nNote: The webhook is called by Retell when calls end.")
console.log("If the webhook URL isn't set in Retell dashboard, transcripts won't be written to Google Doc.")



