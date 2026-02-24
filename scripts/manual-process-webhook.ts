import { config } from "dotenv"
import { resolve } from "path"

config({ path: resolve(process.cwd(), ".env.local") })

// Simulate what the webhook does
async function manualProcess() {
  console.log("Manually triggering calendar check...\n")
  
  try {
    const response = await fetch("http://localhost:3000/api/meetings/calendar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-channel-id": "manual-trigger",
        "x-goog-resource-state": "exists",
      },
      body: JSON.stringify({}),
    })
    
    const result = await response.json()
    console.log("Response:", result)
    console.log("\n✓ Webhook processing triggered")
    console.log("Check your phone - a call should come through soon!")
    
  } catch (error: any) {
    console.error("Error:", error.message)
    console.log("\nMake sure your dev server is running: npm run dev")
  }
}

manualProcess()



