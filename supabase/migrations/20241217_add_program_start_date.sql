-- Add program_start_date column to quiz_leads table
-- Migration: 20241217_add_program_start_date
-- Purpose: Store user-selected Circle program start date (always a Monday)
-- Author: Claude Code
-- Date: 2024-12-17

-- Add column with TIMESTAMPTZ (stores in UTC, displays in local timezone)
ALTER TABLE quiz_leads
ADD COLUMN IF NOT EXISTS program_start_date TIMESTAMPTZ DEFAULT NULL;

-- Add index for performance on queries filtering by start date
-- Only index non-NULL values (Circle purchases only)
CREATE INDEX IF NOT EXISTS idx_quiz_leads_program_start_date
ON quiz_leads(program_start_date)
WHERE program_start_date IS NOT NULL;

-- Add documentation comment
COMMENT ON COLUMN quiz_leads.program_start_date IS
'User-selected program start date for Circle (always a Monday). NULL for non-Circle programs only. Stored in UTC, represents Monday 6 AM IST.';

-- Verify the migration
DO $$
BEGIN
  -- Check if column exists
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'quiz_leads'
    AND column_name = 'program_start_date'
  ) THEN
    RAISE NOTICE 'Migration successful: program_start_date column added';
  ELSE
    RAISE EXCEPTION 'Migration failed: program_start_date column not found';
  END IF;

  -- Check if index exists
  IF EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE tablename = 'quiz_leads'
    AND indexname = 'idx_quiz_leads_program_start_date'
  ) THEN
    RAISE NOTICE 'Migration successful: index created';
  ELSE
    RAISE EXCEPTION 'Migration failed: index not found';
  END IF;
END $$;
