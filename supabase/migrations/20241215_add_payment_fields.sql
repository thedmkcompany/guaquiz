-- Migration: Add payment tracking fields to quiz_leads table
-- Run this in your Supabase SQL Editor

-- Add payment status enum type (if not exists)
DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add payment gateway enum type (if not exists)
DO $$ BEGIN
    CREATE TYPE payment_gateway AS ENUM ('razorpay', 'payu');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add payment columns to quiz_leads table
ALTER TABLE quiz_leads
ADD COLUMN IF NOT EXISTS payment_status payment_status DEFAULT NULL,
ADD COLUMN IF NOT EXISTS payment_id TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10, 2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS program_purchased TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS subscription_id TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS payment_gateway payment_gateway DEFAULT NULL,
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ DEFAULT NULL;

-- Create index on payment_status for faster queries
CREATE INDEX IF NOT EXISTS idx_quiz_leads_payment_status ON quiz_leads(payment_status);

-- Create index on payment_id for lookups
CREATE INDEX IF NOT EXISTS idx_quiz_leads_payment_id ON quiz_leads(payment_id);

-- Create index on paid_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_quiz_leads_paid_at ON quiz_leads(paid_at);

-- Add comment for documentation
COMMENT ON COLUMN quiz_leads.payment_status IS 'Payment status: pending, paid, failed, refunded';
COMMENT ON COLUMN quiz_leads.payment_id IS 'Payment gateway transaction ID (Razorpay payment_id or PayU mihpayid)';
COMMENT ON COLUMN quiz_leads.payment_amount IS 'Payment amount in INR';
COMMENT ON COLUMN quiz_leads.program_purchased IS 'Program ID that was purchased';
COMMENT ON COLUMN quiz_leads.subscription_id IS 'Razorpay subscription ID for recurring payments';
COMMENT ON COLUMN quiz_leads.payment_gateway IS 'Payment gateway used: razorpay or payu';
COMMENT ON COLUMN quiz_leads.paid_at IS 'Timestamp when payment was confirmed';
