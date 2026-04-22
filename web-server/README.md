# ATESS Solar Monitoring Web Server

Node.js server với WebSocket và TimescaleDB để monitoring hệ thống năng lượng mặt trời ATESS.

## Cấu trúc

```
[ Node.js Server ]
     ├── Parse Modbus
     ├── Save DB (TimescaleDB)
     └── WebSocket server
              ↓
        [ Vue Dashboard ]
```

## Cài đặt

### 1. Cài đặt TimescaleDB

TimescaleDB là extension của PostgreSQL cho time-series data.

**Windows:**
- Tải PostgreSQL từ: https://www.postgresql.org/download/windows/
- Sau khi cài đặt PostgreSQL, cài TimescaleDB extension:
  ```bash
  # Trong PostgreSQL bin directory
  psql -U postgres -d postgres -c "CREATE EXTENSION IF NOT EXISTS timescaledb;"
  ```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install postgresql-timescaledb

# CentOS/RHEL
sudo yum install timescaledb
```

### 2. Cài đặt Dependencies

```bash
cd web-server
npm install
```

### 3. Cấu hình Environment Variables

Tạo file `.env` trong folder `web-server`:

```env
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=postgres
PG_USER=postgres
PG_PASSWORD=your_password
```

## Chạy Server

```bash
cd web-server
npm start
```

Server sẽ chạy trên:
- HTTP API: http://localhost:3001
- WebSocket: ws://localhost:3001
- Dashboard: http://localhost:3001
- TCP Collector Server: port 3002
- TCP Web Server: port 3003

## API Endpoints

### POST /api/raw-data
Nhận raw hex data từ proxy, parse và lưu vào TimescaleDB

**Body:**
```json
{
  "source": "COLLECTOR",
  "data": "00010007...",
  "timestamp": "2026-04-11T10:03:27"
}
```

### POST /api/data (legacy)
Nhận parsed data từ proxy và lưu vào TimescaleDB

**Body:**
```json
{
  "pv": { "daily": 0, "total": 0, "dailyUnit": "kWh", "totalUnit": "MWh" },
  "load": { "daily": 0, "total": 0, "dailyUnit": "kWh", "totalUnit": "kWh" },
  "battery": { "charge": 0, "discharge": 0, "unit": "kWh" },
  "grid": { "import": { "daily": 0, "total": 0 }, "export": { "daily": 0, "total": 0 } },
  "gen": { "daily": 0, "total": 0 },
  "timestamp": "2026-04-11T10:03:27",
  "device": { "loggerSN": "KYH0F4201B", "deviceSN": "EXH0F4303F" }
}
```

### GET /api/data
Lấy data mới nhất

### GET /api/history?hours=24
Lấy data lịch sử từ TimescaleDB

## TCP Servers

### TCP Collector Server (port 3002)
Nhận raw Modbus TCP data từ collector qua proxy. Tự động parse và lưu vào TimescaleDB.

### TCP Web Server (port 3003)
Nhận raw Modbus TCP data từ web server qua proxy. Tự động parse và lưu vào TimescaleDB.

## Database Schema

### Table `raw_data` - Raw data trước khi parse
- id (SERIAL) - Primary key
- source (TEXT) - Loại data: 'COLLECTOR' hoặc 'WEB_SERVER'
- timestamp (TIMESTAMPTZ) - Thời gian nhận
- data_length (INTEGER) - Độ dài data (bytes)
- data (TEXT) - Raw hex data

### Table `atess_data` - Parsed data
- time (TIMESTAMPTZ) - Thời gian
- logger_sn (TEXT) - Logger Serial Number
- device_sn (TEXT) - Device Serial Number
- pv_daily, pv_total (REAL) - PV energy
- load_daily, load_total (REAL) - Load energy
- battery_charge, battery_discharge (REAL) - Battery energy
- grid_import_daily, grid_import_total (REAL) - Grid import
- grid_export_daily, grid_export_total (REAL) - Grid export
- gen_daily, gen_total (REAL) - Generator energy

## Vue Dashboard

Dashboard sử dụng Vue.js 3 và WebSocket để hiển thị real-time data:

- **PV Generated:** Energy sản xuất từ tấm pin mặt trời
- **Load Consumption:** Energy tiêu thụ bởi tải
- **Battery:** Energy sạc/xả của battery
- **Grid:** Energy nhập/xuất từ lưới điện
- **GEN Energy:** Energy từ generator

## Proxy Integration

Proxy (`proxy/proxy.js`) sẽ:
1. Forward raw hex data từ ATESS device
2. Gửi raw data lên web server (port 3001) qua `/api/raw-data`
3. Web server parse raw data thành meaningful fields
4. Web server lưu vào TimescaleDB và broadcast qua WebSocket

## Troubleshooting

### TimescaleDB không hoạt động
- Kiểm tra PostgreSQL đang chạy
- Kiểm tra TimescaleDB extension đã được cài:
  ```bash
  psql -U postgres -d postgres -c "SELECT extversion FROM pg_extension WHERE extname = 'timescaledb';"
  ```

### WebSocket không kết nối
- Kiểm tra web server đang chạy
- Kiểm tra firewall không block port 3001

### Data không lưu vào database
- Kiểm tra connection string trong `.env`
- Kiểm tra PostgreSQL credentials
- Xem log server để biết lỗi cụ thể
