# PM2 Windows Setup Guide for ATESS Proxy

## ✅ Current Status
Proxy đã chạy với PM2 - sẽ **tiếp tục chạy ngay cả khi terminal đóng**.

## 📋 PM2 Commands

### View running processes
```bash
pm2 list
pm2 status
```

### View logs
```bash
pm2 logs atess-proxy
pm2 logs --lines 100
```

### Monitor real-time
```bash
pm2 monit
```

### Restart proxy
```bash
pm2 restart atess-proxy
pm2 reload atess-proxy
```

### Stop proxy
```bash
pm2 stop atess-proxy
```

### Delete from PM2
```bash
pm2 delete atess-proxy
```

### Start again
```bash
pm2 start ecosystem.config.js
```

### Save current process list
```bash
pm2 save
```

## 🚀 Auto-Start on Windows Boot Options

### Option 1: Windows Task Scheduler (Recommended)

1. **Mở Task Scheduler**:
   - Nhấn `Win + R`, gõ `taskschd.msc`, Enter

2. **Create Basic Task**:
   - Click "Create Basic Task" ở bên phải
   - Name: `ATESS Proxy Auto-Start`
   - Description: `Auto-start ATESS proxy on Windows boot`

3. **Trigger**:
   - Select "When the computer starts"
   - Click Next

4. **Action**:
   - Select "Start a program"
   - Click Next

5. **Program/Script**:
   - Program: `C:\Users\Admin\AppData\Roaming\npm\pm2.cmd`
   - Add arguments: `start ecosystem.config.js`
   - Start in: `D:\Solar\atess-parser`
   - Click Next

6. **Finish**:
   - Review và click Finish

### Option 2: Windows Service (node-windows)

```bash
npm install -g node-windows
```

Create `install-service.js`:
```javascript
const Service = require('node-windows').Service;

const svc = new Service({
  name: 'ATESSProxy',
  description: 'ATESS Proxy Server',
  script: 'D:\\Solar\\atess-parser\\src\\proxy.js',
  nodeOptions: ['--harmony', '--max_old_space_size=4096']
});

svc.on('install', () => {
  svc.start();
});

svc.install();
```

Run:
```bash
node install-service.js
```

### Option 3: Batch File in Startup Folder

1. Create `start-proxy.bat`:
```batch
@echo off
cd /d D:\Solar\atess-parser
pm2 start ecosystem.config.js
```

2. Copy to startup folder:
   - `Win + R`, gõ `shell:startup`, Enter
   - Copy `start-proxy.bat` vào folder đó

### Option 4: PM2-Windows (Alternative)

```bash
npm install -g pm2-windows-startup
pm2-startup install
```

## 📊 Monitoring

### Check proxy status
```bash
pm2 status
pm2 describe atess-proxy
```

### View resource usage
```bash
pm2 monit
```

### Check logs for errors
```bash
pm2 logs atess-proxy --err
```

## 🔧 Troubleshooting

### Proxy not running
```bash
pm2 list
pm2 start ecosystem.config.js
```

### Check PostgreSQL connection
```bash
pm2 logs atess-proxy | grep "PostgreSQL"
```

### Restart if stuck
```bash
pm2 restart atess-proxy
```

### Reset PM2 (last resort)
```bash
pm2 delete all
pm2 kill
pm2 start ecosystem.config.js
```

## 📝 Log Files

Logs được lưu trong `D:\Solar\atess-parser\logs\`:
- `out.log` - Standard output
- `err.log` - Error output
- `combined.log` - Combined logs

## ✅ Verification

### Test terminal close
1. Mở terminal mới
2. Chạy `pm2 list` - proxy vẫn đang chạy
3. Đóng terminal cũ
4. Mở terminal mới
5. Chạy `pm2 list` - proxy vẫn đang chạy ✓

### Test auto-restart
1. Kill proxy process: `pm2 stop atess-proxy`
2. PM2 sẽ tự restart trong 2 giây
3. Chạy `pm2 list` - proxy đang chạy ✓

## 🎯 Best Practices

1. **Luôn dùng PM2** thay vì chạy trực tiếp với `node`
2. **Save PM2 config**: `pm2 save` sau khi thay đổi
3. **Monitor logs thường xuyên**: `pm2 logs`
4. **Test restart**: `pm2 restart` trước khi production
5. **Backup ecosystem.config.js**
