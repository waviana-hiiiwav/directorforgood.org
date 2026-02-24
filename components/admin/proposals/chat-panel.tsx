'use client'

import { useChat } from '@ai-sdk/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'
import { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react'

export function ProposalChatPanel({ proposalId, onRefresh }: { proposalId: number, onRefresh: () => void }) {
  const [open, setOpen] = useState(true)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, isLoading, reload } = useChat({
    api: `/api/proposals/${proposalId}/chat`,
    onToolCall: () => {
      setTimeout(onRefresh, 500)
    },
    onFinish: () => {
      onRefresh()
      setSending(false)
    },
    onError: () => {
      setSending(false)
    }
  })

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim() || sending || isLoading) return
    
    setSending(true)
    const messageText = text
    setText('')
    
    try {
      const response = await fetch(`/api/proposals/${proposalId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: messageText }]
        })
      })
      
      if (response.ok) {
        await reload()
      }
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setSending(false)
      onRefresh()
    }
  }

  if (!open) {
    return (
      <Button 
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 h-12 w-12 rounded-full shadow-lg z-[100]"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  const isBusy = sending || isLoading

  return (
    <Card className="fixed left-6 top-24 bottom-4 w-80 flex flex-col shadow-2xl z-[100]">
      <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          Proposal Assistant
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground text-xs mt-10">
            Ask me to change hours, add items, or adjust pricing.
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-3 rounded-lg text-xs ${
              m.role === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            }`}>
              {m.content}
              {m.toolInvocations?.map((toolInvocation) => {
                const toolCallId = toolInvocation.toolCallId;
                return (
                  <div key={toolCallId} className="mt-2 pt-2 border-t border-black/10 text-[10px] italic opacity-70">
                    Executing {toolInvocation.toolName}...
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {isBusy && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg text-xs">
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-foreground/50 animate-bounce" />
                <div className="w-1 h-1 rounded-full bg-foreground/50 animate-bounce [animation-delay:0.2s]" />
                <div className="w-1 h-1 rounded-full bg-foreground/50 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <form onSubmit={handleFormSubmit} className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="e.g. Reduce coaching to 50h"
          className="flex-1 text-xs border rounded px-3 py-2 bg-background focus:ring-1 focus:ring-primary outline-none"
          disabled={isBusy}
          autoComplete="off"
        />
        <Button 
          type="submit" 
          size="icon" 
          className="h-9 w-9 shrink-0" 
          disabled={isBusy || !text.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  )
}


