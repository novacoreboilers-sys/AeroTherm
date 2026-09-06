BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbot_leads' AND column_name = 'airtable_status'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbot_leads' AND column_name = 'google_sheets_status'
  ) THEN
    ALTER TABLE chatbot_leads RENAME COLUMN airtable_status TO google_sheets_status;
  ELSIF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbot_leads' AND column_name = 'google_sheets_status'
  ) THEN
    ALTER TABLE chatbot_leads
      ADD COLUMN google_sheets_status TEXT NOT NULL DEFAULT 'pending'
      CHECK (google_sheets_status IN ('pending', 'sent', 'failed'));
  END IF;
END $$;

COMMIT;
