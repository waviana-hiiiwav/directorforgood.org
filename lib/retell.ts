import Retell from "retell-sdk"

if (!process.env.RETELL_API_KEY) {
  console.warn("RETELL_API_KEY not set - Retell features will not work")
}

export const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
})

// Agent ID will be set after creating the agent in Retell dashboard
export const DEBRIEF_AGENT_ID = process.env.RETELL_DEBRIEF_AGENT_ID || ""

// Phone number to call (executive's number)
export const EXECUTIVE_PHONE_NUMBER = process.env.EXECUTIVE_PHONE_NUMBER || ""

// Retell phone number (the "from" number - purchased in Retell dashboard)
export const RETELL_PHONE_NUMBER = process.env.RETELL_PHONE_NUMBER || ""

export interface DebriefCallMetadata {
  meetingTitle: string
  meetingDate: string
  attendees?: string[]
  executiveName: string
}

/**
 * Trigger an outbound debrief call to the executive
 */
export async function triggerDebriefCall(metadata: DebriefCallMetadata) {
  if (!DEBRIEF_AGENT_ID || !EXECUTIVE_PHONE_NUMBER || !RETELL_PHONE_NUMBER) {
    throw new Error(
      "Missing Retell configuration. Set RETELL_DEBRIEF_AGENT_ID, EXECUTIVE_PHONE_NUMBER, and RETELL_PHONE_NUMBER"
    )
  }

  const call = await retellClient.call.createPhoneCall({
    from_number: RETELL_PHONE_NUMBER,
    to_number: EXECUTIVE_PHONE_NUMBER,
    override_agent_id: DEBRIEF_AGENT_ID,
    metadata: metadata,
    // Dynamic variables to inject into the agent prompt
    retell_llm_dynamic_variables: {
      meeting_title: metadata.meetingTitle,
      meeting_date: metadata.meetingDate,
      executive_name: metadata.executiveName,
      attendees: metadata.attendees?.join(", ") || "external participants",
    },
  })

  return call
}

/**
 * Get call details including transcript
 */
export async function getCallDetails(callId: string) {
  const call = await retellClient.call.retrieve(callId)
  return call
}



