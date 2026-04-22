# ATESS Proxy Server

Proxy server để forward raw data từ ATESS device đến web server.

## Cấu trúc

```
proxy/
├── proxy.js                      # Main proxy server
├── package.json
├── .env.example
└── README.md
```

## Cài đặt

```bash
cd proxy
npm install
```

## Cấu hình

Tạo file `.env` trong folder `proxy`:

```env
# Proxy Configuration
PROXY_PORT=1500
TARGET_HOST=127.0.0.1
TARGET_PORT=1600
SECOND_WEB_SERVER_HOST=127.0.0.1
SECOND_WEB_SERVER_COLLECTOR_PORT=3002
SECOND_WEB_SERVER_WEB_PORT=3003
```

## Chạy

```bash
npm start
```

## Chức năng

1. **Forward Raw Data:** Chỉ forward raw hex data từ ATESS device
2. **Multi-stream:** Gửi data đến:
   - Original web server (port 1600) - TCP (Modbus TCP)
   - Second web server Collector data (port 3002) - TCP (Modbus TCP)
   - Second web server Web data (port 3003) - TCP (Modbus TCP)

## Data Flow

```
ATESS Device → Proxy (forward raw data) → Web Server (parse) → TimescaleDB + WebSocket → Vue Dashboard
```

## Troubleshooting

### Proxy không kết nối được đến collector
- Kiểm tra TARGET_HOST và TARGET_PORT trong config
- Đảm bảo collector đang chạy

### Data không gửi được đến web server
- Kiểm tra WEB_SERVER_HOST và WEB_SERVER_PORT
- Đảm bảo web server đang chạy
- Xem log console để biết lỗi cụ thể
