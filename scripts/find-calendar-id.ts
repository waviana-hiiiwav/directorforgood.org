import { config } from "dotenv"
import { resolve } from "path"
import { google } from "googleapis"

// Load .env.local file
config({ path: resolve(process.cwd(), ".env.local") })

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
    ],
  })
}

async function findCalendars() {
  try {
    console.log("Finding accessible calendars...\n")
    
    const auth = getGoogleAuth()
    const calendar = google.calendar({ version: "v3", auth })
    
    // List all calendars the service account can access
    const response = await calendar.calendarList.list()
    
    if (!response.data.items || response.data.items.length === 0) {
      console.log("✗ No calendars found.")
      console.log("\nThis usually means:")
      console.log("1. The calendar hasn't been shared with the service account yet")
      console.log("2. Google Calendar API is not enabled")
      console.log("\nService account email:", (auth.credentials as any)?.client_email || "check your GOOGLE_SERVICE_ACCOUNT_KEY")
      process.exit(1)
    }
    
    console.log(`✓ Found ${response.data.items.length} accessible calendar(s):\n`)
    
    response.data.items.forEach((cal, index) => {
      console.log(`${index + 1}. ${cal.summary || "(No name)"}`)
      console.log(`   ID: ${cal.id}`)
      console.log(`   Access Role: ${cal.accessRole}`)
      if (cal.primary) {
        console.log(`   ⭐ Primary calendar`)
      }
      console.log("")
    })
    
    // Look for bosko@hiiiwav.org
    const boskoCalendar = response.data.items.find(
      cal => cal.id === "bosko@hiiiwav.org" || 
             cal.id?.includes("bosko") ||
             cal.summary?.toLowerCase().includes("bosko")
    )
    
    if (boskoCalendar) {
      console.log("✓ Found your calendar!")
      console.log(`   Use this ID: ${boskoCalendar.id}`)
    } else {
      console.log("⚠️  Could not find bosko@hiiiwav.org calendar")
      console.log("   Make sure it's shared with the service account")
    }
    
  } catch (error: any) {
    console.error("\n✗ Error:")
    if (error.response) {
      console.error(`   Status: ${error.response.status}`)
      console.error(`   Message: ${error.response.data?.error?.message || error.message}`)
      
      if (error.response.status === 403) {
        console.error("\n   Google Calendar API is not enabled.")
        console.error("   Enable it at: https://console.cloud.google.com/apis/library/calendar-json.googleapis.com")
      } else if (error.response.status === 404) {
        console.error("\n   No calendars accessible.")
        console.error("   Share your calendar with the service account first.")
      }
    } else {
      console.error(error)
    }
    process.exit(1)
  }
}

findCalendars()



