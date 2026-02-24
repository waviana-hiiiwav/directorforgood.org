'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { Trash2, Plus, ExternalLink } from 'lucide-react'
import { ProposalChatPanel } from '@/components/admin/proposals/chat-panel'

type ProposalItem = {
  id: number
  proposalId: number
  category: string
  title: string
  description: string | null
  hours: number
  rate: number
  included: boolean
  requiresCollaboration: string | null
  sortOrder: number
  internalNotes: string | null
}

type Proposal = {
  id: number
  slug: string
  title: string
  client: string
  status: string
  tier: string
  executiveSummary: string | null
  brandingIncluded: boolean
  teamReadinessNotes: string | null
  internalNotes: string | null
  targetProfit: number | null
  items: ProposalItem[]
  totalHours: number
  totalCost: number
}

const tierTargets: Record<string, number> = {
  primary: 2500000, // $25,000 in cents
  lower: 2000000,   // $20,000 in cents
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

function formatRate(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export default function ProposalEditorPage() {
  const params = useParams()
  const router = useRouter()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newItem, setNewItem] = useState({ title: '', category: 'core', hours: 0, rate: 12500 })

  const fetchProposal = useCallback(async () => {
    try {
      const res = await fetch(`/api/proposals/${params.id}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setProposal(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchProposal()
  }, [fetchProposal])

  const updateProposal = async (updates: Partial<Proposal>) => {
    if (!proposal) return
    setSaving(true)
    try {
      const res = await fetch(`/api/proposals/${proposal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...proposal, ...updates }),
      })
      if (!res.ok) throw new Error('Failed to update')
      setProposal({ ...proposal, ...updates })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateItem = async (itemId: number, updates: Partial<ProposalItem>) => {
    if (!proposal) return
    try {
      const res = await fetch(`/api/proposals/${proposal.id}/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update item')
      const updatedItem = await res.json()
      
      setProposal({
        ...proposal,
        items: proposal.items.map(item => 
          item.id === itemId ? { ...item, ...updatedItem } : item
        ),
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const addItem = async () => {
    if (!proposal || !newItem.title) return
    try {
      const res = await fetch(`/api/proposals/${proposal.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      })
      if (!res.ok) throw new Error('Failed to add item')
      const item = await res.json()
      setProposal({ ...proposal, items: [...proposal.items, item] })
      setNewItem({ title: '', category: 'core', hours: 0, rate: 12500 })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deleteItem = async (itemId: number) => {
    if (!proposal || !confirm('Delete this item?')) return
    try {
      await fetch(`/api/proposals/${proposal.id}/items/${itemId}`, { method: 'DELETE' })
      setProposal({
        ...proposal,
        items: proposal.items.filter(item => item.id !== itemId),
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deleteProposal = async () => {
    if (!proposal || !confirm('Delete this entire proposal?')) return
    try {
      await fetch(`/api/proposals/${proposal.id}`, { method: 'DELETE' })
      router.push('/admin/proposals')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (!proposal) return <div className="p-8">Proposal not found</div>

  // Calculate totals
  const includedItems = proposal.items.filter(item => item.included)
  const totalHours = includedItems.reduce((sum, item) => sum + (item.hours || 0), 0)
  const totalCost = includedItems.reduce((sum, item) => sum + ((item.hours || 0) * (item.rate || 0)), 0)
  const targetAmount = tierTargets[proposal.tier] || tierTargets.primary
  const profit = targetAmount - totalCost
  const profitMargin = targetAmount > 0 ? (profit / targetAmount) * 100 : 0

  // Group items by category
  const coreItems = proposal.items.filter(item => item.category === 'core')
  const optionalItems = proposal.items.filter(item => item.category === 'optional')
  const addOnItems = proposal.items.filter(item => item.category === 'add_on')

  return (
    <>
      <div className="space-y-8 pl-[340px]">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <Link href="/admin/proposals" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to Proposals
            </Link>
            <h1 className="text-3xl font-bold mt-2">{proposal.title}</h1>
            <p className="text-muted-foreground">{proposal.client}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/proposals/${proposal.slug}`} target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Public
              </Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={deleteProposal}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Key Deliverables Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Key Deliverables</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-2 gap-2">
              {includedItems.map(item => (
                <li key={item.id} className="flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {item.title}
                  {item.requiresCollaboration && (
                    <span className="text-xs text-muted-foreground">
                      (w/ {item.requiresCollaboration})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Financial Summary (Internal) */}
        <Card className="border-2 border-dashed border-yellow-500/50 bg-yellow-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-yellow-600">⚠</span>
              Internal Analysis
              <span className="text-xs font-normal text-muted-foreground">(not shown to partner)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-muted-foreground">Target Price</div>
                <div className="text-2xl font-bold">{formatCurrency(targetAmount)}</div>
                <div className="text-xs text-muted-foreground capitalize">{proposal.tier} tier</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Our Cost</div>
                <div className="text-2xl font-bold">{formatCurrency(totalCost)}</div>
                <div className="text-xs text-muted-foreground">{totalHours} hours total</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Profit</div>
                <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(profit)}
                </div>
                <div className="text-xs text-muted-foreground">{profitMargin.toFixed(1)}% margin</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Effective Rate</div>
                <div className="text-2xl font-bold">
                  {totalHours > 0 ? formatRate(targetAmount / totalHours) : '—'}/hr
                </div>
                <div className="text-xs text-muted-foreground">blended</div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <label className="block text-sm font-medium mb-2">Internal Notes</label>
              <Textarea
                value={proposal.internalNotes || ''}
                onChange={(e) => setProposal({ ...proposal, internalNotes: e.target.value })}
                onBlur={() => updateProposal({ internalNotes: proposal.internalNotes })}
                placeholder="Notes for internal use only..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Proposal Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Proposal Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={proposal.title}
                  onChange={(e) => setProposal({ ...proposal, title: e.target.value })}
                  onBlur={() => updateProposal({ title: proposal.title })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Client</label>
                <Input
                  value={proposal.client}
                  onChange={(e) => setProposal({ ...proposal, client: e.target.value })}
                  onBlur={() => updateProposal({ client: proposal.client })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tier</label>
                <select
                  value={proposal.tier}
                  onChange={(e) => {
                    setProposal({ ...proposal, tier: e.target.value })
                    updateProposal({ tier: e.target.value })
                  }}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="primary">$25,000 (Primary)</option>
                  <option value="lower">$20,000 (Lower Cost)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={proposal.status}
                  onChange={(e) => {
                    setProposal({ ...proposal, status: e.target.value })
                    updateProposal({ status: e.target.value })
                  }}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={proposal.brandingIncluded}
                  onCheckedChange={(checked) => {
                    setProposal({ ...proposal, brandingIncluded: !!checked })
                    updateProposal({ brandingIncluded: !!checked })
                  }}
                />
                <span className="text-sm">Include HiiiWAV branding for additional exposure</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Executive Summary</label>
              <Textarea
                value={proposal.executiveSummary || ''}
                onChange={(e) => setProposal({ ...proposal, executiveSummary: e.target.value })}
                onBlur={() => updateProposal({ executiveSummary: proposal.executiveSummary })}
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Team Readiness Notes</label>
              <Textarea
                value={proposal.teamReadinessNotes || ''}
                onChange={(e) => setProposal({ ...proposal, teamReadinessNotes: e.target.value })}
                onBlur={() => updateProposal({ teamReadinessNotes: proposal.teamReadinessNotes })}
                placeholder="Notes about team readiness requirements..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <div className="space-y-6">
          {/* Core Services */}
          <Card>
            <CardHeader>
              <CardTitle>Core Services</CardTitle>
            </CardHeader>
            <CardContent>
              <ItemsTable
                items={coreItems}
                onUpdate={updateItem}
                onDelete={deleteItem}
              />
            </CardContent>
          </Card>

          {/* Optional Services */}
          <Card>
            <CardHeader>
              <CardTitle>Optional Services</CardTitle>
            </CardHeader>
            <CardContent>
              <ItemsTable
                items={optionalItems}
                onUpdate={updateItem}
                onDelete={deleteItem}
              />
            </CardContent>
          </Card>

          {/* Add-ons */}
          {addOnItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Add-ons</CardTitle>
              </CardHeader>
              <CardContent>
                <ItemsTable
                  items={addOnItems}
                  onUpdate={updateItem}
                  onDelete={deleteItem}
                />
              </CardContent>
            </Card>
          )}

          {/* Add New Item */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Line Item
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    placeholder="e.g., Video Recording Coordination"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="core">Core</option>
                    <option value="optional">Optional</option>
                    <option value="add_on">Add-on</option>
                  </select>
                </div>
                <div className="w-24">
                  <label className="block text-sm font-medium mb-1">Hours</label>
                  <Input
                    type="number"
                    value={newItem.hours}
                    onChange={(e) => setNewItem({ ...newItem, hours: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="w-28">
                  <label className="block text-sm font-medium mb-1">Rate ($/hr)</label>
                  <Input
                    type="number"
                    value={newItem.rate / 100}
                    onChange={(e) => setNewItem({ ...newItem, rate: (parseFloat(e.target.value) || 0) * 100 })}
                  />
                </div>
                <Button onClick={addItem} disabled={!newItem.title}>
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {saving && (
          <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-md text-sm">
            Saving...
          </div>
        )}
      </div>

      <ProposalChatPanel 
        proposalId={proposal.id} 
        onRefresh={fetchProposal} 
      />
    </>
  )
}

function ItemsTable({
  items,
  onUpdate,
  onDelete,
}: {
  items: ProposalItem[]
  onUpdate: (id: number, updates: Partial<ProposalItem>) => void
  onDelete: (id: number) => void
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No items in this category</p>
  }

  return (
    <table className="w-full">
      <thead className="text-sm text-muted-foreground">
        <tr>
          <th className="text-left p-2 w-8">Inc.</th>
          <th className="text-left p-2">Item</th>
          <th className="text-right p-2 w-20">Hours</th>
          <th className="text-right p-2 w-24">Rate</th>
          <th className="text-right p-2 w-28">Cost</th>
          <th className="w-10"></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className={`border-t ${!item.included ? 'opacity-50' : ''}`}>
            <td className="p-2">
              <Checkbox
                checked={item.included}
                onCheckedChange={(checked) => onUpdate(item.id, { included: !!checked })}
              />
            </td>
            <td className="p-2">
              <input
                type="text"
                value={item.title}
                onChange={(e) => onUpdate(item.id, { title: e.target.value })}
                className="w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary rounded px-1"
              />
              {item.description && (
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              )}
              {item.requiresCollaboration && (
                <span className="text-xs text-blue-600">
                  Requires {item.requiresCollaboration} collaboration
                </span>
              )}
            </td>
            <td className="p-2 text-right">
              <input
                type="number"
                value={item.hours}
                onChange={(e) => onUpdate(item.id, { hours: parseInt(e.target.value) || 0 })}
                className="w-16 text-right bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary rounded px-1"
              />
            </td>
            <td className="p-2 text-right">
              <div className="flex items-center justify-end">
                <span className="text-muted-foreground">$</span>
                <input
                  type="number"
                  value={item.rate / 100}
                  onChange={(e) => onUpdate(item.id, { rate: (parseFloat(e.target.value) || 0) * 100 })}
                  className="w-16 text-right bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary rounded px-1"
                />
              </div>
            </td>
            <td className="p-2 text-right font-medium tabular-nums">
              {formatCurrency((item.hours || 0) * (item.rate || 0))}
            </td>
            <td className="p-2">
              <button
                onClick={() => onDelete(item.id)}
                className="text-muted-foreground hover:text-destructive p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}



