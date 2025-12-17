-- Add start_date_option column to quiz_leads table
-- Migration: 20251217095917_add_start_date_option
-- Purpose: Store user-selected program start date option (e.g., 'coming-monday', 'coming-1st', 'coming-15th')
-- Author: Claude Code
-- Date: 2024-12-17

-- Add column with TEXT type (stores option like 'coming-monday', 'coming-1st', 'coming-15th')
ALTER TABLE quiz_leads
ADD COLUMN IF NOT EXISTS start_date_option TEXT DEFAULT NULL;

-- Add documentation comment
COMMENT ON COLUMN quiz_leads.start_date_option IS
'User-selected program start date option. Circle: coming-monday/following-monday. Essentials: coming-1st/coming-15th. NULL for programs without date selection.';

-- Verify the migration
DO $$
BEGIN
  -- Check if column exists
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'quiz_leads'
    AND column_name = 'start_date_option'
  ) THEN
    RAISE NOTICE 'Migration successful: start_date_option column added';
  ELSE
    RAISE EXCEPTION 'Migration failed: start_date_option column not found';
  END IF;
END $$;
