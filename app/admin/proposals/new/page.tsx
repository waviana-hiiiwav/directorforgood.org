'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'

export default function NewProposalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    client: '',
    tier: 'primary',
    executiveSummary: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('Failed to create proposal')
      
      const proposal = await res.json()
      router.push(`/admin/proposals/${proposal.id}`)
    } catch (error) {
      console.error('Error creating proposal:', error)
      alert('Failed to create proposal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/admin/proposals" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to Proposals
        </Link>
        <h1 className="text-3xl font-bold mt-2">New Proposal</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g., A.P.P. Pitch Coaching & Demo Day Production"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Client / Partner</label>
          <Input
            value={form.client}
            onChange={(e) => setForm({ ...form, client: e.target.value })}
            placeholder="e.g., Cofounders"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Pricing Tier</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="tier"
                value="primary"
                checked={form.tier === 'primary'}
                onChange={(e) => setForm({ ...form, tier: e.target.value })}
                className="w-4 h-4"
              />
              <span>$25,000 (Primary)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="tier"
                value="lower"
                checked={form.tier === 'lower'}
                onChange={(e) => setForm({ ...form, tier: e.target.value })}
                className="w-4 h-4"
              />
              <span>$20,000 (Lower Cost)</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Executive Summary</label>
          <Textarea
            value={form.executiveSummary}
            onChange={(e) => setForm({ ...form, executiveSummary: e.target.value })}
            placeholder="Brief overview of the proposal..."
            rows={4}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Proposal'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/proposals">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}



