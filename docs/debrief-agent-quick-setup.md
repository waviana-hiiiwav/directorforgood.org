# Quick Setup Guide - Meeting Debrief Agent

Since you've already created the Retell account, agent, and phone number, let's configure the environment variables.

## Step 1: Get Retell Values

### API Key
1. Go to [Retell Dashboard](https://platform.retellai.com) → Settings → API Keys
2. Copy your API Key

### Agent ID
1. Go to Retell Dashboard → Agents
2. Click on your "HiiiWAV Meeting Debrief Agent"
3. Copy the Agent ID (looks like `oBeDLoLOeuAbiuaMFXRtDOLriTJ5tSxD`)

### Phone Number
1. Go to Retell Dashboard → Phone Numbers
2. Copy your purchased number in E.164 format (e.g., `+14157774444`)

---

## Step 2: Set Up Google Service Account

Since you're a Google Workspace admin, this is easier:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (or create one)
3. Enable the **Google Docs API**:
   - APIs & Services → Enable APIs
   - Search "Google Docs API" → Enable
4. Create Service Account:
   - IAM & Admin → Service Accounts → Create Service Account
   - Name: `meeting-debrief-agent`
   - Grant role: **Editor** (or create custom role with Docs API access)
   - Click Done
5. Create JSON Key:
   - Click on the service account you just created
   - Keys tab → Add Key → Create new key → JSON
   - Download the JSON file

---

## Step 3: Create Google Doc

1. Create a new Google Doc (or use existing)
2. Name it: "Meeting Debriefs - HiiiWAV"
3. Get the Document ID from the URL:
   ```
   https://docs.google.com/document/d/DOCUMENT_ID_HERE/edit
   ```
4. Share the doc with your service account email:
   - Click Share
   - Add the email from your service account JSON (`client_email` field)
   - Give it **Editor** permission
   - Click Done

---

## Step 4: Configure Retell Agent

**CRITICAL**: Disable recording for security

1. Go to Retell Dashboard → Agents → Your Agent
2. Scroll to "Call Recording" section
3. **Disable "Enable Recording"** ✅
4. Set Webhook URL:
   - For local testing: Use ngrok or similar to expose `http://localhost:3000/api/meetings/webhook`
   - For production: `https://yourdomain.com/api/meetings/webhook`
5. Copy the system prompt from `lib/debrief-agent-prompt.ts` into the agent's prompt field

---

## Step 5: Create .env.local

Create `.env.local` in the project root:

```bash
# Retell AI
RETELL_API_KEY=your_api_key_here
RETELL_DEBRIEF_AGENT_ID=your_agent_id_here
RETELL_PHONE_NUMBER=+14157774444

# Executive to call (your phone for testing)
EXECUTIVE_PHONE_NUMBER=+1XXXXXXXXXX

# Google Service Account
# Option 1: Raw JSON (works but harder to manage)
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}

# Option 2: Base64 encoded (recommended - easier in .env files)
# GOOGLE_SERVICE_ACCOUNT_KEY=eyJ0eXBlIjoic2VydmljZV9hY2NvdW50Ii...

# Google Doc
GOOGLE_DEBRIEF_DOC_ID=your_document_id_here

# Optional: Webhook secret for production
# RETELL_WEBHOOK_SECRET=your_webhook_secret
```

**To base64 encode your service account JSON:**
```bash
# On Mac/Linux:
cat path/to/service-account.json | base64 | tr -d '\n'

# Or in Node:
node -e "console.log(require('fs').readFileSync('path/to/service-account.json').toString('base64'))"
```

---

## Step 6: Verify Setup

```bash
# Start dev server
npm run dev

# In another terminal, check status
curl http://localhost:3000/api/meetings/status
```

You should see all items showing `true` in the response.

---

## Step 7: Test Your First Call

```bash
curl -X POST http://localhost:3000/api/meetings/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "meetingTitle": "Test Meeting with Foundation X",
    "executiveName": "Bosko",
    "attendees": ["John Smith", "Jane Doe"]
  }'
```

Your phone should ring within a few seconds! After the call:
1. Check your Google Doc - notes should appear automatically
2. Review the conversation quality
3. Adjust the agent prompt in Retell if needed

---

## Troubleshooting

### "Missing configuration" errors
- Double-check all env vars are set correctly
- Restart your dev server after changing `.env.local`

### Call not connecting
- Verify phone numbers are in E.164 format (`+1...`)
- Check Retell dashboard → Calls for error logs

### Notes not appearing in Google Doc
- Verify service account has Editor access to the doc
- Check server logs for webhook errors
- Ensure `GOOGLE_DEBRIEF_DOC_ID` is correct

### Webhook not receiving events
- For local testing, use ngrok: `ngrok http 3000`
- Update webhook URL in Retell dashboard
- Check Retell dashboard → Webhooks for delivery status

---

## Next Steps

Once manual testing works:
1. Test with 5+ real meetings
2. Iterate on agent prompt based on your feedback
3. Onboard Maya for Phase 2 testing
4. Add calendar auto-trigger (already built, just needs activation)



