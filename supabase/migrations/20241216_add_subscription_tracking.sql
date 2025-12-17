-- Migration: Add subscription tracking fields for Wix sync
-- Run this in your Supabase SQL Editor

-- Add subscription status type (if not exists)
DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('active', 'halted', 'cancelled', 'completed', 'pending');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add subscription and Wix tracking columns to quiz_leads table
ALTER TABLE quiz_leads
ADD COLUMN IF NOT EXISTS wix_order_id TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS wix_member_id TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS subscription_status subscription_status DEFAULT NULL,
ADD COLUMN IF NOT EXISTS subscription_end_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS last_renewal_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS renewal_count INTEGER DEFAULT 0;

-- Create index on wix_order_id for lookups when cancelling
CREATE INDEX IF NOT EXISTS idx_quiz_leads_wix_order_id ON quiz_leads(wix_order_id);

-- Create index on subscription_id for lookups from webhooks
CREATE INDEX IF NOT EXISTS idx_quiz_leads_subscription_id ON quiz_leads(subscription_id);

-- Create index on subscription_status for filtering
CREATE INDEX IF NOT EXISTS idx_quiz_leads_subscription_status ON quiz_leads(subscription_status);

-- Add comments for documentation
COMMENT ON COLUMN quiz_leads.wix_order_id IS 'Wix Pricing Plans order ID - needed to cancel orders';
COMMENT ON COLUMN quiz_leads.wix_member_id IS 'Wix Member ID for the user';
COMMENT ON COLUMN quiz_leads.subscription_status IS 'Subscription lifecycle status: active, halted, cancelled, completed, pending';
COMMENT ON COLUMN quiz_leads.subscription_end_at IS 'When the subscription ended (cancelled/completed)';
COMMENT ON COLUMN quiz_leads.last_renewal_at IS 'Last successful renewal payment timestamp';
COMMENT ON COLUMN quiz_leads.renewal_count IS 'Number of successful renewal payments';
