import { config } from "dotenv"
import { resolve } from "path"

// Load .env.local file
config({ path: resolve(process.cwd(), ".env.local") })

console.log(`
╔══════════════════════════════════════════════════════════════╗
║     Google Calendar Trigger Setup Guide                      ║
╚══════════════════════════════════════════════════════════════╝

To set up the calendar trigger, you need to complete these steps:

1. ENABLE GOOGLE CALENDAR API
   ─────────────────────────────────────────────────────────────
   The Calendar API needs to be enabled in your Google Cloud project.
   
   Go to: https://console.cloud.google.com/apis/library/calendar-json.googleapis.com
   
   Or visit: https://console.developers.google.com/apis/api/calendar-json.googleapis.com/overview
   
   Click "Enable" and wait a few minutes for it to propagate.

2. SHARE CALENDAR WITH SERVICE ACCOUNT
   ─────────────────────────────────────────────────────────────
   Your calendar (bosko@hiiiwav.org) needs to be shared with your 
   service account email.
   
   To find your service account email:
   - Check your GOOGLE_SERVICE_ACCOUNT_KEY JSON
   - Look for the "client_email" field
   - It will look like: something@project-id.iam.gserviceaccount.com
   
   Then:
   - Open Google Calendar
   - Go to Settings → Settings for my calendars → bosko@hiiiwav.org
   - Click "Share with specific people"
   - Add your service account email
   - Give it "See all event details" permission
   - Click "Send"

3. SET ENVIRONMENT VARIABLES
   ─────────────────────────────────────────────────────────────
   Make sure these are set in .env.local:
   
   ✓ GOOGLE_SERVICE_ACCOUNT_KEY (already set)
   ✓ GOOGLE_CALENDAR_ID=bosko@hiiiwav.org (optional, defaults to this)
   ✓ NEXT_PUBLIC_APP_URL (your app URL - needed for webhooks)
   ✓ EXECUTIVE_NAME (optional, defaults to "Bosko")
   ✓ EXECUTIVE_PHONE_NUMBER (your phone number in E.164 format)

4. SET UP CALENDAR WATCH
   ─────────────────────────────────────────────────────────────
   After completing steps 1-3, run:
   
   npm run setup:calendar
   
   Or call the API endpoint:
   GET /api/meetings/calendar

5. TEST THE TRIGGER
   ─────────────────────────────────────────────────────────────
   Create a test meeting that ends in the next 30 minutes.
   The system will automatically trigger a debrief call after it ends.

╔══════════════════════════════════════════════════════════════╗
║  Current Configuration Check                                 ║
╚══════════════════════════════════════════════════════════════╝
`)

const checks = {
  "GOOGLE_SERVICE_ACCOUNT_KEY": !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
  "GOOGLE_CALENDAR_ID": process.env.GOOGLE_CALENDAR_ID || "bosko@hiiiwav.org (default)",
  "NEXT_PUBLIC_APP_URL": !!process.env.NEXT_PUBLIC_APP_URL,
  "EXECUTIVE_PHONE_NUMBER": !!process.env.EXECUTIVE_PHONE_NUMBER,
  "RETELL_API_KEY": !!process.env.RETELL_API_KEY,
  "RETELL_DEBRIEF_AGENT_ID": !!process.env.RETELL_DEBRIEF_AGENT_ID,
}

Object.entries(checks).forEach(([key, value]) => {
  const status = value ? "✓" : "✗"
  const displayValue = typeof value === "string" ? value : (value ? "set" : "not set")
  console.log(`${status} ${key}: ${displayValue}`)
})

if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
  try {
    let keyFile: any
    try {
      const decoded = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY, "base64").toString("utf-8")
      keyFile = JSON.parse(decoded)
    } catch {
      keyFile = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
    }
    
    console.log(`\n✓ Service Account Email: ${keyFile.client_email}`)
    console.log(`\n⚠️  IMPORTANT: Share your calendar with this email address!`)
  } catch (e) {
    console.log("\n✗ Could not parse service account key")
  }
}

console.log(`\n`)



