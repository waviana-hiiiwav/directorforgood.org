import { NextRequest, NextResponse } from "next/server"
import { writeDebriefToGoogleDoc } from "@/lib/google-docs"
import crypto from "crypto"
import { db } from "@/db"
import { debriefCalls } from "@/db/schema"
import { eq } from "drizzle-orm"

/**
 * POST /api/meetings/webhook
 * 
 * Webhook endpoint for Retell AI to send call transcripts.
 * Called when a debrief call ends.
 * 
 * Retell webhook payload includes:
 * - call_id
 * - call_status
 * - transcript
 * - metadata (our custom data)
 * - call_analysis (if enabled)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log("[Webhook] Received Retell webhook:", {
      callId: body.call_id,
      status: body.call_status,
      event: body.event,
    })

    // Verify webhook signature if configured
    const signature = request.headers.get("x-retell-signature")
    if (process.env.RETELL_WEBHOOK_SECRET && signature) {
      const isValid = verifyRetellSignature(
        JSON.stringify(body),
        signature,
        process.env.RETELL_WEBHOOK_SECRET
      )
      if (!isValid) {
        console.error("[Webhook] Invalid signature")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    }

    // Handle different event types
    switch (body.event) {
      case "call_started":
        console.log("[Webhook] Call started:", body.call_id)
        break

      case "call_ended":
        console.log("[Webhook] Call ended:", body.call_id)
        await handleCallEnded(body)
        break

      case "call_analyzed":
        console.log("[Webhook] Call analyzed:", body.call_id)
        // Could use this for sentiment analysis, etc.
        break

      default:
        console.log("[Webhook] Unknown event:", body.event)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[Webhook] Error processing webhook:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}

/**
 * Handle call_ended event - extract transcript and write to Google Doc
 */
async function handleCallEnded(payload: RetellWebhookPayload) {
  const { call_id, transcript, metadata, call_analysis } = payload

  if (!transcript) {
    console.log("[Webhook] No transcript available for call:", call_id)
    return
  }

  console.log("[Webhook] Processing transcript for call:", call_id)
  console.log("[Webhook] Transcript length:", transcript.length)

  // Extract metadata we passed when creating the call
  const meetingTitle = metadata?.meeting_title || "Meeting"
  const meetingDate = metadata?.meeting_date || new Date().toISOString()
  const executiveName = metadata?.executive_name || "Executive"
  const attendees = metadata?.attendees || ""

  // Structure the notes from the transcript
  const structuredNotes = await structureTranscript(transcript, {
    meetingTitle,
    meetingDate,
    executiveName,
    attendees,
    callAnalysis: call_analysis,
  })

  // Write to Google Doc
  try {
    const docUrl = await writeDebriefToGoogleDoc(structuredNotes)
    console.log("[Webhook] Notes written to Google Doc:", docUrl)
    
    // Update debrief call status to completed and store transcript
    await db
      .update(debriefCalls)
      .set({
        status: "completed",
        transcript: transcript,
        callAnalysis: call_analysis ? {
          call_summary: call_analysis.call_summary,
          user_sentiment: call_analysis.user_sentiment,
          call_successful: call_analysis.call_successful,
          call_duration_seconds: call_analysis.call_duration_seconds,
        } : null,
        updatedAt: new Date(),
      })
      .where(eq(debriefCalls.retellCallId, call_id))
    
    console.log("[Webhook] Updated debrief call status to completed")
  } catch (error) {
    console.error("[Webhook] Failed to write to Google Doc:", error)
    // Don't throw - we still want to acknowledge the webhook
  }
}

/**
 * Structure the raw transcript into organized meeting notes
 */
async function structureTranscript(
  transcript: string,
  context: {
    meetingTitle: string
    meetingDate: string
    executiveName: string
    attendees: string
    callAnalysis?: CallAnalysis
  }
): Promise<StructuredDebriefNotes> {
  // For MVP, we'll do simple extraction
  // In production, could use an LLM to better structure the notes
  
  const notes: StructuredDebriefNotes = {
    meetingTitle: context.meetingTitle,
    meetingDate: context.meetingDate,
    executiveName: context.executiveName,
    attendees: context.attendees,
    rawTranscript: transcript,
    keyTakeaways: extractSection(transcript, ["takeaway", "main point", "went well", "overall"]),
    asksCommitments: extractSection(transcript, ["commitment", "ask", "action item", "follow up", "dollar", "amount"]),
    funderInterest: extractSection(transcript, ["excited", "interested", "resonate", "liked"]),
    concerns: extractSection(transcript, ["concern", "hesitation", "worried", "issue", "problem"]),
    nextSteps: extractSection(transcript, ["next step", "follow up", "schedule", "send", "next meeting"]),
    sentiment: context.callAnalysis?.user_sentiment || "neutral",
    callDuration: context.callAnalysis?.call_duration_seconds,
  }

  return notes
}

/**
 * Simple extraction helper - finds relevant parts of transcript
 * In production, use an LLM for better extraction
 */
function extractSection(transcript: string, keywords: string[]): string[] {
  const sentences = transcript.split(/[.!?]+/).map(s => s.trim()).filter(Boolean)
  const relevant: string[] = []

  for (const sentence of sentences) {
    const lower = sentence.toLowerCase()
    if (keywords.some(kw => lower.includes(kw))) {
      relevant.push(sentence)
    }
  }

  return relevant.slice(0, 5) // Max 5 items per section
}

/**
 * Verify Retell webhook signature
 */
function verifyRetellSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex")
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

// Types

interface RetellWebhookPayload {
  event: "call_started" | "call_ended" | "call_analyzed"
  call_id: string
  call_status: string
  transcript?: string
  metadata?: Record<string, string>
  call_analysis?: CallAnalysis
}

interface CallAnalysis {
  user_sentiment?: "positive" | "negative" | "neutral"
  call_duration_seconds?: number
  call_successful?: boolean
}

export interface StructuredDebriefNotes {
  meetingTitle: string
  meetingDate: string
  executiveName: string
  attendees: string
  rawTranscript: string
  keyTakeaways: string[]
  asksCommitments: string[]
  funderInterest: string[]
  concerns: string[]
  nextSteps: string[]
  sentiment?: string
  callDuration?: number
}



