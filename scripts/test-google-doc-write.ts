import { config } from "dotenv"
import { resolve } from "path"
import { writeDebriefToGoogleDoc } from "../lib/google-docs"
import type { StructuredDebriefNotes } from "../app/api/meetings/webhook/route"

config({ path: resolve(process.cwd(), ".env.local") })

async function testWrite() {
  try {
    console.log("Testing Google Doc write...\n")
    
    // Check if doc ID is set
    if (!process.env.GOOGLE_DEBRIEF_DOC_ID) {
      console.error("✗ GOOGLE_DEBRIEF_DOC_ID is not set")
      console.log("\nTo set it up:")
      console.log("1. Create a Google Doc")
      console.log("2. Get the document ID from the URL:")
      console.log("   https://docs.google.com/document/d/DOCUMENT_ID_HERE/edit")
      console.log("3. Share the doc with your service account email")
      console.log("4. Add to .env.local: GOOGLE_DEBRIEF_DOC_ID=DOCUMENT_ID_HERE")
      process.exit(1)
    }
    
    console.log(`✓ GOOGLE_DEBRIEF_DOC_ID: ${process.env.GOOGLE_DEBRIEF_DOC_ID}\n`)
    
    // Create test notes
    const testNotes: StructuredDebriefNotes = {
      meetingTitle: "Test Meeting - Google Doc Write",
      meetingDate: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      executiveName: "Bosko",
      attendees: "Test Attendee",
      rawTranscript: "Agent: Hi, this is a test.\nUser: Hello, testing the Google Doc write function.\nAgent: Great! This should appear in your Google Doc.",
      keyTakeaways: ["Test meeting went well", "Google Doc integration is being tested"],
      asksCommitments: ["Verify the document write works"],
      funderInterest: ["Testing functionality"],
      concerns: [],
      nextSteps: ["Check if this appears in the Google Doc"],
      sentiment: "positive",
      callDuration: 120,
    }
    
    console.log("Attempting to write to Google Doc...")
    const docUrl = await writeDebriefToGoogleDoc(testNotes)
    
    console.log(`\n✓ Success! Notes written to Google Doc`)
    console.log(`\nDocument URL: ${docUrl}`)
    console.log("\nOpen the document to verify the content was added.")
    
  } catch (error: any) {
    console.error("\n✗ Failed to write to Google Doc:")
    console.error(error.message)
    
    if (error.message.includes("not found") || error.message.includes("404")) {
      console.log("\nPossible issues:")
      console.log("1. Document ID is incorrect")
      console.log("2. Document doesn't exist")
      console.log("3. Service account doesn't have access")
      console.log("\nMake sure:")
      console.log("- The document is shared with your service account email")
      console.log("- The service account has 'Editor' permission")
      console.log("- The document ID in GOOGLE_DEBRIEF_DOC_ID is correct")
    } else if (error.message.includes("403") || error.message.includes("permission")) {
      console.log("\nPermission issue:")
      console.log("1. Share the Google Doc with your service account email")
      console.log("2. Give it 'Editor' permission")
      console.log("3. Service account email can be found in GOOGLE_SERVICE_ACCOUNT_KEY")
    }
  }
}

testWrite()



