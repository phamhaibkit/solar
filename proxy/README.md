🎯 1. Các CARD (kWh – theo ngày)
☀️ PV
PV: 0.0 kWh

👉 Generated energy of PV

✅ Reg 62 → PV daily power generation (0.1 kWh)
🔌 Load
Load: 0.6 kWh

👉 Consumption of load

✅ Reg 82 → Daily power consumption of load (0.1 kWh)
🔋 Battery
BAT: 646.4 / 383.1 kWh

👉 Charge / Discharge

✅ Reg 26 → Battery daily charge (0.1 kWh)
✅ Reg 24 → Battery daily discharge (0.1 kWh)
⚡ Grid
Grid: 676.2 / 365.0 kWh

👉 Import / Export

✅ Reg 88 → Daily power intake from grid (0.1 kWh)
✅ Reg 94 → Daily power fed to grid (0.1 kWh)
🟡 GEN (DG)
GEN: 0.0 kWh

👉 Energy of import from GEN

✅ Reg 222 → Daily power intake from DG (0.1 kWh)
🎯 2. Các GIÁ TRỊ TRONG CHART (kW – realtime)

Tooltip bạn đưa:

PV: 0.0 kW
Load: 0.0 kW
Charge: 0.8 kW
Discharge: 0.0 kW
Import from grid: 1.8 kW
Export to grid: 0.0 kW
GEN: 0.0 kW
SOC: 99%
☀️ PV power
✅ Reg 51 → PV1 power (0.1 kW)
hoặc:
✅ Reg 108 → PV total power (nếu có nhiều MPPT)
🔌 Load power
✅ Reg 49 → Load active power (0.1 kW)
🔋 Battery charge / discharge
✅ Reg 17 → Battery power (0.1 kW)

👉 Quy ước:

0 → discharge

< 0 → charge
⚡ Grid power

👉 không có 1 thanh ghi riêng “import/export” realtime

Bạn phải dùng:

✅ Reg 19 → Bypass active power (0.1 kW)

👉 rồi suy ra:

0 → import từ grid

< 0 → export ra grid
🟡 GEN power
✅ Reg 220 → DG active power (0.1 kW)
🔋 SOC
✅ Reg 47 → Battery percentage (%)
🔥 Mapping tổng hợp (rất quan trọng)
CARD (kWh – daily)
PV → 62
Load → 82
Battery charge → 26
Battery discharge → 24
Grid import → 88
Grid export → 94
GEN → 222
CHART (kW – realtime)
PV → 51 / 108
Load → 49
Battery → 17
Grid → 19
GEN → 220
SOC → 47
⚠️ 3. Lưu ý cực quan trọng khi bạn parse
⚡ Scale:
kW → chia 10
kWh → chia 10
⚡ Dấu (+/-):
Giá trị	Ý nghĩa
Battery power	+ xả / - sạc
Grid power	+ import / - export
⚡ Không có register “export riêng realtime”

👉 UI tự tách từ 1 giá trị duy nhất