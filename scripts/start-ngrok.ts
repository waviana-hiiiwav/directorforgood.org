import { execSync } from "child_process"
import * as fs from "fs"
import * as path from "path"

async function startNgrok() {
  console.log("Starting ngrok...\n")

  try {
    // Start ngrok in background
    execSync("pkill -f 'ngrok http' || true", { stdio: "ignore" })
    
    // Start ngrok
    execSync("ngrok http 3000 --log=stdout > /tmp/ngrok.log 2>&1 &", { stdio: "ignore" })
    
    // Wait for ngrok to start
    console.log("Waiting for ngrok to start...")
    await new Promise(resolve => setTimeout(resolve, 5000))
  
  // Get the URL from ngrok API
  let url = ""
  for (let i = 0; i < 10; i++) {
    try {
      const response = execSync("curl -s http://localhost:4040/api/tunnels", { encoding: "utf-8" })
      const data = JSON.parse(response)
      if (data.tunnels && data.tunnels.length > 0) {
        url = data.tunnels.find((t: any) => t.proto === "https")?.public_url || data.tunnels[0].public_url
        if (url) break
      }
    } catch (e) {
      // Keep trying
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  if (url) {
    console.log(`✓ Ngrok is running!\n`)
    console.log(`Public URL: ${url}\n`)
    
    // Update .env.local
    const envPath = path.join(process.cwd(), ".env.local")
    if (fs.existsSync(envPath)) {
      let content = fs.readFileSync(envPath, "utf-8")
      
      // Remove old NEXT_PUBLIC_APP_URL lines
      const lines = content.split("\n")
      const filteredLines = lines.filter(line => !line.trim().startsWith("NEXT_PUBLIC_APP_URL"))
      
      // Add new one
      filteredLines.push(`NEXT_PUBLIC_APP_URL=${url}`)
      
      fs.writeFileSync(envPath, filteredLines.join("\n"))
      console.log(`✓ Updated .env.local with ngrok URL\n`)
    }
    
    console.log("Next steps:")
    console.log("1. Make sure your dev server is running: npm run dev")
    console.log("2. Test calendar access: npm run test:calendar")
    console.log("3. Set up calendar watch: npm run setup:calendar")
  } else {
    console.log("✗ Could not get ngrok URL")
    console.log("Check if ngrok is running: curl http://localhost:4040/api/tunnels")
    console.log("\nYou can also start ngrok manually:")
    console.log("  ngrok http 3000")
    console.log("Then copy the HTTPS URL and add it to .env.local as:")
    console.log("  NEXT_PUBLIC_APP_URL=https://your-ngrok-url.ngrok.io")
  }
} catch (error: any) {
  console.error("Error:", error.message)
    console.log("\nTry starting ngrok manually:")
    console.log("  ngrok http 3000")
  }
}

startNgrok()



