/**
 * Test script for the Meeting Debrief Agent
 * 
 * Usage:
 *   npx tsx scripts/test-debrief-call.ts
 * 
 * Make sure your .env.local is configured first.
 * Check /api/meetings/status to verify configuration.
 */

import "dotenv/config"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

async function main() {
  console.log("🎯 Meeting Debrief Agent Test\n")
  
  // Step 1: Check status
  console.log("1. Checking configuration status...")
  const statusRes = await fetch(`${BASE_URL}/api/meetings/status`)
  const status = await statusRes.json()
  
  console.log("   Status:", status.status)
  console.log("   Retell Ready:", status.summary.retellReady)
  console.log("   Executive Ready:", status.summary.executiveReady)
  console.log("   Google Docs Ready:", status.summary.googleDocsReady)
  
  if (status.missingSteps.length > 0) {
    console.log("\n   ⚠️  Missing steps:")
    status.missingSteps.forEach((step: string) => {
      console.log(`      - ${step}`)
    })
    console.log("\n   Please complete setup before testing.")
    process.exit(1)
  }
  
  console.log("   ✅ All configured!\n")
  
  // Step 2: Trigger a test call
  console.log("2. Triggering test debrief call...")
  
  const testPayload = {
    meetingTitle: "Test Meeting - Foundation X Partnership",
    meetingDate: new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
    attendees: ["John Smith (Foundation X)", "Jane Doe (Program Director)"],
    executiveName: "Bosko",
  }
  
  console.log("   Payload:", JSON.stringify(testPayload, null, 2))
  
  const triggerRes = await fetch(`${BASE_URL}/api/meetings/trigger`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testPayload),
  })
  
  const triggerResult = await triggerRes.json()
  
  if (!triggerRes.ok) {
    console.log("   ❌ Failed to trigger call:", triggerResult.error)
    console.log("   Details:", triggerResult.details)
    process.exit(1)
  }
  
  console.log("   ✅ Call triggered!")
  console.log("   Call ID:", triggerResult.callId)
  console.log("   Status:", triggerResult.status)
  console.log("\n📞 Your phone should ring shortly...")
  console.log("   After the call, check your Google Doc for the notes.")
}

main().catch(console.error)



