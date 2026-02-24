# Google Cloud Setup - Step by Step

## Step 1: Select or Create a Project

You're currently at the **organization level** (`hiiiwav.org`). You need to work at the **project level**.

### Option A: Use Existing Project
1. Click the dropdown next to "hiiiwav.org" in the top bar (where it says "hiiiwav.org" with a grid icon)
2. Select an existing project from the list

### Option B: Create New Project
1. Click the dropdown next to "hiiiwav.org"
2. Click "New Project"
3. Name it: `meeting-debrief-agent` (or any name you prefer)
4. Click "Create"
5. Wait for it to be created, then select it

---

## Step 2: Enable Google Docs API

1. In the search bar at the top, type: **"Google Docs API"**
2. Click on "Google Docs API" from the results
3. Click the **"Enable"** button
4. Wait for it to enable (takes a few seconds)

---

## Step 3: Create Service Account

1. In the left sidebar, click **"IAM & Admin"** → **"Service Accounts"**
   (You should see it in the list - it's below "IAM" in the sidebar)

2. Click the **"+ Create Service Account"** button at the top

3. Fill in the details:
   - **Service account name**: `meeting-debrief-agent`
   - **Service account ID**: (auto-filled, leave as is)
   - **Description**: `Service account for Meeting Debrief Agent to write notes to Google Docs`
   - Click **"Create and Continue"**

4. Grant access (optional for this use case, but you can skip):
   - Click **"Continue"** without adding roles
   - Or add "Editor" role if you want
   - Click **"Done"**

---

## Step 4: Create JSON Key

1. You should now see your service account in the list
2. Click on the service account name (`meeting-debrief-agent`)
3. Click the **"Keys"** tab at the top
4. Click **"Add Key"** → **"Create new key"**
5. Select **"JSON"** format
6. Click **"Create"**
7. A JSON file will download automatically - **save this file somewhere safe!**

---

## Step 5: Get Service Account Email

1. Still on the service account page
2. Copy the **"Email"** field (looks like: `meeting-debrief-agent@your-project-id.iam.gserviceaccount.com`)
3. You'll need this to share the Google Doc with the service account

---

## Step 6: Encode the JSON Key

Run this command (replace with your actual file path):

```bash
npx tsx scripts/encode-service-account.ts /path/to/your/downloaded-key.json
```

This will output a base64-encoded string. Copy that entire string.

---

## Step 7: Add to .env.local

Add the encoded key to your `.env.local`:

```bash
GOOGLE_SERVICE_ACCOUNT_KEY=paste_the_base64_string_here
```

---

## Step 8: Create Google Doc

1. Go to [Google Docs](https://docs.google.com)
2. Create a new document
3. Name it: "Meeting Debriefs - HiiiWAV"
4. Click **"Share"** button (top right)
5. Paste the service account email (from Step 5)
6. Give it **"Editor"** permission
7. Click **"Send"** (or "Done" if it doesn't require sending)

---

## Step 9: Get Document ID

1. Look at the URL of your Google Doc:
   ```
   https://docs.google.com/document/d/DOCUMENT_ID_HERE/edit
   ```
2. Copy the `DOCUMENT_ID_HERE` part
3. Add it to `.env.local`:
   ```bash
   GOOGLE_DEBRIEF_DOC_ID=DOCUMENT_ID_HERE
   ```

---

## Quick Checklist

- [ ] Selected/created a project (not organization level)
- [ ] Enabled Google Docs API
- [ ] Created service account
- [ ] Downloaded JSON key
- [ ] Encoded JSON key to base64
- [ ] Added `GOOGLE_SERVICE_ACCOUNT_KEY` to `.env.local`
- [ ] Created Google Doc
- [ ] Shared Google Doc with service account email (Editor permission)
- [ ] Added `GOOGLE_DEBRIEF_DOC_ID` to `.env.local`

---

## Troubleshooting

**"Service Accounts" not visible?**
- Make sure you're at the **project level**, not organization level
- Click the project dropdown and select a project first

**Can't enable Google Docs API?**
- Make sure you have billing enabled (even if on free tier)
- Try refreshing the page

**Service account email not working for sharing?**
- Make sure you copied the full email (ends with `.iam.gserviceaccount.com`)
- Make sure you gave it "Editor" permission, not just "Viewer"



