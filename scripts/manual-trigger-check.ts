import { config } from "dotenv"
import { resolve } from "path"
import { google } from "googleapis"

config({ path: resolve(process.cwd(), ".env.local") })

const CALENDAR_EMAIL = "bosko@hiiiwav.org"

function getGoogleAuth() {
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY!
  let keyFile: any
  try {
    keyFile = JSON.parse(Buffer.from(credentials, "base64").toString("utf-8"))
  } catch {
    keyFile = JSON.parse(credentials)
  }
  return new google.auth.GoogleAuth({
    credentials: keyFile,
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
  })
}

async function checkRecentMeetings() {
  const auth = getGoogleAuth()
  const calendar = google.calendar({ version: "v3", auth })
  
  const now = new Date()
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000)
  
  console.log("Checking for meetings that ended in the last 30 minutes...\n")
  console.log(`Time range: ${thirtyMinutesAgo.toLocaleString()} to ${now.toLocaleString()}\n`)
  
  const response = await calendar.events.list({
    calendarId: CALENDAR_EMAIL,
    timeMin: thirtyMinutesAgo.toISOString(),
    timeMax: now.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  })
  
  const events = response.data.items || []
  
  if (events.length === 0) {
    console.log("⚠️  No meetings found that ended in the last 30 minutes")
    console.log("\nMake sure:")
    console.log("1. The meeting has actually ended")
    console.log("2. The meeting end time is within the last 30 minutes")
    console.log("3. The meeting is on the correct calendar")
  } else {
    console.log(`✓ Found ${events.length} meeting(s):\n`)
    
    events.forEach((event, i) => {
      const endTime = event.end?.dateTime ? new Date(event.end.dateTime) : null
      const minutesAgo = endTime ? Math.round((now.getTime() - endTime.getTime()) / 60000) : null
      
      console.log(`${i + 1}. ${event.summary || "(No title)"}`)
      console.log(`   End time: ${endTime?.toLocaleString() || "N/A"}`)
      console.log(`   Ended: ${minutesAgo !== null ? `${minutesAgo} minutes ago` : "N/A"}`)
      console.log(`   Status: ${event.status}`)
      console.log(`   ID: ${event.id}`)
      console.log("")
    })
    
    console.log("These meetings should trigger debrief calls.")
    console.log("Check your phone - you should receive a call soon!")
    console.log("\nIf no call comes, check:")
    console.log("1. Server logs for webhook activity")
    console.log("2. That EXECUTIVE_PHONE_NUMBER is set correctly")
    console.log("3. That Retell API is configured")
  }
}

checkRecentMeetings().catch(console.error)



