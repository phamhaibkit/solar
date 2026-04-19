-- Clear all data from raw_data table
-- WARNING: This will delete all existing data!

-- Option 1: TRUNCATE (recommended - faster, resets auto-increment)
TRUNCATE TABLE raw_data CASCADE;

-- Option 2: DELETE (slower, preserves auto-increment sequence)
-- DELETE FROM raw_data;

-- Option 3: DROP and recreate table (if you want to start completely fresh)
-- DROP TABLE IF EXISTS raw_data;
-- Then run the full schema.sql again

-- Verify data is cleared
SELECT COUNT(*) FROM raw_data;
