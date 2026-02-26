-- Migration: Add payment sync tracking fields
-- Purpose: Track Wix CRM sync status separately for paid leads
-- (contact creation + member creation + pricing plan assignment)
-- NULL default means no impact on existing rows or quiz lead inserts.
-- Only leads that complete payment get a non-null value.

ALTER TABLE quiz_leads
ADD COLUMN IF NOT EXISTS wix_payment_sync_status TEXT DEFAULT NULL
  CHECK (wix_payment_sync_status IS NULL OR wix_payment_sync_status IN ('pending', 'synced', 'failed')),
ADD COLUMN IF NOT EXISTS wix_payment_sync_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS wix_payment_sync_error TEXT DEFAULT NULL;

-- Partial index for the cron retry query (only rows needing retry are indexed)
CREATE INDEX IF NOT EXISTS idx_quiz_leads_payment_sync_status
ON quiz_leads (wix_payment_sync_status, wix_payment_sync_attempts)
WHERE wix_payment_sync_status IN ('pending', 'failed');
