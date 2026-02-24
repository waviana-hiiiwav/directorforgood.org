import { db } from '@/db'
import { proposals, proposalItems } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { renderToBuffer } from '@react-pdf/renderer'
import { ProposalPDF } from '@/lib/pdf/proposal-pdf'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const [proposal] = await db
    .select()
    .from(proposals)
    .where(eq(proposals.slug, slug))

  if (!proposal) {
    return new Response('Proposal not found', { status: 404 })
  }

  const items = await db
    .select()
    .from(proposalItems)
    .where(eq(proposalItems.proposalId, proposal.id))
    .orderBy(asc(proposalItems.sortOrder))

  const includedItems = items.filter(item => item.included)

  const proposalData = {
    title: proposal.title,
    client: proposal.client,
    tier: proposal.tier || 'primary',
    executiveSummary: proposal.executiveSummary,
    brandingIncluded: proposal.brandingIncluded || false,
    teamReadinessNotes: proposal.teamReadinessNotes,
    items: includedItems,
    createdAt: proposal.createdAt,
  }

  const buffer = await renderToBuffer(<ProposalPDF proposal={proposalData} />)

  const filename = `${proposal.slug}-proposal.pdf`

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}



