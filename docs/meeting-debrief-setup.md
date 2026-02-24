# Meeting Debrief Agent Setup Guide

This guide walks through setting up the AI Meeting Debrief Agent that calls executives after meetings to capture notes.

## Overview

The agent:
1. Receives a trigger (manual for now, calendar later)
2. Calls the executive's phone via Retell AI
3. Conducts a structured debrief conversation
4. Writes notes to a Google Doc

**Security**: No audio is ever recorded. Only real-time transcription is used.

---

## Step 1: Retell AI Setup

### 1.1 Create Account
1. Go to [retellai.com](https://www.retellai.com)
2. Sign up for an account
3. Get your API key from Settings → API Keys

### 1.2 Create the Debrief Agent
1. Go to Agents → Create Agent
2. Name: "HiiiWAV Meeting Debrief Agent"
3. Copy the system prompt from `lib/debrief-agent-prompt.ts`
4. Configure:
   - Voice: Pick a natural-sounding voice (recommend "Rachel" or "Josh")
   - Model: GPT-4o or Claude 3.5 Sonnet
   - **CRITICAL**: Disable "Enable Recording" for security
5. Save and copy the Agent ID

### 1.3 Purchase a Phone Number
1. Go to Phone Numbers → Buy Number
2. Select your region
3. Copy the phone number (format: +1XXXXXXXXXX)

### 1.4 Set Webhook URL
1. Go to your agent settings
2. Set webhook URL to: `https://YOUR_DOMAIN/api/meetings/webhook`
3. (Optional) Set a webhook secret for signature verification

---

## Step 2: Google Cloud Setup

### 2.1 Create Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the Google Docs API
4. Go to IAM & Admin → Service Accounts
5. Create a new service account
6. Create a JSON key and download it

### 2.2 Create Debrief Document
1. Create a new Google Doc for meeting notes
2. Copy the document ID from the URL:
   - URL: `https://docs.google.com/document/d/DOCUMENT_ID/edit`
3. Share the document with your service account email (found in the JSON key)
4. Give "Editor" permission

---

## Step 3: Environment Variables

Add these to your `.env.local`:

```bash
# Retell AI
RETELL_API_KEY=your_retell_api_key
RETELL_DEBRIEF_AGENT_ID=your_agent_id
RETELL_PHONE_NUMBER=+1XXXXXXXXXX
RETELL_WEBHOOK_SECRET=optional_webhook_secret

# Executive to call
EXECUTIVE_PHONE_NUMBER=+1XXXXXXXXXX

# Google Docs
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
# Or base64 encoded:
# GOOGLE_SERVICE_ACCOUNT_KEY=eyJ0eXBlIjoic2VydmljZV9hY2NvdW50Ii...
GOOGLE_DEBRIEF_DOC_ID=your_document_id
```

---

## Step 4: Verify Setup

Check your configuration:
```bash
curl http://localhost:3000/api/meetings/status
```

You should see all items showing `true`.

---

## Step 5: Test a Debrief Call

Trigger a test call:
```bash
curl -X POST http://localhost:3000/api/meetings/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "meetingTitle": "Test Meeting with Foundation X",
    "executiveName": "Bosko",
    "attendees": ["John Smith", "Jane Doe"]
  }'
```

Your phone should ring within a few seconds. After the call:
1. Check the Google Doc for the captured notes
2. Review and iterate on the agent prompt if needed

---

## Troubleshooting

### Call not connecting
- Verify EXECUTIVE_PHONE_NUMBER is in E.164 format (+1XXXXXXXXXX)
- Check Retell dashboard for call logs
- Ensure RETELL_PHONE_NUMBER is valid and active

### Notes not appearing in Google Doc
- Verify service account has Editor access to the doc
- Check server logs for webhook errors
- Ensure GOOGLE_DEBRIEF_DOC_ID is correct

### Webhook not receiving events
- Verify webhook URL is publicly accessible
- Check Retell dashboard for webhook delivery logs
- For local testing, use ngrok or similar

---

## Next Steps

After validating the manual flow:
1. Add calendar integration (Phase 2)
2. Onboard Maya for testing
3. Deploy to EBC

---

## API Reference

### POST /api/meetings/trigger
Manually trigger a debrief call.

```typescript
{
  meetingTitle: string,      // Required
  meetingDate?: string,      // Optional, defaults to today
  attendees?: string[],      // Optional
  executiveName?: string     // Optional, defaults to "there"
}
```

### POST /api/meetings/webhook
Webhook for Retell AI to send call events and transcripts.
(Called automatically by Retell, not manually)

### GET /api/meetings/status
Check configuration status.

---

## Security Architecture

### No Audio Recording (Critical)
- Retell AI processes audio in **real-time** and immediately discards it
- Configure agent with `enable_recording: false` in Retell dashboard
- Only text transcripts are generated and stored
- This matches EBC's security requirements after the Zoom breach

### Data Flow Security
```
Executive Phone → Retell (real-time STT) → Transcript → Google Doc
                  ↓
           Audio DISCARDED
           (never stored)
```

### Access Controls
- **Google Doc**: Same security model as current manual process
  - Only shared with development team lead
  - Use Google's built-in sharing permissions
- **Webhook signature**: Set `RETELL_WEBHOOK_SECRET` for production
  - Verifies webhooks genuinely come from Retell
- **API endpoints**: Currently no auth (add before production)

### Compliance
- Retell AI is SOC 2 Type II certified
- HIPAA compliant infrastructure
- End-to-end encryption in transit
- No PII stored on our servers (only in Google Doc)

### What's NOT Stored
- Audio recordings (discarded immediately)
- Call recordings in any form
- Executive phone number history on our servers
- Any data that could be "played back"

### Audit Trail
- Call metadata (timestamp, duration) logged
- No content stored in our application logs
- Google Doc revision history available



