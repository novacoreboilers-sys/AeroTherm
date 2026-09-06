# AeroTherm website assistant

This module contains the AeroTherm Engineering chatbot UI, qualification logic, Groq orchestration, Neon persistence, Google Sheets delivery, and optional Resend notifications.

The assistant collects only four required details: name, phone, email, and service. Business knowledge, service choices, and visible copy live in `chatbot/config.ts`.

## Environment

```env
GROQ_API_KEY=
DATABASE_URL=
GOOGLE_APPS_SCRIPT_URL=
RESEND_API_KEY=
CHATBOT_EMAIL_FROM=AeroTherm Engineering <leads@example.com>
CHATBOT_TEAM_EMAIL=info@aerothermengineering.com
CHATBOT_FINGERPRINT_SECRET=
```

The Resend variables are optional. Keep all environment values server-only; do not prefix them with `NEXT_PUBLIC_`.

## Database

Run the SQL files in `chatbot/database/migrations` in numeric order. Migration `003_google_sheets_delivery.sql` safely converts an existing imported Airtable status column to the Google Sheets status column.

## Google Sheet setup

1. Create a Google Sheet and add a tab named `Leads`.
2. Add this header row: `Submitted At`, `Submission ID`, `Name`, `Phone`, `Email`, `Service`, `Source`, `Page`.
3. In the sheet, open Extensions → Apps Script and paste `chatbot/google-apps-script.gs`.
4. Deploy the script as a web app and copy its `/exec` URL into `GOOGLE_APPS_SCRIPT_URL`.

The Next.js API sends the JSON body as plain text to the server-side Apps Script endpoint. The endpoint URL never reaches the browser.

## Required packages

```bash
npm install ai @ai-sdk/groq @neondatabase/serverless zod
```

The thin Next.js route adapters remain under `app/api`, while all feature-specific code stays in this directory.
