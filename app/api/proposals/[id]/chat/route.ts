import { anthropic } from '@ai-sdk/anthropic'
import { streamText, tool } from 'ai'
import { db } from '@/db'
import { proposals, proposalItems } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

export const maxDuration = 30

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { messages } = await req.json()
  const proposalId = parseInt(id)

  // Fetch current proposal state for context
  const proposal = await db.query.proposals.findFirst({
    where: eq(proposals.id, proposalId),
    with: {
      items: true
    }
  })

  if (!proposal) {
    return new Response('Proposal not found', { status: 404 })
  }

  const result = streamText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    messages,
    system: `You are a proposal assistant for HiiiWAV. 
Current Proposal Context:
Title: ${proposal.title}
Client: ${proposal.client}
Tier: ${proposal.tier}
Status: ${proposal.status}

Line Items:
${proposal.items.map(item => `- [${item.id}] ${item.title}: ${item.hours}h @ $${item.rate / 100}/h (${item.included ? 'Included' : 'Excluded'})`).join('\n')}

You can modify this proposal using the available tools. When a user asks to change something, call the appropriate tool.
If they ask to reduce or increase hours for a specific item, find its ID from the list above.`,
    tools: {
      updateProposal: tool({
        description: 'Update high-level proposal details',
        parameters: z.object({
          title: z.string().optional(),
          client: z.string().optional(),
          tier: z.enum(['primary', 'lower']).optional(),
          status: z.enum(['draft', 'sent', 'accepted', 'rejected']).optional(),
          executiveSummary: z.string().optional(),
          brandingIncluded: z.boolean().optional(),
        }),
        execute: async (updates) => {
          await db.update(proposals)
            .set({ ...updates, updatedAt: new Date() })
            .where(eq(proposals.id, proposalId))
          return { success: true, updated: updates }
        }
      }),
      updateLineItem: tool({
        description: 'Update an existing line item by its ID',
        parameters: z.object({
          itemId: z.number(),
          title: z.string().optional(),
          hours: z.number().optional(),
          rate: z.number().optional(),
          included: z.boolean().optional(),
          description: z.string().optional(),
        }),
        execute: async ({ itemId, ...updates }) => {
          // Convert rate to cents if provided
          const values = { ...updates }
          if (updates.rate) values.rate = updates.rate * 100

          await db.update(proposalItems)
            .set({ ...values, updatedAt: new Date() })
            .where(and(eq(proposalItems.id, itemId), eq(proposalItems.proposalId, proposalId)))
          return { success: true, itemId, updated: values }
        }
      }),
      addLineItem: tool({
        description: 'Add a new line item to the proposal',
        parameters: z.object({
          title: z.string(),
          category: z.enum(['core', 'optional', 'add_on']),
          hours: z.number().default(0),
          rate: z.number().default(125),
          description: z.string().optional(),
        }),
        execute: async (item) => {
          const [newItem] = await db.insert(proposalItems).values({
            proposalId,
            ...item,
            rate: item.rate * 100,
          }).returning()
          return { success: true, newItem }
        }
      }),
      removeLineItem: tool({
        description: 'Remove a line item from the proposal',
        parameters: z.object({
          itemId: z.number(),
        }),
        execute: async ({ itemId }) => {
          await db.delete(proposalItems)
            .where(and(eq(proposalItems.id, itemId), eq(proposalItems.proposalId, proposalId)))
          return { success: true, removedId: itemId }
        }
      })
    }
  })

  return result.toDataStreamResponse()
}



