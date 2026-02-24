import { execSync } from "child_process"
import * as readline from "readline"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function setupNgrok() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║           Ngrok Authentication Setup                         ║
╚══════════════════════════════════════════════════════════════╝

Ngrok requires authentication. Here's how to set it up:

1. Sign up for a free ngrok account:
   https://dashboard.ngrok.com/signup

2. Get your authtoken:
   https://dashboard.ngrok.com/get-started/your-authtoken

3. Copy the authtoken (looks like: 2abc123def456ghi789jkl012mno345pqr678stu901)

Once you have your authtoken, I can configure it for you.
`)

  const authtoken = await question("\nEnter your ngrok authtoken (or press Enter to skip): ")
  
  if (!authtoken.trim()) {
    console.log("\nSkipping authtoken setup.")
    console.log("You can configure it manually by running:")
    console.log("  ngrok config add-authtoken YOUR_TOKEN_HERE")
    rl.close()
    return
  }

  try {
    console.log("\nConfiguring ngrok...")
    execSync(`ngrok config add-authtoken ${authtoken.trim()}`, { stdio: "inherit" })
    console.log("\n✓ Ngrok configured successfully!")
    console.log("\nNow you can start ngrok with:")
    console.log("  ngrok http 3000")
  } catch (error: any) {
    console.error("\n✗ Failed to configure ngrok:")
    console.error(error.message)
    console.log("\nYou can also configure it manually:")
    console.log("  ngrok config add-authtoken YOUR_TOKEN_HERE")
  }

  rl.close()
}

setupNgrok()



