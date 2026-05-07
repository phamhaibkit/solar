# Fix PostgreSQL pg_stat_statements Error on Railway

## Problem
```
ERROR: relation "pg_stat_statements" does not exist
```

## Solutions

### Option 1: Enable Extension (Recommended)

1. **Connect to Railway PostgreSQL:**
   ```bash
   railway login
   railway connect postgres
   ```

2. **Run SQL commands:**
   ```sql
   CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
   ```

3. **Or use the provided script:**
   ```bash
   psql -h YOUR_RAILWAY_HOST -U YOUR_RAILWAY_USER -d YOUR_RAILWAY_DB -f fix-railway-db.sql
   ```

### Option 2: Disable Statement Monitoring

If you don't have permission to create extensions:

1. **Go to Railway dashboard**
2. **Find your PostgreSQL service**
3. **Add environment variable:**
   ```
   POSTGRES_DISABLE_STATEMENT_TRACKING=true
   ```
4. **Redeploy the service**

### Option 3: Update Application Code

Modify your database connection to ignore this error:

```javascript
// In your database connection setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Add this to disable statement tracking
  statement_timeout: '30s',
  // Disable pg_stat_statements queries
  options: '-c statement_timeout=30s'
});
```

## Verification

After fixing, check logs should show:
```
✅ No more pg_stat_statements errors
```

## Notes

- `pg_stat_statements` requires superuser privileges
- Railway may have restrictions on extension creation
- This extension is used for query performance monitoring
- Disabling it won't affect core functionality
