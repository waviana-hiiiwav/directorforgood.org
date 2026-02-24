"use client"

import { useEffect, useState } from "react"

interface DebriefCall {
  id: number
  calendarEventId: string
  meetingTitle: string
  meetingDate: string
  callId: string | null
  status: string
  retellCallId: string | null
  transcript: string | null
  callAnalysis: {
    call_summary?: string
    user_sentiment?: string
    call_successful?: boolean
    call_duration_seconds?: number
  } | null
  errorMessage: string | null
  createdAt: string
  updatedAt: string
}

export default function DebriefCallsPage() {
  const [calls, setCalls] = useState<DebriefCall[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCall, setSelectedCall] = useState<DebriefCall | null>(null)

  useEffect(() => {
    fetchCalls()
  }, [])

  async function fetchCalls() {
    try {
      const response = await fetch("/api/admin/debrief-calls")
      const data = await response.json()
      setCalls(data.calls || [])
    } catch (error) {
      console.error("Error fetching calls:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "triggered":
        return "bg-blue-100 text-blue-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading debrief calls...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Meeting Debrief Calls</h1>
        <button
          onClick={fetchCalls}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Refresh
        </button>
      </div>

      {calls.length === 0 ? (
        <div className="border rounded-lg p-8 text-center text-muted-foreground">
          No debrief calls found. Calls will appear here after meetings end.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calls List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Calls ({calls.length})</h2>
            <div className="space-y-3">
              {calls.map((call) => (
                <div
                  key={call.id}
                  onClick={() => setSelectedCall(call)}
                  className={`border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedCall?.id === call.id ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{call.meetingTitle}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        call.status
                      )}`}
                    >
                      {call.status}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>
                      {new Date(call.meetingDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div>
                      Created: {new Date(call.createdAt).toLocaleString()}
                    </div>
                    {call.callAnalysis?.call_duration_seconds && (
                      <div>
                        Duration: {Math.round(call.callAnalysis.call_duration_seconds / 60)} min
                      </div>
                    )}
                    {call.transcript && (
                      <div className="text-primary font-medium mt-2">
                        ✓ Transcript available
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call Details */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            {selectedCall ? (
              <div className="border rounded-lg p-6 bg-card">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">{selectedCall.meetingTitle}</h2>
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(
                      selectedCall.status
                    )}`}
                  >
                    {selectedCall.status}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Meeting Details</h3>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <div>
                        <strong>Date:</strong>{" "}
                        {new Date(selectedCall.meetingDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      {selectedCall.retellCallId && (
                        <div>
                          <strong>Call ID:</strong> {selectedCall.retellCallId}
                        </div>
                      )}
                      {selectedCall.callAnalysis?.call_duration_seconds && (
                        <div>
                          <strong>Duration:</strong>{" "}
                          {Math.round(selectedCall.callAnalysis.call_duration_seconds / 60)}{" "}
                          minutes
                        </div>
                      )}
                      {selectedCall.callAnalysis?.user_sentiment && (
                        <div>
                          <strong>Sentiment:</strong> {selectedCall.callAnalysis.user_sentiment}
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedCall.callAnalysis?.call_summary && (
                    <div>
                      <h3 className="font-semibold mb-2">Summary</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedCall.callAnalysis.call_summary}
                      </p>
                    </div>
                  )}

                  {selectedCall.transcript ? (
                    <div>
                      <h3 className="font-semibold mb-2">Full Transcript</h3>
                      <div className="bg-muted rounded p-4 max-h-96 overflow-y-auto">
                        <pre className="text-xs whitespace-pre-wrap font-mono">
                          {selectedCall.transcript}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Transcript not available yet. It will appear here once the call completes.
                    </div>
                  )}

                  {selectedCall.errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <h3 className="font-semibold text-red-800 mb-1">Error</h3>
                      <p className="text-sm text-red-700">{selectedCall.errorMessage}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-8 text-center text-muted-foreground">
                Select a call to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}



