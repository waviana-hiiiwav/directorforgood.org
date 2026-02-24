import { config } from "dotenv"
import { resolve } from "path"
import { google } from "googleapis"

// Load .env.local file
config({ path: resolve(process.cwd(), ".env.local") })

const CALENDAR_EMAIL = "bosko@hiiiwav.org"

function getGoogleAuth() {
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  
  if (!credentials) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY not set")
  }

  let keyFile: object
  try {
    const decoded = Buffer.from(credentials, "base64").toString("utf-8")
    keyFile = JSON.parse(decoded)
  } catch {
    try {
      keyFile = JSON.parse(credentials)
    } catch {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY is not valid JSON")
    }
  }

  return new google.auth.GoogleAuth({
    credentials: keyFile,
    scopes: [
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/documents",
    ],
  })
}

async function setupCalendarWatch() {
  try {
    console.log("Setting up Google Calendar watch...\n")
    
    const auth = getGoogleAuth()
    const calendar = google.calendar({ version: "v3", auth })
    
    // Verify calendar access
    console.log(`1. Verifying access to calendar: ${CALENDAR_EMAIL}`)
    try {
      const calendarInfo = await calendar.calendars.get({
        calendarId: CALENDAR_EMAIL,
      })
      console.log(`   ✓ Calendar found: ${calendarInfo.data.summary || CALENDAR_EMAIL}`)
    } catch (error: any) {
      if (error.code === 404) {
        console.error(`   ✗ Calendar not found or not accessible`)
        console.error(`   Make sure the calendar ${CALENDAR_EMAIL} is shared with your service account email`)
        process.exit(1)
      }
      throw error
    }
    
    // Check if NEXT_PUBLIC_APP_URL is set
    const webhookUrl = process.env.NEXT_PUBLIC_APP_URL
    if (!webhookUrl) {
      console.error("\n✗ NEXT_PUBLIC_APP_URL is not set in .env.local")
      console.error("   Set it to your app URL (e.g., https://yourdomain.com or http://localhost:3000 for local)")
      process.exit(1)
    }
    
    const fullWebhookUrl = `${webhookUrl}/api/meetings/calendar`
    console.log(`\n2. Webhook URL: ${fullWebhookUrl}`)
    
    // Create watch
    console.log("\n3. Creating calendar watch...")
    const channelId = `debrief-${Date.now()}`
    const expiration = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    
    const response = await calendar.events.watch({
      calendarId: CALENDAR_EMAIL,
      requestBody: {
        id: channelId,
        type: "web_hook",
        address: fullWebhookUrl,
        expiration: String(expiration),
      },
    })
    
    console.log("   ✓ Watch created successfully!")
    console.log(`\n   Channel ID: ${response.data.id}`)
    console.log(`   Resource ID: ${response.data.resourceId}`)
    console.log(`   Expires: ${new Date(Number(response.data.expiration)).toLocaleString()}`)
    
    console.log("\n✓ Calendar watch setup complete!")
    console.log("\nNext steps:")
    console.log("1. Make sure your webhook URL is publicly accessible")
    console.log("2. For local testing, use ngrok: ngrok http 3000")
    console.log("3. The watch will expire in 7 days - you'll need to renew it")
    console.log("4. Test by creating a meeting that ends in the next 30 minutes")
    
  } catch (error: any) {
    console.error("\n✗ Setup failed:")
    if (error.response) {
      console.error(`   Status: ${error.response.status}`)
      console.error(`   Message: ${error.response.data?.error?.message || error.message}`)
      
      if (error.response.status === 403) {
        console.error("\n   This usually means:")
        console.error("   - The service account doesn't have access to the calendar")
        console.error("   - The calendar needs to be shared with the service account email")
        console.error("   - Google Calendar API might not be enabled")
      }
    } else {
      console.error(error)
    }
    process.exit(1)
  }
}

setupCalendarWatch()



