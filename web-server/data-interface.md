# ATESS Data Parsing Interface Specification

## Overview
Module parse dữ liệu từ raw data thành structured data cho backend lưu vào database.

## Data Flow
```
Raw TCP Data → Parser → Structured Data → Database
```

### Output Format
```javascript
{
  timestamp: "2024-01-01T12:00:00Z",
  device: {
    loggerSN: "LOGGER123456",
    deviceSN: "DEVICE789012"
  },
  // CARD values (kWh - daily energy)
  pv: {
    daily: 15.5,        // kWh
    dailyUnit: 'kWh',
    label: 'Generated energy of PV'
  },
  load: {
    daily: 12.3,        // kWh
    dailyUnit: 'kWh',
    label: 'Consumption of load'
  },
  battery: {
    charge: 5.2,        // kWh
    discharge: 3.8,     // kWh
    unit: 'kWh',
    label: 'Battery charge/discharge'
  },
  grid: {
    import: {
      daily: 8.1,      // kWh
    },
    export: {
      daily: 2.5,      // kWh
    },
    dailyUnit: 'kWh',
    label: 'Import from grid / Export to grid'
  },
  gen: {
    daily: 0.0,         // kWh
    dailyUnit: 'kWh',
    label: 'Energy of import from GEN'
  },
  // CHART values (kW - realtime power)
  realtime: {
    pv: 2.5,           // kW
    load: 1.8,         // kW
    batteryCharge: 0.8, // kW
    batteryDischarge: 0.0, // kW
    gridImport: 1.8,   // kW
    gridExport: 0.0,   // kW
    gen: 0.0,          // kW
    soc: 85.0,         // %
    unit: 'kW',
    socUnit: '%'
  },
  // SYSTEM DIAGRAM (flow năng lượng)
  systemFlow: {
    grid: 1.8,         // kW (abs value)
    battery: 0.8,      // kW (abs value)
    pv: 2.5,           // kW (direct)
    soc: 85.0,         // % (direct)
    unit: 'kW',
    socUnit: '%'
  }
}
```

## Database Schema

### 1. Raw Data Table (`raw_data`)
```sql
CREATE TABLE raw_data (
  id SERIAL PRIMARY KEY,
  function_code TEXT,           -- Function code (0x16, 0x24, 0x18, 0x19)
  source TEXT NOT NULL,         -- Source identifier (COLLECTOR, WEBSERVER)
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data_length INTEGER NOT NULL, -- Length of raw data in bytes
  data TEXT NOT NULL            -- Raw hex data
);
```

### 2. Daily Energy Table (`atess_daily_energy`) - CARD data
```sql
CREATE TABLE atess_daily_energy (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  logger_sn TEXT NOT NULL,
  device_sn TEXT NOT NULL,
  pv_daily REAL NOT NULL DEFAULT 0,           -- kWh (Reg 62)
  load_daily REAL NOT NULL DEFAULT 0,         -- kWh (Reg 82)
  battery_charge REAL NOT NULL DEFAULT 0,      -- kWh (Reg 26)
  battery_discharge REAL NOT NULL DEFAULT 0,   -- kWh (Reg 24)
  grid_import_daily REAL NOT NULL DEFAULT 0,   -- kWh (Reg 88)
  grid_export_daily REAL NOT NULL DEFAULT 0,   -- kWh (Reg 94)
  gen_daily REAL NOT NULL DEFAULT 0,          -- kWh (Reg 222)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3. Realtime Power Table (`atess_realtime_power`) - CHART data
```sql
CREATE TABLE atess_realtime_power (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  logger_sn TEXT NOT NULL,
  device_sn TEXT NOT NULL,
  pv_power REAL NOT NULL DEFAULT 0,           -- kW (Reg 51/108)
  load_power REAL NOT NULL DEFAULT 0,         -- kW (Reg 49)
  battery_power REAL NOT NULL DEFAULT 0,      -- kW (Reg 17, signed)
  grid_power REAL NOT NULL DEFAULT 0,          -- kW (Reg 19, signed)
  gen_power REAL NOT NULL DEFAULT 0,           -- kW (Reg 220)
  soc REAL NOT NULL DEFAULT 0,                -- % (Reg 47)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 4. System Flow Table (`atess_system_flow`) - SYSTEM DIAGRAM data
```sql
CREATE TABLE atess_system_flow (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  logger_sn TEXT NOT NULL,
  device_sn TEXT NOT NULL,
  grid_flow REAL NOT NULL DEFAULT 0,          -- kW (abs of Reg 19)
  battery_flow REAL NOT NULL DEFAULT 0,       -- kW (abs of Reg 17)
  pv_flow REAL NOT NULL DEFAULT 0,            -- kW (Reg 51/108)
  soc REAL NOT NULL DEFAULT 0,                -- % (Reg 47)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Register Mapping

### 🎯 CARD (kWh – daily energy)
| UI | Ý nghĩa | Register | Scale | Đặc điểm |
|---|---|---|---|---|
| PV | Generated energy of PV | 62 | 0.1 | Reset mỗi ngày |
| Load | Consumption of load | 82 | 0.1 | Reset mỗi ngày |
| Battery charge | Battery charge | 26 | 0.1 | Reset mỗi ngày |
| Battery discharge | Battery discharge | 24 | 0.1 | Reset mỗi ngày |
| Grid import | Import from grid | 88 | 0.1 | Reset mỗi ngày |
| Grid export | Export to grid | 94 | 0.1 | Reset mỗi ngày |
| GEN | Energy of import from GEN | 222 | 0.1 | Reset mỗi ngày |

### 🎯 CHART (kW – realtime power)
| UI | Ý nghĩa | Register | Scale | Quy ước dấu |
|---|---|---|---|---|
| PV | PV power | 51 hoặc 108 | 0.1 | - |
| Load | Load active power | 49 | 0.1 | - |
| Battery | Battery power | 17 | 0.1 | >0 → discharge, <0 → charge |
| Grid | Grid power (bypass) | 19 | 0.1 | >0 → import, <0 → export |
| GEN | DG power | 220 | 0.1 | - |
| SOC | Battery SOC | 47 | 1 | - |

### 🎯 SYSTEM DIAGRAM (flow năng lượng)
| UI | Lấy từ | Cách hiển thị |
|---|---|---|
| Grid kW | 19 | abs(reg19)/10 |
| Battery kW | 17 | abs(reg17)/10 |
| PV kW | 51 / 108 | trực tiếp |
| SOC | 47 | trực tiếp |
