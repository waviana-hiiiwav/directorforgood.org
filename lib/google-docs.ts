import { google } from "googleapis"
import type { StructuredDebriefNotes } from "@/app/api/meetings/webhook/route"

/**
 * Google Docs integration for writing meeting debrief notes
 * 
 * Setup required:
 * 1. Create a Google Cloud project
 * 2. Enable Google Docs API
 * 3. Create a service account
 * 4. Share the target Google Doc with the service account email
 * 5. Set environment variables
 */

// Initialize Google Auth
function getGoogleAuth() {
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  
  if (!credentials) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_KEY not set. " +
      "Set this to your service account JSON key (base64 encoded or raw JSON)"
    )
  }

  // Handle both base64 encoded and raw JSON
  let keyFile: object
  try {
    // Try base64 first
    const decoded = Buffer.from(credentials, "base64").toString("utf-8")
    keyFile = JSON.parse(decoded)
  } catch {
    // Try raw JSON
    try {
      keyFile = JSON.parse(credentials)
    } catch {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY is not valid JSON or base64-encoded JSON")
    }
  }

  return new google.auth.GoogleAuth({
    credentials: keyFile,
    scopes: ["https://www.googleapis.com/auth/documents"],
  })
}

// Get the target document ID
function getDocumentId(): string {
  const docId = process.env.GOOGLE_DEBRIEF_DOC_ID
  
  if (!docId) {
    throw new Error(
      "GOOGLE_DEBRIEF_DOC_ID not set. " +
      "Create a Google Doc and set this to the document ID from the URL"
    )
  }
  
  return docId
}

/**
 * Write structured debrief notes to the Google Doc
 */
export async function writeDebriefToGoogleDoc(
  notes: StructuredDebriefNotes
): Promise<string> {
  const auth = getGoogleAuth()
  const docs = google.docs({ version: "v1", auth })
  const documentId = getDocumentId()

  // Format the notes as text to insert
  const formattedContent = formatNotesForDoc(notes)

  // Insert at the beginning of the document (after any header)
  // This ensures newest debriefs appear first
  await docs.documents.batchUpdate({
    documentId,
    requestBody: {
      requests: [
        {
          insertText: {
            location: { index: 1 }, // After document start
            text: formattedContent,
          },
        },
      ],
    },
  })

  const docUrl = `https://docs.google.com/document/d/${documentId}`
  console.log("[GoogleDocs] Notes written successfully:", docUrl)
  
  return docUrl
}

/**
 * Format structured notes for insertion into Google Doc
 */
function formatNotesForDoc(notes: StructuredDebriefNotes): string {
  const timestamp = new Date().toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  })

  const sections: string[] = [
    `\n${"=".repeat(60)}\n`,
    `MEETING DEBRIEF: ${notes.meetingTitle}`,
    `${"=".repeat(60)}\n`,
    `Date: ${notes.meetingDate}`,
    `Executive: ${notes.executiveName}`,
    notes.attendees ? `Attendees: ${notes.attendees}` : "",
    `Captured: ${timestamp}`,
    notes.callDuration ? `Call Duration: ${Math.round(notes.callDuration / 60)} minutes` : "",
    notes.sentiment ? `Overall Sentiment: ${notes.sentiment}` : "",
    "",
    "KEY TAKEAWAYS",
    "-".repeat(40),
    notes.keyTakeaways.length > 0 
      ? notes.keyTakeaways.map(t => `• ${t}`).join("\n")
      : "• (No specific takeaways captured)",
    "",
    "ASKS & COMMITMENTS",
    "-".repeat(40),
    notes.asksCommitments.length > 0
      ? notes.asksCommitments.map(a => `• ${a}`).join("\n")
      : "• (No specific asks or commitments captured)",
    "",
    "FUNDER INTEREST AREAS",
    "-".repeat(40),
    notes.funderInterest.length > 0
      ? notes.funderInterest.map(f => `• ${f}`).join("\n")
      : "• (No specific interest areas captured)",
    "",
    "CONCERNS RAISED",
    "-".repeat(40),
    notes.concerns.length > 0
      ? notes.concerns.map(c => `• ${c}`).join("\n")
      : "• (No concerns noted)",
    "",
    "NEXT STEPS",
    "-".repeat(40),
    notes.nextSteps.length > 0
      ? notes.nextSteps.map(n => `• ${n}`).join("\n")
      : "• (No next steps captured)",
    "",
    "RAW TRANSCRIPT",
    "-".repeat(40),
    notes.rawTranscript || "(No transcript available)",
    "",
    `[Auto-generated via HiiiWAV Meeting Debrief Agent]`,
    "\n",
  ]

  return sections.filter(Boolean).join("\n")
}

/**
 * Create a new Google Doc for debriefs (one-time setup helper)
 */
export async function createDebriefDocument(title: string): Promise<string> {
  const auth = getGoogleAuth()
  const docs = google.docs({ version: "v1", auth })

  const doc = await docs.documents.create({
    requestBody: {
      title: title || "Meeting Debriefs - HiiiWAV",
    },
  })

  const documentId = doc.data.documentId!
  console.log("[GoogleDocs] Created new document:", documentId)
  console.log("[GoogleDocs] URL:", `https://docs.google.com/document/d/${documentId}`)
  
  return documentId
}

/**
 * Check if Google Docs is properly configured
 */
export function isGoogleDocsConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY &&
    process.env.GOOGLE_DEBRIEF_DOC_ID
  )
}



