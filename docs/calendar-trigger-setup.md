# Google Calendar Trigger Setup

## Prerequisites

### 1. Enable Google Calendar API
Visit: https://console.cloud.google.com/apis/library/calendar-json.googleapis.com
- Click "Enable"
- Wait 2-3 minutes for it to propagate

### 2. Share Calendar with Service Account
Your service account email: `meeting-debrief-agent@meeting-debrief-agent.iam.gserviceaccount.com`

**Steps:**
1. Open Google Calendar
2. Click the three dots next to your calendar (bosko@hiiiwav.org)
3. Select "Settings and sharing"
4. Scroll to "Share with specific people"
5. Click "Add people"
6. Enter: `meeting-debrief-agent@meeting-debrief-agent.iam.gserviceaccount.com`
7. Select permission: "See all event details"
8. Click "Send"

### 3. Set Environment Variables
Add to `.env.local`:
```bash
GOOGLE_CALENDAR_ID=bosko@hiiiwav.org
NEXT_PUBLIC_APP_URL=https://yourdomain.com  # or http://localhost:3000 for local
```

## Setup Commands

### Check Configuration
```bash
npm run calendar:guide
```

### Test Calendar Access
```bash
npm run test:calendar
```

### Set Up Calendar Watch
```bash
npm run setup:calendar
```

Or call the API:
```bash
curl http://localhost:3000/api/meetings/calendar
```

## Testing

1. Create a test meeting that ends in the next 30 minutes
2. Wait for the meeting to end
3. The system will automatically trigger a debrief call

## Troubleshooting

### "Calendar API not enabled"
- Enable it at: https://console.cloud.google.com/apis/library/calendar-json.googleapis.com
- Wait a few minutes and retry

### "403 Forbidden" or "Calendar not found"
- Make sure the calendar is shared with the service account email
- Check that you're using the correct calendar ID (email address)

### "Webhook URL not accessible"
- For local testing, use ngrok: `ngrok http 3000`
- Update `NEXT_PUBLIC_APP_URL` to the ngrok URL
- Re-run `npm run setup:calendar`

### Watch Expires
- Calendar watches expire after 7 days
- Re-run `npm run setup:calendar` to renew



