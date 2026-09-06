# Contact form delivery setup

Create a separate Google spreadsheet. The document can have any name; `AeroTherm Contact Form Leads` is recommended.

Rename its worksheet tab to `Contact Leads` and add these headers to row 1 in this exact order:

1. Submitted At
2. Full Name
3. Company / Organization
4. Email
5. Phone / WhatsApp
6. Service Required
7. Project Details
8. Source

Open Extensions → Apps Script, replace the editor contents with `contact/google-apps-script.gs`, and deploy it as a Web app with **Execute as: Me** and **Who has access: Anyone**. Copy the new `/exec` URL into:

```env
CONTACT_GOOGLE_APPS_SCRIPT_URL=
```

Email delivery reuses the chatbot’s existing settings:

```env
RESEND_API_KEY=
CHATBOT_EMAIL_FROM=AeroTherm Engineering <leads@your-verified-domain.com>
CHATBOT_TEAM_EMAIL=info@aerothermengineering.com
```

The team receives the complete inquiry at `CHATBOT_TEAM_EMAIL`. The person submitting the form receives a branded confirmation email at the address entered in the form.
