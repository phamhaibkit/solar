# PostgreSQL Setup for ATESS Proxy

## 📋 Prerequisites
- PostgreSQL installed (using pgAdmin 4)
- Node.js and npm installed
- `pg` package installed (already in package.json)

## 🔧 Setup Steps

### 1. Configure PostgreSQL Connection
Edit `.env` file with your PostgreSQL credentials:
```env
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=atess_data
PG_USER=postgres
PG_PASSWORD=your_password_here
```

### 2. Create Database (if needed)
Using pgAdmin 4:
1. Open pgAdmin 4
2. Right-click on "Databases"
3. Select "Create > Database"
4. Name: `atess_data`
5. Click "Save"

### 3. Create Table Schema
Using pgAdmin 4:
1. Open pgAdmin 4
2. Connect to `atess_data` database
3. Click "Tools" > "Query Tool"
4. Open file: `database/schema.sql`
5. Execute the SQL script

Or using command line:
```bash
psql -U postgres -d atess_data -f database/schema.sql
```

### 4. Test Connection
Run the proxy server to test PostgreSQL connection:
```bash
node src/proxy.js
```

You should see:
```
✅ Connected to PostgreSQL
🚀 Proxy running on port 1500
```

If connection fails:
```
❌ PostgreSQL connection error: ...
⚠️  Raw data will not be saved to database
```

## 📊 Database Schema

### Table: `raw_data`
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| timestamp | TIMESTAMP | Data timestamp |
| source | VARCHAR(10) | 'client' or 'server' |
| client_address | VARCHAR(50) | Client IP address |
| data_length | INTEGER | Data length in bytes |
| hex_data | TEXT | Raw hex data |
| created_at | TIMESTAMP | Record creation time |

### Indexes
- `idx_raw_data_timestamp` - For timestamp queries
- `idx_raw_data_source` - For source filtering
- `idx_raw_data_client_address` - For client address filtering

## 🔍 Query Examples

### View all raw data
```sql
SELECT * FROM raw_data ORDER BY timestamp DESC LIMIT 100;
```

### Filter by source
```sql
SELECT * FROM raw_data WHERE source = 'client' ORDER BY timestamp DESC;
```

### Filter by client address
```sql
SELECT * FROM raw_data WHERE client_address = '127.0.0.1' ORDER BY timestamp DESC;
```

### Count records by source
```sql
SELECT source, COUNT(*) as count 
FROM raw_data 
GROUP BY source;
```

### Get recent data
```sql
SELECT * FROM raw_data 
WHERE timestamp > NOW() - INTERVAL '1 hour'
ORDER BY timestamp DESC;
```

## 🚀 Running the Proxy

```bash
node src/proxy.js
```

The proxy will:
1. Listen on port 1500
2. Forward traffic to port 1600
3. Log all raw data to PostgreSQL
4. Parse and display ATESS data in console

## 📝 Troubleshooting

### Connection Error
- Check `.env` credentials
- Ensure PostgreSQL is running
- Verify database name exists
- Check firewall settings

### Table Not Found
- Run `database/schema.sql` to create table
- Verify you're connected to correct database

### Performance Issues
- Adjust `max` pool size in proxy.js
- Add more indexes if needed
- Consider archiving old data

## 🗄️ Data Management

### Archive old data
```sql
CREATE TABLE raw_data_archive AS 
SELECT * FROM raw_data 
WHERE timestamp < NOW() - INTERVAL '30 days';

DELETE FROM raw_data 
WHERE timestamp < NOW() - INTERVAL '30 days';
```

### Monitor table size
```sql
SELECT 
  pg_size_pretty(pg_total_relation_size('raw_data')) as size,
  COUNT(*) as total_records
FROM raw_data;
```
