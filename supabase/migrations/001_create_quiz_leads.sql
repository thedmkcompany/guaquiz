-- ============================================
-- Quiz Leads Table
-- ============================================
-- Primary storage for quiz submissions
-- Ensures no leads are lost even if Wix CRM is unavailable
-- ============================================

CREATE TABLE IF NOT EXISTS quiz_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Lead contact info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,

  -- Quiz results
  recommendation TEXT NOT NULL, -- Program slug: trial, essentials, transform, circle
  quiz_answers JSONB, -- Full quiz response data

  -- Tracking
  device_type TEXT,
  referral_source TEXT,

  -- Wix CRM sync status
  wix_sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (wix_sync_status IN ('pending', 'synced', 'failed')),
  wix_contact_id TEXT, -- Wix contact ID after successful sync
  wix_sync_error TEXT, -- Last error message if sync failed
  wix_sync_attempts INTEGER NOT NULL DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Indexes for common queries
-- ============================================

-- Fast lookup by email (for deduplication)
CREATE INDEX IF NOT EXISTS idx_quiz_leads_email ON quiz_leads (email);

-- Fast lookup for pending syncs (retry queue)
CREATE INDEX IF NOT EXISTS idx_quiz_leads_sync_status ON quiz_leads (wix_sync_status, wix_sync_attempts);

-- Fast lookup by recommendation (for analytics)
CREATE INDEX IF NOT EXISTS idx_quiz_leads_recommendation ON quiz_leads (recommendation);

-- Created at for chronological queries
CREATE INDEX IF NOT EXISTS idx_quiz_leads_created_at ON quiz_leads (created_at DESC);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE quiz_leads ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (server-side API)
CREATE POLICY "Service role full access" ON quiz_leads
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Updated_at trigger
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quiz_leads_updated_at
  BEFORE UPDATE ON quiz_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Comments
-- ============================================

COMMENT ON TABLE quiz_leads IS 'Primary storage for quiz lead submissions with Wix CRM sync status';
COMMENT ON COLUMN quiz_leads.wix_sync_status IS 'pending: awaiting sync, synced: successfully synced to Wix, failed: sync failed after max retries';
COMMENT ON COLUMN quiz_leads.wix_sync_attempts IS 'Number of sync attempts, max 5 before giving up';
