import { db } from '@/db'
import { proposals, proposalItems } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function PublicProposalPage({ params }: Props) {
  const { slug } = await params
  
  const [proposal] = await db
    .select()
    .from(proposals)
    .where(eq(proposals.slug, slug))
  
  if (!proposal) {
    notFound()
  }

  const items = await db
    .select()
    .from(proposalItems)
    .where(eq(proposalItems.proposalId, proposal.id))
    .orderBy(asc(proposalItems.sortOrder))

  const includedItems = items.filter(item => item.included)
  const coreItems = includedItems.filter(item => item.category === 'core')
  const optionalItems = includedItems.filter(item => item.category === 'optional')
  const addOnItems = includedItems.filter(item => item.category === 'add_on')

  const tierLabel = proposal.tier === 'primary' ? '$25,000' : '$20,000'
  const tierDescription = proposal.tier === 'primary' 
    ? 'Four-workshop sprint with full scope'
    : 'Three-workshop sprint, compressed timeline'

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#99FF69] flex items-center justify-center text-black font-bold">
              H
            </div>
            <span className="text-lg font-semibold">HiiiWAV</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">{proposal.title}</h1>
          <p className="text-xl text-muted-foreground">
            Prepared for {proposal.client}
          </p>
        </header>

        {/* Key Deliverables Summary */}
        <section className="mb-12 p-6 bg-card rounded-xl border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Key Deliverables</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {includedItems.slice(0, 8).map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#99FF69]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm">{item.title}</span>
              </div>
            ))}
          </div>
          {includedItems.length > 8 && (
            <p className="text-sm text-muted-foreground mt-4">
              + {includedItems.length - 8} more deliverables
            </p>
          )}
        </section>

        {/* Pricing */}
        <section className="mb-12 p-6 bg-card rounded-xl border shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Investment</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{tierLabel}</span>
            <span className="text-muted-foreground">flat fee</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{tierDescription}</p>
          
          {proposal.brandingIncluded && (
            <div className="mt-4 p-3 bg-[#99FF69]/10 rounded-lg border border-[#99FF69]/30">
              <p className="text-sm">
                <strong>Includes HiiiWAV branding</strong> — Partner will receive additional exposure through HiiiWAV's network and promotional channels.
              </p>
            </div>
          )}
        </section>

        {/* Executive Summary */}
        {proposal.executiveSummary && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-lg leading-relaxed">{proposal.executiveSummary}</p>
            </div>
          </section>
        )}

        {/* Scope of Work */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Scope of Work</h2>
          
          {coreItems.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Core Services (Included)</h3>
              <div className="space-y-4">
                {coreItems.map((item) => (
                  <div key={item.id} className="p-4 bg-card rounded-lg border">
                    <h4 className="font-medium">{item.title}</h4>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    )}
                    {item.requiresCollaboration && (
                      <p className="text-xs text-blue-600 mt-2">
                        Requires collaboration with {item.requiresCollaboration}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {optionalItems.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Optional Services (Included)</h3>
              <div className="space-y-4">
                {optionalItems.map((item) => (
                  <div key={item.id} className="p-4 bg-card rounded-lg border">
                    <h4 className="font-medium">{item.title}</h4>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    )}
                    {item.requiresCollaboration && (
                      <p className="text-xs text-blue-600 mt-2">
                        Requires collaboration with {item.requiresCollaboration}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {addOnItems.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Add-ons (Included)</h3>
              <div className="space-y-4">
                {addOnItems.map((item) => (
                  <div key={item.id} className="p-4 bg-card rounded-lg border">
                    <h4 className="font-medium">{item.title}</h4>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Team Readiness */}
        {proposal.teamReadinessNotes && (
          <section className="mb-12 p-6 bg-amber-50 rounded-xl border border-amber-200">
            <h2 className="text-lg font-semibold mb-2 text-amber-800">Team Readiness Requirements</h2>
            <p className="text-amber-900">{proposal.teamReadinessNotes}</p>
          </section>
        )}

        {/* Footer */}
        <footer className="pt-12 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">HiiiWAV</p>
              <p className="text-sm text-muted-foreground">
                Prepared {new Date(proposal.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <Button asChild>
              <Link href={`/proposals/${slug}/pdf`}>
                Download PDF
              </Link>
            </Button>
          </div>
        </footer>
      </div>
    </div>
  )
}



