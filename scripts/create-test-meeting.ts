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
      "https://www.googleapis.com/auth/calendar",
    ],
  })
}

async function createTestMeeting() {
  try {
    const auth = getGoogleAuth()
    const calendar = google.calendar({ version: "v3", auth })
    
    // Create a meeting that ends in 1 minute
    const now = new Date()
    const startTime = new Date(now.getTime() - 29 * 60 * 1000) // Started 29 minutes ago
    const endTime = new Date(now.getTime() + 1 * 60 * 1000) // Ends in 1 minute
    
    console.log("Creating test meeting...\n")
    console.log(`Start: ${startTime.toLocaleString()}`)
    console.log(`End: ${endTime.toLocaleString()} (in 1 minute)\n`)
    
    const event = {
      summary: "Test Debrief Meeting",
      description: "This is a test meeting to trigger the debrief call system.",
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: "America/Los_Angeles",
      },
      attendees: [
        { email: "bosko@hiiiwav.org" },
        { email: "test@example.com", displayName: "Test Attendee" },
      ],
    }
    
    const response = await calendar.events.insert({
      calendarId: CALENDAR_EMAIL,
      requestBody: event,
    })
    
    console.log("✓ Test meeting created!")
    console.log(`\nEvent ID: ${response.data.id}`)
    console.log(`Title: ${response.data.summary}`)
    console.log(`View: ${response.data.htmlLink}\n`)
    console.log("The meeting will end in 1 minute.")
    console.log("After it ends, the system should automatically trigger a debrief call.")
    console.log("\nYou can check the logs or your phone for the call.")
    
  } catch (error: any) {
    console.error("\n✗ Failed to create meeting:")
    if (error.response) {
      console.error(`   Status: ${error.response.status}`)
      console.error(`   Message: ${error.response.data?.error?.message || error.message}`)
      
      if (error.response.status === 403) {
        console.error("\n   The service account needs write access to create events.")
        console.error("   You'll need to create the meeting manually in Google Calendar.")
      }
    } else {
      console.error(error)
    }
    
    console.log("\nAlternative: Create the meeting manually in Google Calendar:")
    console.log("1. Open Google Calendar")
    console.log("2. Create a new event")
    console.log("3. Set start time to 29 minutes ago")
    console.log("4. Set end time to 1 minute from now")
    console.log("5. Save the event")
  }
}

createTestMeeting()



