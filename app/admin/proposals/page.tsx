import { db } from '@/db'
import { proposals, proposalItems } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  sent: 'bg-blue-100 text-blue-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

const tierLabels: Record<string, string> = {
  primary: '$25,000',
  lower: '$20,000',
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export default async function AdminProposalsPage() {
  const allProposals = await db.select().from(proposals).orderBy(desc(proposals.updatedAt))

  // Get totals for each proposal
  const proposalsWithTotals = await Promise.all(
    allProposals.map(async (proposal) => {
      const items = await db
        .select()
        .from(proposalItems)
        .where(eq(proposalItems.proposalId, proposal.id))
      
      const includedItems = items.filter(item => item.included)
      const totalHours = includedItems.reduce((sum, item) => sum + (item.hours || 0), 0)
      const totalCost = includedItems.reduce((sum, item) => sum + ((item.hours || 0) * (item.rate || 0)), 0)
      
      return {
        ...proposal,
        totalHours,
        totalCost,
        itemCount: items.length,
      }
    })
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Proposals</h1>
        <Button asChild>
          <Link href="/admin/proposals/new">New Proposal</Link>
        </Button>
      </div>

      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Proposal</th>
              <th className="text-left p-4 font-medium">Client</th>
              <th className="text-left p-4 font-medium">Tier</th>
              <th className="text-right p-4 font-medium">Hours</th>
              <th className="text-right p-4 font-medium">Total Cost</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {proposalsWithTotals.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  No proposals yet. Create your first one!
                </td>
              </tr>
            ) : (
              proposalsWithTotals.map((proposal) => (
                <tr key={proposal.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{proposal.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {proposal.itemCount} line items
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{proposal.client}</td>
                  <td className="p-4">
                    <span className="text-sm font-medium">
                      {tierLabels[proposal.tier || 'primary']}
                    </span>
                  </td>
                  <td className="p-4 text-right text-sm tabular-nums">
                    {proposal.totalHours} hrs
                  </td>
                  <td className="p-4 text-right text-sm font-medium tabular-nums">
                    {formatCurrency(proposal.totalCost)}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded capitalize ${statusColors[proposal.status || 'draft']}`}>
                      {proposal.status || 'draft'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/proposals/${proposal.id}`}>Edit</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/proposals/${proposal.slug}`} target="_blank">View</Link>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}



