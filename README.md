# ATESS Solar Monitoring System

Hệ thống monitoring năng lượng mặt trời ATESS với parse Modbus, TimescaleDB, và Vue Dashboard.

## Cấu trúc

```
atess-parser/
├── proxy/                        # Proxy Server
│   ├── proxy.js                  # Main proxy server
│   ├── src/
│   │   ├── parser.js             # Parse Modbus packets
│   │   └── export_meaningful_fields.js  # Extract meaningful fields
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── web-server/                   # Web Server + Dashboard
│   ├── server.js                 # Node.js server with WebSocket & TimescaleDB
│   ├── public/
│   │   └── index.html            # Vue Dashboard
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── src/                          # Legacy parsing tools (reference)
│   ├── parser.js
│   ├── export_meaningful_fields.js
│   ├── proxy.js
│   └── test.js
└── README.md
```

## Architecture

```
[ ATESS Device ]
        ↓
[ Proxy Server ]
    └── Forward Raw Data
        ├→ Original Web Server (1600) - TCP
        ├→ Second Web Server Collector (3002) - TCP
        └→ Second Web Server Web (3003) - TCP
            ↓
        [ Web Server ]
            ├── Parse Modbus
            ├── Extract Meaningful Fields
            ├── Save to TimescaleDB
            ├── WebSocket Server
            └── HTTP API
                ↓
            [ Vue Dashboard ]
```

## Cài đặt

### 1. Cài đặt TimescaleDB

Xem hướng dẫn trong `web-server/README.md`

### 2. Cài đặt Proxy Server

```bash
cd proxy
npm install
cp .env.example .env
# Edit .env với config của bạn
npm start
```

### 3. Cài đặt Web Server

```bash
cd web-server
npm install
cp .env.example .env
# Edit .env với PostgreSQL credentials
npm start
```

## Chạy hệ thống

```bash
# Terminal 1: Proxy Server
cd proxy
npm start

# Terminal 2: Web Server
cd web-server
npm start
```

## Truy cập Dashboard

Mở browser: http://localhost:3001

## Các thành phần

### Proxy Server (`proxy/`)
- Forward raw hex data từ ATESS device
- Không parse, chỉ gửi raw data đến web server
- Multi-stream: 
  - TCP (Modbus TCP) đến original web server (1600)
  - TCP (Modbus TCP) đến second web server collector port (3002)
  - TCP (Modbus TCP) đến second web server web port (3003)

### Web Server (`web-server/`)
- Nhận raw data từ proxy
- Lưu raw data vào bảng `raw_data` trước khi parse
- Parse Modbus và extract meaningful fields
- Lưu parsed data vào bảng `atess_data`
- WebSocket server cho real-time updates
- Vue Dashboard để hiển thị data

### Legacy Tools (`src/`)
- Các tool parsing cũ để tham khảo
- Không dùng trong production

## API Endpoints

### Web Server (port 3001)

- `POST /api/raw-data` - Nhận raw hex data từ proxy, parse và lưu
- `POST /api/data` (legacy) - Nhận parsed data từ proxy
- `GET /api/data` - Lấy data mới nhất
- `GET /api/history?hours=24` - Lấy data lịch sử

### TCP Servers

- Port 3002 - Nhận raw Modbus TCP data từ collector
- Port 3003 - Nhận raw Modbus TCP data từ web server

## Troubleshooting

Xem README chi tiết trong từng folder:
- `proxy/README.md` - Troubleshooting proxy
- `web-server/README.md` - Troubleshooting web server
