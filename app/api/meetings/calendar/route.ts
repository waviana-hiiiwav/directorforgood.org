import { NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"
import { triggerDebriefCall } from "@/lib/retell"
import { db } from "@/db"
import { debriefCalls } from "@/db/schema"
import { eq } from "drizzle-orm"

/**
 * POST /api/meetings/calendar
 * 
 * Google Calendar push notification webhook.
 * Called when calendar events change.
 * 
 * Setup:
 * 1. Create a channel watch on the calendar
 * 2. This endpoint receives notifications when events change
 * 3. We check for recently ended meetings
 * 4. Trigger debrief calls for all qualifying meetings
 */
export async function POST(request: NextRequest) {
  try {
    // Verify this is a Google Calendar notification
    const channelId = request.headers.get("x-goog-channel-id")
    const resourceState = request.headers.get("x-goog-resource-state")
    
    console.log("[Calendar] Webhook received:", { channelId, resourceState })
    
    // Google sends a "sync" message when setting up the watch
    if (resourceState === "sync") {
      console.log("[Calendar] Sync message received, acknowledging")
      return NextResponse.json({ status: "sync acknowledged" })
    }
    
    // For actual events, we need to query the calendar
    if (resourceState === "exists") {
      await processCalendarUpdate()
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[Calendar] Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}

/**
 * Process calendar update - find recently ended meetings
 */
async function processCalendarUpdate() {
  const auth = getGoogleAuth()
  const calendar = google.calendar({ version: "v3", auth })
  
  // Look for events that ended in the last 30 minutes
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
  const now = new Date()
  
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "bosko@hiiiwav.org"
  const response = await calendar.events.list({
    calendarId: calendarId,
    timeMin: thirtyMinutesAgo.toISOString(),
    timeMax: now.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  })
  
  const events = response.data.items || []
  console.log("[Calendar] Found", events.length, "recent events")
  
  for (const event of events) {
    // Check if this event qualifies for a debrief
    if (await shouldTriggerDebrief(event)) {
      await triggerDebriefForEvent(event)
    }
  }
}

/**
 * Determine if an event should trigger a debrief call
 */
async function shouldTriggerDebrief(event: CalendarEvent): Promise<boolean> {
  if (!event.id) {
    console.log("[Calendar] Event has no ID, skipping")
    return false
  }
  
  // Skip cancelled events
  if (event.status === "cancelled") {
    console.log("[Calendar] Event cancelled:", event.summary)
    return false
  }
  
  // Skip all-day events (no specific end time)
  if (!event.end?.dateTime) {
    console.log("[Calendar] All-day event, skipping:", event.summary)
    return false
  }
  
  // Check if meeting actually ended (within last 30 min)
  const endTime = new Date(event.end.dateTime)
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
  if (endTime < thirtyMinutesAgo) {
    console.log("[Calendar] Event ended too long ago:", event.summary)
    return false
  }
  
  // Check if we already processed this event
  const existing = await db
    .select()
    .from(debriefCalls)
    .where(eq(debriefCalls.calendarEventId, event.id))
    .limit(1)
  
  if (existing.length > 0) {
    console.log("[Calendar] Event already processed:", event.summary)
    return false
  }
  
  console.log("[Calendar] Event qualifies for debrief:", event.summary)
  return true
}

/**
 * Extract attendee names from calendar event
 */
function extractAttendeeNames(
  attendees: Array<{ email?: string | null; displayName?: string | null }>
): string[] {
  return attendees
    .filter(a => a.email) // Only include attendees with emails
    .map(a => a.displayName || a.email?.split("@")[0] || "Unknown")
    .filter((name, index, self) => self.indexOf(name) === index) // Remove duplicates
}

/**
 * Trigger a debrief call for a calendar event
 */
async function triggerDebriefForEvent(event: CalendarEvent) {
  if (!event.id) {
    console.error("[Calendar] Cannot trigger debrief: event has no ID")
    return
  }
  
  const attendeeNames = extractAttendeeNames(event.attendees || [])
  const meetingTitle = event.summary || "Meeting"
  const meetingDate = event.start?.dateTime 
    ? new Date(event.start.dateTime).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "Today"
  
  const executiveName = process.env.EXECUTIVE_NAME || "Bosko"
  
  // Create a record in the database first
  let debriefRecord
  try {
    [debriefRecord] = await db
      .insert(debriefCalls)
      .values({
        calendarEventId: event.id,
        meetingTitle,
        meetingDate: event.start?.dateTime 
          ? new Date(event.start.dateTime)
          : new Date(),
        status: "pending",
      })
      .returning()
    
    console.log("[Calendar] Created debrief record:", debriefRecord.id)
  } catch (error) {
    // If insert fails (e.g., duplicate), skip
    console.error("[Calendar] Failed to create debrief record:", error)
    return
  }
  
  // Trigger the call
  try {
    const call = await triggerDebriefCall({
      meetingTitle,
      meetingDate,
      attendees: attendeeNames.length > 0 ? attendeeNames : undefined,
      executiveName,
    })
    
    // Update record with call ID
    await db
      .update(debriefCalls)
      .set({
        retellCallId: call.call_id,
        callId: call.call_id,
        status: "triggered",
        updatedAt: new Date(),
      })
      .where(eq(debriefCalls.id, debriefRecord.id))
    
    console.log("[Calendar] Debrief call triggered:", {
      eventId: event.id,
      callId: call.call_id,
      debriefRecordId: debriefRecord.id,
    })
  } catch (error) {
    // Update record with error
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    await db
      .update(debriefCalls)
      .set({
        status: "failed",
        errorMessage,
        updatedAt: new Date(),
      })
      .where(eq(debriefCalls.id, debriefRecord.id))
    
    console.error("[Calendar] Failed to trigger debrief:", error)
  }
}

/**
 * GET /api/meetings/calendar
 * 
 * Setup endpoint - creates a watch channel on the calendar
 */
export async function GET() {
  try {
    const auth = getGoogleAuth()
    const calendar = google.calendar({ version: "v3", auth })
    
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/meetings/calendar`
    const channelId = `debrief-${Date.now()}`
    
    const calendarId = process.env.GOOGLE_CALENDAR_ID || "bosko@hiiiwav.org"
    // Create a watch on the calendar
    const response = await calendar.events.watch({
      calendarId: calendarId,
      requestBody: {
        id: channelId,
        type: "web_hook",
        address: webhookUrl,
        // Watch expires after 7 days, need to renew
        expiration: String(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })
    
    return NextResponse.json({
      success: true,
      channelId: response.data.id,
      resourceId: response.data.resourceId,
      expiration: response.data.expiration,
      message: "Calendar watch created. Will expire in 7 days.",
    })
  } catch (error) {
    console.error("[Calendar] Failed to create watch:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to create calendar watch", details: message },
      { status: 500 }
    )
  }
}

// Helper to get Google Auth
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

// Types - using Google's schema types with null handling
interface CalendarEvent {
  id?: string | null
  status?: string | null
  summary?: string | null
  start?: { dateTime?: string | null; date?: string | null } | null
  end?: { dateTime?: string | null; date?: string | null } | null
  attendees?: Array<{
    email?: string | null
    displayName?: string | null
    self?: boolean | null
  }> | null
}



