# Ngrok Setup for Calendar Webhooks

## Quick Setup

1. **Start your dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Start ngrok in a new terminal**:
   ```bash
   ngrok http 3000
   ```

3. **Copy the HTTPS URL** from ngrok output (looks like `https://abc123.ngrok-free.app`)

4. **Update .env.local automatically**:
   ```bash
   npm run update:ngrok
   ```
   
   Or manually add to `.env.local`:
   ```bash
   NEXT_PUBLIC_APP_URL=https://your-ngrok-url-here
   ```

5. **Set up calendar watch**:
   ```bash
   npm run setup:calendar
   ```

## Notes

- Keep both terminals running (dev server + ngrok)
- The ngrok URL changes each time you restart ngrok (unless you have a paid plan)
- For production, use your actual domain instead of ngrok



