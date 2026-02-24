import * as fs from "fs"
import * as path from "path"
import { execSync } from "child_process"

const envPath = path.join(process.cwd(), ".env.local")

console.log("Getting ngrok URL...\n")

try {
  // Try to get URL from ngrok API
  const response = execSync("curl -s http://localhost:4040/api/tunnels", { encoding: "utf-8" })
  const data = JSON.parse(response)
  
  if (data.tunnels && data.tunnels.length > 0) {
    const httpsTunnel = data.tunnels.find((t: any) => t.proto === "https")
    const url = httpsTunnel?.public_url || data.tunnels[0].public_url
    
    if (url) {
      console.log(`✓ Found ngrok URL: ${url}\n`)
      
      // Update .env.local
      if (fs.existsSync(envPath)) {
        let content = fs.readFileSync(envPath, "utf-8")
        const lines = content.split("\n")
        
        // Remove old NEXT_PUBLIC_APP_URL lines
        const filteredLines = lines.filter(line => !line.trim().startsWith("NEXT_PUBLIC_APP_URL"))
        
        // Add new one at the end (before empty lines)
        const nonEmptyLines = filteredLines.filter(l => l.trim())
        const emptyLines = filteredLines.filter(l => !l.trim())
        nonEmptyLines.push(`NEXT_PUBLIC_APP_URL=${url}`)
        
        fs.writeFileSync(envPath, [...nonEmptyLines, ...emptyLines].join("\n"))
        console.log(`✓ Updated .env.local\n`)
        console.log("You can now run:")
        console.log("  npm run setup:calendar")
      }
    } else {
      throw new Error("No URL found")
    }
  } else {
    throw new Error("No tunnels found")
  }
} catch (error: any) {
  console.log("✗ Could not get ngrok URL automatically")
  console.log("\nTo set it up manually:")
  console.log("1. In a terminal, run: ngrok http 3000")
  console.log("2. Copy the HTTPS URL (looks like https://abc123.ngrok-free.app)")
  console.log("3. Add this line to .env.local:")
  console.log("   NEXT_PUBLIC_APP_URL=https://your-ngrok-url-here")
  console.log("\nOr run this script again after ngrok is started.")
}



