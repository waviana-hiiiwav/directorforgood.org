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

  let keyFile: any
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

  return { auth: new google.auth.GoogleAuth({
    credentials: keyFile,
    scopes: [
      "https://www.googleapis.com/auth/calendar.readonly",
    ],
  }), serviceAccountEmail: keyFile.client_email }
}

async function checkSetup() {
  try {
    const { auth, serviceAccountEmail } = getGoogleAuth()
    const calendar = google.calendar({ version: "v3", auth })
    
    console.log("Checking Google Calendar setup...\n")
    console.log(`Service Account Email: ${serviceAccountEmail}\n`)
    
    // Try to list calendars - this will tell us if API is enabled
    console.log("1. Testing Calendar API access...")
    try {
      const response = await calendar.calendarList.list()
      
      if (!response.data.items || response.data.items.length === 0) {
        console.log("   ⚠️  API is enabled but no calendars are accessible")
        console.log(`   Make sure you shared your calendar with: ${serviceAccountEmail}`)
        console.log("\n   The calendar sharing might take a few minutes to propagate.")
        return
      }
      
      console.log(`   ✓ API is enabled and accessible`)
      console.log(`   ✓ Found ${response.data.items.length} calendar(s)\n`)
      
      console.log("2. Accessible calendars:")
      response.data.items.forEach((cal, index) => {
        console.log(`   ${index + 1}. ${cal.summary || "(No name)"}`)
        console.log(`      ID: ${cal.id}`)
        console.log(`      Access: ${cal.accessRole}`)
        if (cal.primary) console.log(`      ⭐ Primary`)
        console.log("")
      })
      
      // Check for bosko calendar
      const boskoCal = response.data.items.find(
        cal => cal.id === "bosko@hiiiwav.org" || 
               cal.id?.toLowerCase().includes("bosko") ||
               cal.summary?.toLowerCase().includes("bosko")
      )
      
      if (boskoCal) {
        console.log("3. ✓ Your calendar is accessible!")
        console.log(`   Calendar ID: ${boskoCal.id}`)
      } else {
        console.log("3. ⚠️  Could not find bosko@hiiiwav.org")
        console.log("   Make sure you shared the correct calendar")
      }
      
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status
        const message = error.response.data?.error?.message || error.message
        
        console.log(`   ✗ Error: ${status} - ${message}\n`)
        
        if (status === 403) {
          console.log("   ⚠️  Google Calendar API is NOT enabled")
          console.log("   Enable it at: https://console.cloud.google.com/apis/library/calendar-json.googleapis.com")
          console.log("   Wait 2-3 minutes after enabling, then try again.")
        } else if (status === 404) {
          console.log("   ⚠️  No calendars accessible")
          console.log(`   Share your calendar with: ${serviceAccountEmail}`)
        }
      } else {
        throw error
      }
    }
    
  } catch (error: any) {
    console.error("✗ Setup check failed:")
    console.error(error)
  }
}

checkSetup()



