import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { getChatbotSystemPrompt } from '@/lib/director-knowledge'

// Note: No edge runtime - we need Node.js fs to read deck-content.json dynamically

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages,
    system: getChatbotSystemPrompt(), // Dynamically reads from deck-content.json
    temperature: 0.7,
  })
  
  return result.toTextStreamResponse()
}

