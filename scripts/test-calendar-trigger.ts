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

async function testCalendarAccess() {
  try {
    console.log("Testing Google Calendar access...\n")
    
    const auth = getGoogleAuth()
    const calendar = google.calendar({ version: "v3", auth })
    
    // Get calendar info
    console.log(`1. Getting calendar info for: ${CALENDAR_EMAIL}`)
    const calendarInfo = await calendar.calendars.get({
      calendarId: CALENDAR_EMAIL,
    })
    console.log(`   ✓ Calendar: ${calendarInfo.data.summary || CALENDAR_EMAIL}`)
    console.log(`   ✓ Timezone: ${calendarInfo.data.timeZone}`)
    
    // List recent events
    console.log("\n2. Fetching recent events...")
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const events = await calendar.events.list({
      calendarId: CALENDAR_EMAIL,
      timeMin: oneWeekAgo.toISOString(),
      timeMax: now.toISOString(),
      maxResults: 5,
      singleEvents: true,
      orderBy: "startTime",
    })
    
    if (events.data.items && events.data.items.length > 0) {
      console.log(`   ✓ Found ${events.data.items.length} recent events:`)
      events.data.items.forEach((event, index) => {
        const start = event.start?.dateTime || event.start?.date
        const end = event.end?.dateTime || event.end?.date
        console.log(`   ${index + 1}. ${event.summary || "(No title)"}`)
        console.log(`      Start: ${start}`)
        console.log(`      End: ${end}`)
        console.log(`      Status: ${event.status}`)
      })
    } else {
      console.log("   No recent events found")
    }
    
    // Check for upcoming events
    console.log("\n3. Checking upcoming events (next 7 days)...")
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    const upcomingEvents = await calendar.events.list({
      calendarId: CALENDAR_EMAIL,
      timeMin: now.toISOString(),
      timeMax: oneWeekFromNow.toISOString(),
      maxResults: 5,
      singleEvents: true,
      orderBy: "startTime",
    })
    
    if (upcomingEvents.data.items && upcomingEvents.data.items.length > 0) {
      console.log(`   ✓ Found ${upcomingEvents.data.items.length} upcoming events:`)
      upcomingEvents.data.items.forEach((event, index) => {
        const start = event.start?.dateTime || event.start?.date
        console.log(`   ${index + 1}. ${event.summary || "(No title)"}`)
        console.log(`      Start: ${start}`)
        if (event.attendees && event.attendees.length > 0) {
          const attendeeEmails = event.attendees
            .map(a => a.email)
            .filter(Boolean)
            .slice(0, 3)
          console.log(`      Attendees: ${attendeeEmails.join(", ")}`)
        }
      })
    } else {
      console.log("   No upcoming events found")
    }
    
    console.log("\n✓ Calendar access test complete!")
    console.log("\nTo test the trigger:")
    console.log("1. Create a test meeting that ends in the next 30 minutes")
    console.log("2. Wait for the meeting to end")
    console.log("3. The system should automatically trigger a debrief call")
    
  } catch (error: any) {
    console.error("\n✗ Test failed:")
    if (error.response) {
      console.error(`   Status: ${error.response.status}`)
      console.error(`   Message: ${error.response.data?.error?.message || error.message}`)
      
      if (error.response.status === 403) {
        console.error("\n   The service account needs access to the calendar.")
        console.error(`   Share the calendar ${CALENDAR_EMAIL} with your service account email.`)
      } else if (error.response.status === 404) {
        console.error("\n   Calendar not found.")
        console.error(`   Make sure ${CALENDAR_EMAIL} is a valid calendar ID.`)
      }
    } else {
      console.error(error)
    }
    process.exit(1)
  }
}

testCalendarAccess()



