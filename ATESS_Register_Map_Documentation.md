# ATESS Energy Storage System Register Map Documentation

## Overview
This document provides a comprehensive mapping of Modbus registers for the ATESS Energy Storage System (Device: EXH0F4303F) using the ATESS Data Service Protocol 1.1 (Modbus TCP Function Code 0x24).

**Device Information:**
- **Logger SN:** KYH0F4201B
- **Device SN:** EXH0F4303F
- **Protocol:** ATESS Data Service Protocol 1.1
- **Function Code:** 0x24 (Input Register Values)
- **Encryption Key:** "Growatt"

---

## Register Categories

### 1. System Identification (Registers 0-3)

| Reg | Name | Type | Unit | Range | Description |
|-----|------|------|------|-------|-------------|
| 0 | System Status Flag | uint16 | status | 0-65535 | System operational status and flags |
| 1 | Device Type ID | uint16 | ID | 0-65535 | ATESS device model identifier (6979 = EXH0F4303F) |
| 2 | Reserved | uint16 | N/A | 0 | Reserved register (always 0) |
| 3 | Reserved | uint16 | N/A | 0 | Reserved register (always 0) |

### 2. Grid Measurements (Registers 4-6)

| Reg | Name | Type | Unit | Range | Description |
|-----|------|------|------|-------|-------------|
| 4 | Grid Voltage Phase 1 | uint16 | V | 0-5000 | Three-phase grid voltage L1-N (~400V × 10 scaling) |
| 5 | Grid Voltage Phase 2 | uint16 | V | 0-5000 | Three-phase grid voltage L2-N (~400V × 10 scaling) |
| 6 | Grid Voltage Phase 3 | uint16 | V | 0-5000 | Three-phase grid voltage L3-N (~400V × 10 scaling) |

### 3. Temperature Sensors (Registers 7-12)

| Reg | Name | Type | Unit | Range | Description |
|-----|------|------|------|-------|-------------|
| 7 | Temperature Sensor 1 | uint16 | °C | 0-100 | Inverter/transformer temperature |
| 8 | Temperature Sensor 2 | uint16 | °C | 0-100 | Inverter/transformer temperature |
| 9 | Temperature Sensor 3 | uint16 | °C | 0-100 | Inverter/transformer temperature |
| 10 | Temperature Sensor 4 | uint16 | °C | 0-100 | Battery/ambient temperature |
| 11 | Temperature Sensor 5 | uint16 | °C | 0-100 | Battery/ambient temperature |
| 12 | Temperature Sensor 6 | uint16 | °C | 0-100 | Ambient/auxiliary temperature |

### 4. DC Voltages (Registers 13-16)

| Reg | Name | Type | Unit | Range | Description |
|-----|------|------|------|-------|-------------|
| 13 | DC Voltage 1 | uint16 | V | 0-5000 | DC bus voltage phase 1 |
| 14 | DC Voltage 2 | uint16 | V | 0-5000 | DC bus voltage phase 2 |
| 15 | DC Voltage 3 | uint16 | V | 0-5000 | DC bus voltage phase 3 |
| 16 | DC Voltage 4 | uint16 | V | 0-6000 | Battery DC voltage (high voltage system) |

### 5. Power Measurements (Registers 17-21)

| Reg | Name | Type | Unit | Range | Description |
|-----|------|------|------|-------|-------------|
| 17 | Power Measurement 1 | int16 | W | -32768 to 32767 | System power measurement 1 (signed) |
| 18 | Power Measurement 2 | int16 | W | -32768 to 32767 | System power measurement 2 (signed) |
| 19 | Power Measurement 3 | int16 | W | -32768 to 32767 | System power measurement 3 (signed, 65534 = -2W) |
| 20 | Power Measurement 4 | int16 | W | -32768 to 32767 | System power measurement 4 (signed, 65501 = -35W) |
| 21 | Power Measurement 5 | int16 | W | -32768 to 32767 | Battery/system power |

### 6. Current Measurements (Registers 22-24)

| Reg | Name | Type | Unit | Range | Description |
|-----|------|------|------|-------|-------------|
| 22 | Current Measurement 1 | int16 | A | -32768 to 32767 | Phase current or DC current |
| 23 | Current Measurement 2 | int16 | A | -32768 to 32767 | Phase current or DC current |
| 24 | Current Measurement 3 | int16 | A | -32768 to 32767 | Phase current or DC current |

### 7. PV Power Generation (Registers 25-27)

| Reg | Name | Type | Unit | Range | Description |
|-----|------|------|------|-------|-------------|
| 25 | PV Power Phase 1 | uint16 | W | 0-10000 | Solar PV power generation phase 1 |
| 26 | PV Power Phase 2 | uint16 | W | 0-10000 | Solar PV power generation phase 2 |
| 27 | PV Power Phase 3 | uint16 | W | 0-10000 | Solar PV power generation phase 3 |

### 8. Load Power (Registers 28-32)

| Reg | Name | Type | Unit | Range | Description |
|-----|------|------|------|-------|-------------|
| 28 | Load Power Phase 1 | uint16 | W | 0-10000 | Load consumption phase 1 |
| 29 | Load Power Phase 2 | uint16 | W | 0-10000 | Load consumption phase 2 |
| 30 | Load Power Phase 3 | uint16 | W | 0-10000 | Load consumption phase 3 |
| 31 | Load Power Phase 4 | uint16 | W | 0-10000 | Additional load measurement |
| 32 | Load Power Phase 5 | uint16 | W | 0-10000 | Additional load measurement |

### 9. Battery System (Registers 46-51)

| Reg | Name | Type | Unit | Range | Description |
|-----|------|------|------|-------|-------------|
| 46 | Battery Voltage | uint16 | V | 0-4000 | Battery pack voltage (high voltage system) |
| 47 | Battery Current | int16 | A | -32768 to 32767 | Battery charge/discharge current (positive = charging) |
| 48 | Battery SOC | uint16 | % | 0-100 | State of Charge percentage |
| 49 | Battery Temperature | int16 | °C | -40 to 85 | Battery pack temperature (0 = sensor error) |
| 50 | Battery Health | uint16 | % | 0-100 | State of Health (SOH) percentage |
| 51 | Battery Cycles | uint16 | cycles | 0-65535 | Number of charge/discharge cycles |

### 10. System Status (Registers 52-55)

| Reg | Name | Type | Unit | Range | Description |
|-----|------|------|------|-------|-------------|
| 52 | Operating Mode | uint16 | mode | 0-65535 | System operating mode (34 = normal operation) |
| 53 | System Status | uint16 | status | 0-65535 | System status flags (16 = running) |
| 54 | Fault Code | uint16 | code | 0-65535 | System fault code (17 = fault detected) |
| 55 | Warning Code | uint16 | code | 0-65535 | System warning code (23 = warning active) |

### 11. Energy Counters (Registers 56-59)

| Reg | Name | Type | Unit | Range | Description |
|-----|------|------|------|-------|-------------|
| 56 | Energy Imported | uint16 | kWh | 0-65535 | Total energy imported from grid |
| 57 | Energy Exported | uint16 | kWh | 0-65535 | Total energy exported to grid |
| 58 | Energy Consumed | uint16 | kWh | 0-65535 | Total energy consumed by load |
| 59 | Energy Generated | uint16 | kWh | 0-65535 | Total energy generated by PV |

### 12. Grid Interaction (Registers 68-75)

| Reg | Name | Type | Unit | Range | Description |
|-----|------|------|------|-------|-------------|
| 68 | Grid Power Factor | uint16 | factor | 0-1000 | Grid power factor (5 = 0.5 power factor) |
| 69 | Grid Frequency | uint16 | Hz*1000 | 45000-65000 | Grid frequency (60201 = 60.201Hz) |
| 70 | Grid Import Power | int16 | W | -32768 to 32767 | Power imported from grid (0 = no import) |
| 71 | Grid Export Power | uint16 | W | 0-65535 | Power exported to grid (7595W export) |

### 13. Battery Power (Registers 81-84)

| Reg | Name | Type | Unit | Range | Description |
|-----|------|------|------|-------|-------------|
| 81 | Battery Power | int16 | W | -32768 to 32767 | Battery charge/discharge power (positive = charging) |
| 82 | Battery Efficiency | uint16 | % | 0-100 | Battery system efficiency (3% = possible error) |
| 83 | Battery Charge Power | uint16 | W | 0-65535 | Battery charging power (6071W charging) |
| 84 | Battery Discharge Power | uint16 | W | 0-65535 | Battery discharging power (0 = not discharging) |

### 14. Inverter Status (Registers 85-89)

| Reg | Name | Type | Unit | Range | Description |
|-----|------|------|------|-------|-------------|
| 85 | Inverter Frequency | uint16 | Hz*10 | 450-650 | Inverter output frequency (606 = 60.6Hz) |
| 86 | Inverter Status | uint16 | status | 0-65535 | Inverter status flags (0 = normal) |
| 87 | Inverter Power | uint16 | W | 0-20000 | Inverter output power (15230W output) |
| 88 | Inverter Voltage | uint16 | V | 0-5000 | Inverter output voltage (1836V output) |
| 89 | Inverter Current | uint16 | A | 0-5000 | Inverter output current (3192A output) |

### 15. State Vectors (Registers 537-539)

| Reg | Name | Type | Unit | Range | Description |
|-----|------|------|------|-------|-------------|
| 537 | State Vector Phase 1 | uint16 | vector | 0-65535 | System state vector phase 1 (used for energy flow) |
| 538 | State Vector Phase 2 | uint16 | vector | 0-65535 | System state vector phase 2 (used for energy flow) |
| 539 | State Vector Phase 3 | uint16 | vector | 0-65535 | System state vector phase 3 (used for energy flow) |

### 16. System Mode (Register 549)

| Reg | Name | Type | Unit | Range | Description |
|-----|------|------|------|-------|-------------|
| 549 | System Operating Mode | uint16 | mode | 0-65535 | Main system mode (>20000 = CHARGE, <20000 = DISCHARGE) |

### 17. Battery Cell Voltages (Registers 630-640)

| Reg | Name | Type | Unit | Range | Description |
|-----|------|------|------|-------|-------------|
| 630 | Cell Voltage 1 | uint16 | mV | 2000-4500 | Battery cell 1 voltage (21331mV = 21.33V) |
| 631 | Cell Voltage 2 | uint16 | mV | 2000-4500 | Battery cell 2 voltage (17232mV = 17.23V) |
| 632 | Cell Voltage 3 | uint16 | mV | 2000-4500 | Battery cell 3 voltage (24392mV = 24.39V) |
| 633 | Cell Voltage 4 | uint16 | mV | 2000-4500 | Battery cell 4 voltage (22367mV = 22.37V) |
| 634 | Cell Voltage 5 | uint16 | mV | 2000-4500 | Battery cell 5 voltage (22065mV = 22.07V) |
| 635 | Cell Voltage 6 | uint16 | mV | 2000-4500 | Battery cell 6 voltage (11825mV = 11.82V) |
| 636 | Cell Voltage 7 | uint16 | mV | 2000-4500 | Battery cell 7 voltage (11825mV = 11.82V) |
| 637 | Cell Voltage 8 | uint16 | mV | 2000-4500 | Battery cell 8 voltage (8224mV = 8.22V) |
| 638 | Cell Voltage 9 | uint16 | mV | 2000-4500 | Battery cell 9 voltage (8224mV = 8.22V) |
| 639 | Cell Voltage 10 | uint16 | mV | 2000-4500 | Battery cell 10 voltage (8224mV = 8.22V) |
| 640 | Cell Voltage 11 | uint16 | mV | 2000-4500 | Battery cell 11 voltage (18512mV = 18.51V) |

---

## Key Findings from Data Analysis

### System State Changes (10:03:27 -> 10:13:28)
1. **Mode Switch:** System changed from CHARGE mode (35505) to DISCHARGE mode (7330)
2. **Battery Voltage:** Increased from 3355V to 3356V during charging
3. **Grid Voltage:** Experienced spike at 10:08:27 then normalized
4. **Load Power:** Decreased by 10W at 10:13:28
5. **Energy Counters:** Continuously increasing (normal operation)

### Critical System Issues
- **Fault Code 17:** Active fault detected
- **Warning Code 23:** Multiple warnings active
- **Battery SOC 13%:** Critically low battery level
- **Battery Health 13%:** Poor battery health (degraded)
- **Battery Temperature 0°C:** Sensor error or disconnected

### Power Flow Analysis
- **PV Generation:** 7.62kW total (stable across all samples)
- **Load Consumption:** 1.21kW average
- **Grid Export:** 7.59kW (excess power exported)
- **Battery Charging:** 6.07kW (during charge mode)

---

## Data Scaling Factors

| Measurement Type | Scaling Factor | Example |
|------------------|---------------|---------|
| Grid Voltage | ×0.1 | 3997 = 399.7V |
| Grid Frequency | ×0.001 | 60201 = 60.201Hz |
| Inverter Frequency | ×0.1 | 606 = 60.6Hz |
| Battery Cell Voltage | ×0.001 | 21331 = 21.331V |
| Power Factor | ×0.001 | 5 = 0.005 (possibly ×0.1) |

---

## Usage Notes

1. **Signed Values:** Registers 17-21, 22-24, 47, 49, 70, 81 use signed 16-bit integers
2. **Negative Values:** Values > 32767 should be interpreted as negative (value - 65536)
3. **Mode Interpretation:** Register 549 > 20000 = CHARGE mode, < 20000 = DISCHARGE mode
4. **Temperature Sensor 0°C:** Indicates sensor error or disconnection
5. **Energy Counters:** Cumulative values that reset only when system is reset

---

## Generated Files

This documentation was generated from the following analysis files:
- `parse1.txt` - Raw parsed data (10:03:27)
- `parse2.txt` - Raw parsed data (10:08:27)  
- `parse3.txt` - Raw parsed data (10:13:28)
- `register_comparison.js` - Comparative analysis
- `comprehensive_register_map.js` - Detailed register mapping

---

*Documentation generated on 2026-04-18 for ATESS Energy Storage System EXH0F4303F*
