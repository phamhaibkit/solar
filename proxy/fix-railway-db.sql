-- Fix PostgreSQL pg_stat_statements error on Railway
-- Enable pg_stat_statements extension

-- Connect to your Railway PostgreSQL database and run:

-- 1. Enable the extension
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- 2. Reset statistics (optional)
SELECT pg_stat_statements_reset();

-- 3. Verify it's working
SELECT * FROM pg_stat_statements LIMIT 1;

-- 4. Check extension is enabled
SELECT extname, extversion FROM pg_extension WHERE extname = 'pg_stat_statements';
