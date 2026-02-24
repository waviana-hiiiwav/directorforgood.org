import { NextRequest, NextResponse } from "next/server"
import { triggerDebriefCall, type DebriefCallMetadata } from "@/lib/retell"

/**
 * POST /api/meetings/trigger
 * 
 * Manually trigger a debrief call to the executive.
 * Used for testing before calendar integration is added.
 * 
 * Body:
 * {
 *   meetingTitle: string,
 *   meetingDate?: string, // defaults to today
 *   attendees?: string[],
 *   executiveName?: string // defaults to "there"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const metadata: DebriefCallMetadata = {
      meetingTitle: body.meetingTitle || "your recent meeting",
      meetingDate: body.meetingDate || new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long", 
        day: "numeric"
      }),
      attendees: body.attendees,
      executiveName: body.executiveName || "there",
    }

    if (!metadata.meetingTitle) {
      return NextResponse.json(
        { error: "meetingTitle is required" },
        { status: 400 }
      )
    }

    console.log("[Debrief] Triggering call with metadata:", metadata)

    const call = await triggerDebriefCall(metadata)

    console.log("[Debrief] Call initiated:", {
      callId: call.call_id,
      status: call.call_status,
    })

    return NextResponse.json({
      success: true,
      callId: call.call_id,
      status: call.call_status,
      message: "Debrief call initiated. The executive will receive a call shortly.",
    })
  } catch (error) {
    console.error("[Debrief] Error triggering call:", error)
    
    const message = error instanceof Error ? error.message : "Unknown error"
    
    return NextResponse.json(
      { error: "Failed to trigger debrief call", details: message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/meetings/trigger
 * 
 * Health check / info endpoint
 */
export async function GET() {
  const hasConfig = !!(
    process.env.RETELL_API_KEY &&
    process.env.RETELL_DEBRIEF_AGENT_ID &&
    process.env.EXECUTIVE_PHONE_NUMBER &&
    process.env.RETELL_PHONE_NUMBER
  )

  return NextResponse.json({
    endpoint: "/api/meetings/trigger",
    method: "POST",
    configured: hasConfig,
    missingEnvVars: [
      !process.env.RETELL_API_KEY && "RETELL_API_KEY",
      !process.env.RETELL_DEBRIEF_AGENT_ID && "RETELL_DEBRIEF_AGENT_ID",
      !process.env.EXECUTIVE_PHONE_NUMBER && "EXECUTIVE_PHONE_NUMBER",
      !process.env.RETELL_PHONE_NUMBER && "RETELL_PHONE_NUMBER",
    ].filter(Boolean),
    usage: {
      body: {
        meetingTitle: "string (required)",
        meetingDate: "string (optional, defaults to today)",
        attendees: "string[] (optional)",
        executiveName: "string (optional, defaults to 'there')",
      },
      example: {
        meetingTitle: "Foundation X Partnership Discussion",
        attendees: ["John Smith", "Jane Doe"],
        executiveName: "Bosko",
      },
    },
  })
}



