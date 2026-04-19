# Windows Deployment Guide for ATESS Proxy

## 📋 Prerequisites Checklist

### 1. Install Node.js
- Download: https://nodejs.org/
- Install LTS version (recommended: 18.x or 20.x)
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### 2. Install PostgreSQL
- Download: https://www.postgresql.org/download/windows/
- Install PostgreSQL (recommended version: 14 or 15)
- Set password during installation (remember it!)
- Verify installation:
  ```bash
  psql --version
  ```
- Install pgAdmin 4 (optional, for GUI management)

## 📦 Project Setup

### 3. Copy Project Files
Copy entire `atess-parser` folder to new machine:
```
C:\Solar\atess-parser\
```

### 4. Install Dependencies
```bash
cd C:\Solar\atess-parser
npm install
```

This will install:
- `pg` - PostgreSQL client
- `dotenv` - Environment variables

### 5. Install PM2 Globally
```bash
npm install -g pm2
pm2 --version
```

## 🔧 Database Setup

### 6. Configure PostgreSQL Connection
Edit `.env` file with your PostgreSQL credentials:
```env
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=postgres
PG_USER=postgres
PG_PASSWORD=your_password_here
```

### 7. Create Database Table

#### Using pgAdmin 4:
1. Open pgAdmin 4
2. Connect to PostgreSQL server
3. Open database specified in `.env` (default: `postgres`)
4. Click **Tools** → **Query Tool**
5. Open file: `database/schema.sql`
6. Click **Execute** (F5)

#### Using command line:
```bash
psql -U postgres -d postgres -f database/schema.sql
```

### 8. Test PostgreSQL Connection
```bash
node -e "require('dotenv').config(); const {Pool} = require('pg'); const pool = new Pool({host: process.env.PG_HOST, port: parseInt(process.env.PG_PORT), database: process.env.PG_DATABASE, user: process.env.PG_USER, password: process.env.PG_PASSWORD}); pool.connect().then(() => {console.log('✅ PostgreSQL connection successful'); pool.end();}).catch(err => {console.error('❌ Connection failed:', err.message);});"
```

## 🚀 Start Proxy

### 9. Test Proxy (Manual Mode)
```bash
cd C:\Solar\atess-parser
node src/proxy.js
```

Expected output:
```
✅ Connected to PostgreSQL
🚀 Proxy running on port 1500
📡 Forwarding to 127.0.0.1:1600
```

Press `Ctrl+C` to stop.

### 10. Start Proxy with PM2 (Production Mode)
```bash
cd C:\Solar\atess-parser
pm2 start ecosystem.config.js
```

Verify:
```bash
pm2 list
pm2 logs atess-proxy
```

## ⚙️ Auto-Start Configuration

### 11. Configure Windows Task Scheduler (Optional but Recommended)

1. **Open Task Scheduler**:
   - Press `Win + R`
   - Type `taskschd.msc`
   - Press Enter

2. **Create Basic Task**:
   - Click "Create Basic Task" on the right panel
   - Name: `ATESS Proxy Auto-Start`
   - Description: `Auto-start ATESS proxy on Windows boot`
   - Click Next

3. **Trigger**:
   - Select "When the computer starts"
   - Click Next

4. **Action**:
   - Select "Start a program"
   - Click Next

5. **Program Details**:
   - **Program/script**: `C:\Users\YOUR_USERNAME\AppData\Roaming\npm\pm2.cmd`
   - **Add arguments**: `start C:\Solar\atess-parser\ecosystem.config.js`
   - **Start in**: `C:\Solar\atess-parser`
   - Click Next

6. **Finish**:
   - Review settings
   - Click Finish

### 12. Test Auto-Start
1. Restart computer
2. After restart, check PM2 status:
   ```bash
   pm2 list
   ```
3. Proxy should be running automatically

## 🔍 Verification

### Check Proxy Status
```bash
pm2 list
pm2 status
```

### Check Logs
```bash
pm2 logs atess-proxy
```

### Test Connection
```bash
# Test if proxy is listening on port 1500
netstat -an | findstr 1500
```

### Test with Fake Collector (if available)
```bash
node src/fake-collector.js
```

## 📊 Monitoring

### View Real-time Monitoring
```bash
pm2 monit
```

### View Resource Usage
```bash
pm2 describe atess-proxy
```

### Check Database Records
```sql
-- Using pgAdmin Query Tool
SELECT COUNT(*) FROM raw_data;
SELECT * FROM raw_data ORDER BY timestamp DESC LIMIT 10;
```

## 🔧 Troubleshooting

### Proxy won't start
```bash
pm2 logs atess-proxy
pm2 delete atess-proxy
pm2 start ecosystem.config.js
```

### PostgreSQL connection error
- Check `.env` credentials
- Verify PostgreSQL service is running:
  ```bash
  # Open Services (services.msc)
  # Find "postgresql-x64-14" (or similar)
  # Ensure it's running
  ```
- Test connection manually:
  ```bash
  psql -U postgres -d postgres
  ```

### Port already in use
```bash
# Check what's using port 1500
netstat -ano | findstr :1500
# Kill the process if needed
taskkill /PID <PID> /F
```

### PM2 not found
```bash
# Reinstall PM2 globally
npm uninstall -g pm2
npm install -g pm2
```

### Database table not found
```bash
# Re-run schema
psql -U postgres -d postgres -f database/schema.sql
```

## 📝 Configuration Files

### Key Files to Review
- `.env` - PostgreSQL credentials
- `ecosystem.config.js` - PM2 configuration
- `src/proxy.js` - Proxy server settings
- `database/schema.sql` - Database schema

### Default Configuration
- **Proxy Port**: 1500
- **Target Host**: 127.0.0.1
- **Target Port**: 1600
- **Health Check Interval**: 5 seconds
- **Max Restart Attempts**: 10
- **Restart Delay**: 2 seconds

## 🔒 Security Considerations

### 1. PostgreSQL Security
- Use strong password
- Restrict remote access if not needed
- Regular backups

### 2. Environment Variables
- Never commit `.env` to version control
- Use different passwords for production
- Consider using secrets manager for production

### 3. Network Security
- Configure firewall rules
- Use VPN if remote access needed
- Monitor logs for suspicious activity

## 📦 Backup & Restore

### Backup Database
```bash
pg_dump -U postgres -d postgres > backup.sql
```

### Restore Database
```bash
psql -U postgres -d postgres < backup.sql
```

### Backup PM2 Config
```bash
pm2 save
pm2 dump
```

### Restore PM2 Config
```bash
pm2 resurrect
```

## 🎯 Quick Start Summary

```bash
# 1. Install Node.js and PostgreSQL
# 2. Copy project to C:\Solar\atess-parser\
# 3. Install dependencies
cd C:\Solar\atess-parser
npm install

# 4. Install PM2
npm install -g pm2

# 5. Configure .env with PostgreSQL credentials
# 6. Create database table
psql -U postgres -d postgres -f database/schema.sql

# 7. Start proxy with PM2
pm2 start ecosystem.config.js

# 8. Verify
pm2 list
pm2 logs atess-proxy
```

## 📞 Support

If issues persist:
1. Check logs: `pm2 logs atess-proxy`
2. Verify PostgreSQL connection
3. Check network connectivity
4. Review configuration files
5. Check firewall settings
