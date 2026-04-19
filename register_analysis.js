// Phân tích chi tiết các register values từ ATESS Data Service Protocol
// Dựa trên dữ liệu thực tế từ parse1.txt

const registerMap = {
    // === BASIC SYSTEM INFO ===
    0: 152,      // System status/flag
    1: 6979,     // Device type ID
    2: 0,        // Reserved
    3: 0,        // Reserved
    
    // === GRID MEASUREMENTS (3-phase) ===
    4: 3997,     // Grid voltage phase 1 (V)
    5: 3991,     // Grid voltage phase 2 (V) 
    6: 3986,     // Grid voltage phase 3 (V)
    
    // === TEMPERATURE SENSORS ===
    7: 50,       // Temperature sensor 1 (°C)
    8: 56,       // Temperature sensor 2 (°C)
    9: 49,       // Temperature sensor 3 (°C)
    10: 61,      // Temperature sensor 4 (°C)
    11: 76,      // Temperature sensor 5 (°C)
    12: 3,       // Temperature sensor 6 (°C)
    
    // === DC VOLTAGES ===
    13: 3994,    // DC voltage 1 (V)
    14: 3991,    // DC voltage 2 (V)
    15: 3968,    // DC voltage 3 (V)
    16: 5002,    // DC voltage 4 (V)
    
    // === POWER MEASUREMENTS ===
    17: 0,       // Power measurement 1
    18: 36,      // Power measurement 2
    19: 65534,   // Power measurement 3 (signed negative?)
    20: 65501,   // Power measurement 4 (signed negative?)
    21: 5002,    // Power measurement 5
    
    // === CURRENT MEASUREMENTS ===
    22: 0,       // Current measurement 1
    23: 102,     // Current measurement 2 (A)
    24: 75,      // Current measurement 3 (A)
    
    // === PV POWER GENERATION (3-phase) ===
    25: 2290,    // PV power phase 1 (W)
    26: 1748,    // PV power phase 2 (W)
    27: 3580,    // PV power phase 3 (W)
    
    // === LOAD POWER (3-phase) ===
    30: 320,     // Load power phase 1 (W)
    31: 370,     // Load power phase 2 (W)
    32: 520,     // Load power phase 3 (W)
    
    // === BATTERY SYSTEM ===
    46: 3355,    // Battery voltage (V)
    47: 99,      // Battery current (A)
    48: 13,      // Battery SOC (%)
    49: 0,       // Battery temperature (°C)
    50: 13,      // Battery health (%)
    51: 0,       // Battery cycles
    
    // === SYSTEM MODE & STATUS ===
    52: 34,      // Operating mode
    53: 16,      // System status
    54: 17,      // Fault code
    55: 23,      // Warning code
    
    // === ENERGY COUNTERS ===
    56: 2294,    // Energy imported (kWh)
    57: 2325,    // Energy exported (kWh)
    58: 2296,    // Energy consumed (kWh)
    59: 220,     // Energy generated (kWh)
    
    // === GRID POWER FLOW ===
    68: 5,       // Grid power factor
    69: 60201,   // Grid frequency (Hz * 1000?)
    70: 0,       // Grid power import (W)
    71: 7595,    // Grid power export (W)
    
    // === BATTERY POWER ===
    81: 5002,    // Battery power (W)
    82: 3,       // Battery efficiency (%)
    83: 6071,    // Battery charge power (W)
    84: 0,       // Battery discharge power (W)
    
    // === SOLAR INVERTER ===
    85: 606,     // Inverter frequency (Hz * 10?)
    86: 0,       // Inverter status
    87: 15230,   // Inverter power (W)
    88: 1836,    // Inverter voltage (V)
    89: 3192,    // Inverter current (A)
    
    // === BATTERY MANAGEMENT SYSTEM ===
    90: 6,       // BMS status
    91: 36192,   // BMS voltage (mV?)
    92: 0,       // BMS current (mA?)
    93: 7052,    // BMS temperature (°C * 100?)
    94: 0,       // BMS SOC (% * 100?)
    
    // === SYSTEM CONTROL ===
    95: 38,      // Control mode
    96: 5,       // Control parameter
    97: 34758,   // Setpoint value
    
    // === STATE VECTORS (3-phase) ===
    537: 6660,   // State vector phase 1
    538: 2826,   // State vector phase 2
    539: 795,    // State vector phase 3
    
    // === SYSTEM MODE ===
    549: 35505,  // System operating mode
    
    // === BATTERY CELL VOLTAGES ===
    604: 0,      // Cell voltage 1
    605: 0,      // Cell voltage 2
    // ... (cell voltages continue)
    630: 21331,  // Cell voltage 27
    631: 17232,  // Cell voltage 28
    632: 24392,  // Cell voltage 29
    633: 22367,  // Cell voltage 30
    634: 22065,  // Cell voltage 31
    635: 11825,  // Cell voltage 32
    636: 11825,  // Cell voltage 33
    637: 8224,   // Cell voltage 34
    638: 8224,   // Cell voltage 35
    639: 8224,   // Cell voltage 36
    640: 18512   // Cell voltage 37
};

function analyzeRegisters() {
    console.log("=== ATESS ENERGY STORAGE SYSTEM ANALYSIS ===");
    console.log("Device: EXH0F4303F");
    console.log("Timestamp: 2026-04-11 10:03:27");
    console.log("");
    
    console.log("=== POWER SYSTEM STATUS ===");
    const gridVoltage = (registerMap[4] + registerMap[5] + registerMap[6]) / 3;
    console.log(`Grid Voltage: ${gridVoltage.toFixed(1)}V (3-phase average)`);
    
    const pvPower = registerMap[25] + registerMap[26] + registerMap[27];
    console.log(`PV Generation: ${(pvPower/1000).toFixed(2)}kW`);
    
    const loadPower = registerMap[30] + registerMap[31] + registerMap[32];
    console.log(`Load Consumption: ${(loadPower/1000).toFixed(2)}kW`);
    
    console.log("\n=== BATTERY SYSTEM ===");
    console.log(`Battery Voltage: ${registerMap[46]}V`);
    console.log(`Battery Current: ${registerMap[47]}A`);
    console.log(`Battery SOC: ${registerMap[48]}%`);
    console.log(`Battery Temperature: ${registerMap[49]}°C`);
    console.log(`Battery Health: ${registerMap[50]}%`);
    
    console.log("\n=== TEMPERATURE MONITORING ===");
    for (let i = 7; i <= 12; i++) {
        console.log(`Temp Sensor ${i-6}: ${registerMap[i]}°C`);
    }
    
    console.log("\n=== ENERGY FLOW ===");
    console.log(`Energy Imported: ${registerMap[56]}kWh`);
    console.log(`Energy Exported: ${registerMap[57]}kWh`);
    console.log(`Energy Consumed: ${registerMap[58]}kWh`);
    console.log(`Energy Generated: ${registerMap[59]}kWh`);
    
    console.log("\n=== INVERTER STATUS ===");
    console.log(`Inverter Power: ${(registerMap[87]/1000).toFixed(2)}kW`);
    console.log(`Inverter Voltage: ${registerMap[88]}V`);
    console.log(`Inverter Current: ${registerMap[89]}A`);
    console.log(`Inverter Frequency: ${(registerMap[85]/10).toFixed(1)}Hz`);
    
    console.log("\n=== SYSTEM MODE ANALYSIS ===");
    const mode = registerMap[549];
    console.log(`System Mode: ${mode}`);
    if (mode > 20000) {
        console.log("→ CHARGE MODE (Battery charging)");
    } else if (mode > 10000) {
        console.log("→ DISCHARGE MODE (Battery discharging)");
    } else {
        console.log("→ STANDBY MODE");
    }
    
    console.log("\n=== BATTERY CELL VOLTAGES (mV) ===");
    for (let i = 630; i <= 640; i++) {
        if (registerMap[i] > 0) {
            console.log(`Cell ${i-629}: ${registerMap[i]}mV (${(registerMap[i]/1000).toFixed(2)}V)`);
        }
    }
    
    console.log("\n=== GRID INTERACTION ===");
    const gridFreq = registerMap[69] / 1000;
    console.log(`Grid Frequency: ${gridFreq.toFixed(2)}Hz`);
    console.log(`Grid Import Power: ${registerMap[70]}W`);
    console.log(`Grid Export Power: ${(registerMap[71]/1000).toFixed(2)}kW`);
    
    console.log("\n=== SYSTEM HEALTH ===");
    console.log(`System Status: ${registerMap[53]}`);
    console.log(`Fault Code: ${registerMap[54]}`);
    console.log(`Warning Code: ${registerMap[55]}`);
    if (registerMap[54] === 0) {
        console.log("→ NO FAULTS DETECTED");
    } else {
        console.log(`→ FAULT DETECTED: Code ${registerMap[54]}`);
    }
}

analyzeRegisters();
