import { NextResponse } from "next/server"
import { isGoogleDocsConfigured } from "@/lib/google-docs"

/**
 * GET /api/meetings/status
 * 
 * Check configuration status for the Meeting Debrief Agent
 */
export async function GET() {
  const config = {
    retell: {
      apiKey: !!process.env.RETELL_API_KEY,
      agentId: !!process.env.RETELL_DEBRIEF_AGENT_ID,
      phoneNumber: !!process.env.RETELL_PHONE_NUMBER,
      webhookSecret: !!process.env.RETELL_WEBHOOK_SECRET,
    },
    executive: {
      phoneNumber: !!process.env.EXECUTIVE_PHONE_NUMBER,
    },
    googleDocs: {
      serviceAccountKey: !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
      documentId: !!process.env.GOOGLE_DEBRIEF_DOC_ID,
      configured: isGoogleDocsConfigured(),
    },
  }

  const retellReady = config.retell.apiKey && config.retell.agentId && config.retell.phoneNumber
  const executiveReady = config.executive.phoneNumber
  const googleDocsReady = config.googleDocs.configured

  const allReady = retellReady && executiveReady && googleDocsReady

  const missingSteps: string[] = []
  
  if (!config.retell.apiKey) missingSteps.push("Set RETELL_API_KEY from Retell dashboard")
  if (!config.retell.agentId) missingSteps.push("Create agent in Retell and set RETELL_DEBRIEF_AGENT_ID")
  if (!config.retell.phoneNumber) missingSteps.push("Purchase phone number in Retell and set RETELL_PHONE_NUMBER")
  if (!config.executive.phoneNumber) missingSteps.push("Set EXECUTIVE_PHONE_NUMBER (your phone for testing)")
  if (!config.googleDocs.serviceAccountKey) missingSteps.push("Create Google service account and set GOOGLE_SERVICE_ACCOUNT_KEY")
  if (!config.googleDocs.documentId) missingSteps.push("Create Google Doc and set GOOGLE_DEBRIEF_DOC_ID")

  return NextResponse.json({
    status: allReady ? "ready" : "setup_required",
    config,
    summary: {
      retellReady,
      executiveReady,
      googleDocsReady,
    },
    missingSteps,
    endpoints: {
      trigger: "POST /api/meetings/trigger",
      webhook: "POST /api/meetings/webhook",
      status: "GET /api/meetings/status",
    },
    documentation: "/docs/meeting-debrief-setup.md",
  })
}



