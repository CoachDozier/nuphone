
# AI Phone Answering System

This is a Twilio-based phone answering system that uses AI to respond to callers.

## How to Test and Use

1. Run the server: Click the "Run" button in Replit
2. Find your Replit URL by visiting `/server-info` (e.g., https://yourrepl.replit.app/server-info)
3. Configure Twilio:
   - Set up a phone number in Twilio
   - Set the webhook for incoming calls to: `https://yourrepl.replit.app/process-call`
   - Make sure the webhook method is set to "HTTP POST"

## Endpoints

- `/` - Home page showing server status
- `/test` - Test endpoint to check if server is running
- `/check-audio` - Check if audio file has been generated
- `/server-info` - Get server URL information
- `/process-call` - Twilio webhook endpoint (POST)

## Troubleshooting

If you're having issues with the audio URLs:
1. Make sure your Replit is properly deployed and accessible on the web
2. Check the console logs for the detected URLs
3. Visit `/server-info` to see what URL your server is using
4. Test the audio endpoint directly at `/output.mp3` after making a test call
