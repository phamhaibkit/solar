// Display Register Map from parse1.txt
// Map và hiên thî giá trî các thanh ghi

const fs = require('fs');

// Register mapping definitions
const registerDefinitions = {
    // System Identification
    0: "System Status Flag",
    1: "Device Type ID",
    2: "Reserved",
    3: "Reserved",
    
    // Grid Measurements
    4: "Grid Voltage Phase 1 (V×10)",
    5: "Grid Voltage Phase 2 (V×10)",
    6: "Grid Voltage Phase 3 (V×10)",
    
    // Temperature Sensors
    7: "Temperature Sensor 1 (°C)",
    8: "Temperature Sensor 2 (°C)",
    9: "Temperature Sensor 3 (°C)",
    10: "Temperature Sensor 4 (°C)",
    11: "Temperature Sensor 5 (°C)",
    12: "Temperature Sensor 6 (°C)",
    
    // DC Voltages
    13: "DC Voltage 1 (V)",
    14: "DC Voltage 2 (V)",
    15: "DC Voltage 3 (V)",
    16: "Battery DC Voltage (V)",
    
    // Power Measurements
    17: "Power Measurement 1 (W)",
    18: "Power Measurement 2 (W)",
    19: "Power Measurement 3 (W, signed)",
    20: "Power Measurement 4 (W, signed)",
    21: "Power Measurement 5 (W)",
    
    // Current Measurements
    22: "Current Measurement 1 (A, signed)",
    23: "Current Measurement 2 (A, signed)",
    24: "Current Measurement 3 (A, signed)",
    
    // PV Power Generation
    25: "PV Power Phase 1 (W)",
    26: "PV Power Phase 2 (W)",
    27: "PV Power Phase 3 (W)",
    
    // Load Power
    28: "Load Power Phase 1 (W)",
    29: "Load Power Phase 2 (W)",
    30: "Load Power Phase 3 (W)",
    31: "Load Power Phase 4 (W)",
    32: "Load Power Phase 5 (W)",
    
    // System Status
    33: "System Status 33",
    34: "System Status 34",
    35: "System Status 35",
    36: "System Status 36",
    37: "System Status 37",
    38: "System Status 38",
    39: "System Status 39",
    40: "System Status 40",
    41: "System Status 41",
    42: "System Status 42",
    43: "System Status 43",
    44: "System Status 44",
    45: "System Status 45",
    
    // Battery System
    46: "Battery Voltage (V)",
    47: "Battery Current (A, signed)",
    48: "Battery SOC (%)",
    49: "Battery Temperature (°C, signed)",
    50: "Battery Health (%)",
    51: "Battery Cycles",
    
    // System Control
    52: "Operating Mode",
    53: "System Status",
    54: "Fault Code",
    55: "Warning Code",
    
    // Energy Counters
    56: "Energy Imported (kWh)",
    57: "Energy Exported (kWh)",
    58: "Energy Consumed (kWh)",
    59: "Energy Generated (kWh)",
    
    // Grid Interaction
    60: "Grid Status 60",
    61: "Grid Status 61",
    62: "Grid Status 62",
    63: "Grid Status 63",
    64: "Grid Status 64",
    65: "Grid Status 65",
    66: "Grid Status 66",
    
    67: "Operating Mode 67",
    68: "Grid Power Factor (×0.001)",
    69: "Grid Frequency (Hz×1000)",
    70: "Grid Import Power (W, signed)",
    71: "Grid Export Power (W)",
    72: "Grid Status 72",
    73: "Grid Status 73",
    74: "Grid Status 74",
    75: "Grid Status 75",
    76: "Grid Status 76",
    77: "Grid Status 77",
    78: "Grid Status 78",
    79: "Grid Status 79",
    80: "Grid Status 80",
    
    // Battery Power
    81: "Battery Power (W, signed)",
    82: "Battery Efficiency (%)",
    83: "Battery Charge Power (W)",
    84: "Battery Discharge Power (W)",
    
    // Inverter Status
    85: "Inverter Frequency (Hz×10)",
    86: "Inverter Status",
    87: "Inverter Power (W)",
    88: "Inverter Voltage (V)",
    89: "Inverter Current (A)",
    
    90: "Inverter Status 90",
    91: "Inverter Status 91",
    92: "Inverter Status 92",
    93: "Inverter Status 93",
    94: "Inverter Status 94",
    
    // Additional System
    95: "System Status 95",
    96: "System Status 96",
    97: "System Status 97",
    98: "System Status 98",
    99: "System Status 99",
    100: "System Status 100",
    101: "System Status 101",
    
    // State Vectors
    102: "State Vector 102",
    103: "State Vector 103",
    104: "State Vector 104",
    105: "State Vector 105",
    106: "State Vector 106",
    107: "State Vector 107",
    108: "State Vector 108",
    109: "State Vector 109",
    110: "State Vector 110",
    111: "State Vector 111",
    112: "State Vector 112",
    113: "State Vector 113",
    114: "State Vector 114",
    115: "State Vector 115",
    116: "State Vector 116",
    117: "State Vector 117",
    118: "State Vector 118",
    119: "State Vector 119",
    120: "State Vector 120",
    121: "State Vector 121",
    122: "State Vector 122",
    123: "System Status 123",
    124: "System Status 124",
    
    // State Vectors (532-549)
    532: "State Vector 532",
    533: "State Vector 533",
    534: "State Vector 534",
    535: "State Vector 535",
    536: "State Vector 536",
    537: "State Vector Phase 1",
    538: "State Vector Phase 2",
    539: "State Vector Phase 3",
    540: "Energy Vector 540",
    541: "Energy Imported Today (kWh)",
    542: "Energy Exported Today (kWh)",
    543: "Energy Consumed Today (kWh)",
    544: "Energy Generated Today (kWh)",
    545: "System Status 545",
    546: "System Status 546",
    547: "System Status 547",
    548: "System Status 548",
    549: "System Operating Mode",
    
    // Battery Cell Voltages (604-640)
    604: "Cell Voltage 604",
    605: "Cell Voltage 605",
    606: "Cell Voltage 606",
    607: "Cell Voltage 607",
    608: "Cell Voltage 608",
    609: "Cell Voltage 609",
    610: "Cell Voltage 610",
    611: "Cell Voltage 611",
    612: "Cell Voltage 612",
    613: "Cell Voltage 613",
    614: "Cell Voltage 614",
    615: "Cell Voltage 615",
    616: "Cell Voltage 616",
    617: "Cell Voltage 617",
    618: "Cell Voltage 618",
    619: "Cell Voltage 619",
    620: "Cell Voltage 620",
    621: "Cell Voltage 621",
    622: "Cell Voltage 622",
    623: "Cell Voltage 623",
    624: "Cell Voltage 624",
    625: "Cell Voltage 625",
    626: "Cell Voltage 626",
    627: "Cell Voltage 627",
    628: "Cell Voltage 628",
    629: "Cell Voltage 629",
    630: "Cell Voltage 1 (mV)",
    631: "Cell Voltage 2 (mV)",
    632: "Cell Voltage 3 (mV)",
    633: "Cell Voltage 4 (mV)",
    634: "Cell Voltage 5 (mV)",
    635: "Cell Voltage 6 (mV)",
    636: "Cell Voltage 7 (mV)",
    637: "Cell Voltage 8 (mV)",
    638: "Cell Voltage 9 (mV)",
    639: "Cell Voltage 10 (mV)",
    640: "Cell Voltage 11 (mV)"
};

// Function to convert signed values
function toSigned16(value) {
    if (value > 32767) {
        return value - 65536;
    }
    return value;
}

// Function to parse register map from parse1.txt
function parseRegisterMap() {
    try {
        const content = fs.readFileSync('parse1.txt', 'utf8');
        
        // Extract registerMap section
        const registerMapMatch = content.match(/"registerMap":\s*\{([\s\S]*?)\n  \}/);
        if (!registerMapMatch) {
            console.error('Không tìm registerMap trong parse1.txt');
            return {};
        }
        
        // Parse the register map
        const registerMapStr = '{' + registerMapMatch[1] + '}';
        const registerMap = JSON.parse(registerMapStr);
        
        return registerMap;
    } catch (error) {
        console.error('Lõi khi parse register map:', error.message);
        return {};
    }
}

// Function to display key registers
function displayKeyRegisters(registerMap) {
    console.log('=== KEY REGISTERS FROM PARSE1.TXT ===');
    console.log('Timestamp: 2026-04-11 10:03:27');
    console.log('Device: EXH0F4303F');
    console.log('');
    
    // System Information
    console.log('--- SYSTEM INFORMATION ---');
    console.log(`Device Type ID (1): ${registerMap[1]} (${registerMap[1] === 6979 ? 'EXH0F4303F' : 'Unknown'})`);
    console.log(`System Status Flag (0): ${registerMap[0]}`);
    console.log(`Operating Mode (52): ${registerMap[52]}`);
    console.log(`System Status (53): ${registerMap[53]}`);
    console.log(`Fault Code (54): ${registerMap[54]} ${registerMap[54] !== 0 ? '(FAULT!)' : '(OK)'}`);
    console.log(`Warning Code (55): ${registerMap[55]} ${registerMap[55] !== 0 ? '(WARNING!)' : '(OK)'}`);
    console.log(`System Operating Mode (549): ${registerMap[549]} (>20000 = CHARGE, <20000 = DISCHARGE)`);
    console.log('');
    
    // Grid Measurements
    console.log('--- GRID MEASUREMENTS ---');
    const gridV1 = registerMap[4] / 10;
    const gridV2 = registerMap[5] / 10;
    const gridV3 = registerMap[6] / 10;
    const gridAvg = (gridV1 + gridV2 + gridV3) / 3;
    console.log(`Grid Voltage L1 (4): ${gridV1.toFixed(1)}V`);
    console.log(`Grid Voltage L2 (5): ${gridV2.toFixed(1)}V`);
    console.log(`Grid Voltage L3 (6): ${gridV3.toFixed(1)}V`);
    console.log(`Grid Average: ${gridAvg.toFixed(1)}V`);
    console.log(`Grid Frequency (69): ${(registerMap[69] / 1000).toFixed(3)}Hz`);
    console.log(`Grid Power Factor (68): ${(registerMap[68] / 1000).toFixed(3)}`);
    console.log(`Grid Export Power (71): ${registerMap[71]}W`);
    console.log('');
    
    // Temperature Sensors
    console.log('--- TEMPERATURE SENSORS ---');
    console.log(`Temp Sensor 1 (7): ${registerMap[7]}°C`);
    console.log(`Temp Sensor 2 (8): ${registerMap[8]}°C`);
    console.log(`Temp Sensor 3 (9): ${registerMap[9]}°C`);
    console.log(`Temp Sensor 4 (10): ${registerMap[10]}°C`);
    console.log(`Temp Sensor 5 (11): ${registerMap[11]}°C`);
    console.log(`Temp Sensor 6 (12): ${registerMap[12]}°C`);
    console.log('');
    
    // Battery System
    console.log('--- BATTERY SYSTEM ---');
    console.log(`Battery Voltage (46): ${registerMap[46]}V`);
    console.log(`Battery Current (47): ${toSigned16(registerMap[47])}A (${registerMap[47] > 0 ? 'CHARGING' : 'DISCHARGING'})`);
    console.log(`Battery SOC (48): ${registerMap[48]}% ${registerMap[48] < 20 ? '(LOW!)' : ''}`);
    console.log(`Battery Temperature (49): ${toSigned16(registerMap[49])}°C`);
    console.log(`Battery Health (50): ${registerMap[50]}%`);
    console.log(`Battery Cycles (51): ${registerMap[51]}`);
    console.log(`Battery Power (81): ${toSigned16(registerMap[81])}W`);
    console.log(`Battery Charge Power (83): ${registerMap[83]}W`);
    console.log(`Battery Discharge Power (84): ${registerMap[84]}W`);
    console.log('');
    
    // PV Power Generation
    console.log('--- PV POWER GENERATION ---');
    const pv1 = registerMap[25] || 0;
    const pv2 = registerMap[26] || 0;
    const pv3 = registerMap[27] || 0;
    const pvTotal = pv1 + pv2 + pv3;
    console.log(`PV Power L1 (25): ${pv1}W`);
    console.log(`PV Power L2 (26): ${pv2}W`);
    console.log(`PV Power L3 (27): ${pv3}W`);
    console.log(`PV Total: ${pvTotal}W`);
    console.log('');
    
    // Load Power
    console.log('--- LOAD POWER ---');
    const load1 = registerMap[30] || 0;
    const load2 = registerMap[31] || 0;
    const load3 = registerMap[32] || 0;
    const loadTotal = load1 + load2 + load3;
    console.log(`Load Power L1 (30): ${load1}W`);
    console.log(`Load Power L2 (31): ${load2}W`);
    console.log(`Load Power L3 (32): ${load3}W`);
    console.log(`Load Total: ${loadTotal}W`);
    console.log('');
    
    // Energy Counters
    console.log('--- ENERGY COUNTERS ---');
    console.log(`Energy Imported (56): ${registerMap[56]}kWh`);
    console.log(`Energy Exported (57): ${registerMap[57]}kWh`);
    console.log(`Energy Consumed (58): ${registerMap[58]}kWh`);
    console.log(`Energy Generated (59): ${registerMap[59]}kWh`);
    console.log(`Energy Imported Today (541): ${(registerMap[541] / 100).toFixed(2)}kWh`);
    console.log(`Energy Exported Today (542): ${(registerMap[542] / 100).toFixed(2)}kWh`);
    console.log(`Energy Consumed Today (543): ${(registerMap[543] / 100).toFixed(2)}kWh`);
    console.log(`Energy Generated Today (544): ${(registerMap[544] / 100).toFixed(2)}kWh`);
    console.log('');
    
    // Inverter Status
    console.log('--- INVERTER STATUS ---');
    console.log(`Inverter Frequency (85): ${(registerMap[85] / 10).toFixed(1)}Hz`);
    console.log(`Inverter Power (87): ${registerMap[87]}W`);
    console.log(`Inverter Voltage (88): ${registerMap[88]}V`);
    console.log(`Inverter Current (89): ${registerMap[89]}A`);
    console.log('');
    
    // State Vectors
    console.log('--- STATE VECTORS ---');
    console.log(`State Vector Phase 1 (537): ${registerMap[537]}`);
    console.log(`State Vector Phase 2 (538): ${registerMap[538]}`);
    console.log(`State Vector Phase 3 (539): ${registerMap[539]}`);
    console.log(`Total State Vector: ${registerMap[537] + registerMap[538] + registerMap[539]}`);
    console.log('');
    
    // Battery Cell Voltages
    console.log('--- BATTERY CELL VOLTAGES ---');
    for (let i = 630; i <= 640; i++) {
        if (registerMap[i] !== undefined) {
            console.log(`Cell ${i - 629} (${i}): ${(registerMap[i] / 1000).toFixed(3)}V`);
        }
    }
    console.log('');
    
    // System Analysis
    console.log('--- SYSTEM ANALYSIS ---');
    const systemMode = registerMap[549] > 20000 ? 'CHARGE' : 'DISCHARGE';
    const batteryHealth = registerMap[50];
    const issues = [];
    
    if (registerMap[54] !== 0) issues.push(`Fault Code ${registerMap[54]}`);
    if (registerMap[55] !== 0) issues.push(`Warning Code ${registerMap[55]}`);
    if (registerMap[48] < 20) issues.push(`Low Battery SOC: ${registerMap[48]}%`);
    if (batteryHealth < 50) issues.push(`Poor Battery Health: ${batteryHealth}%`);
    
    console.log(`System Mode: ${systemMode} (${registerMap[549]})`);
    console.log(`Power Balance: PV(${pvTotal}W) - Load(${loadTotal}W) = ${pvTotal - loadTotal}W`);
    console.log(`Grid Interaction: ${registerMap[71]}W export`);
    console.log(`Battery Status: ${registerMap[48]}% SOC, ${batteryHealth}% health`);
    console.log(`Issues: ${issues.length > 0 ? issues.join(', ') : 'None detected'}`);
    console.log('');
}

// Function to display all registers
function displayAllRegisters(registerMap) {
    console.log('=== COMPLETE REGISTER MAP ===');
    console.log('');
    
    const sortedRegisters = Object.keys(registerMap).map(Number).sort((a, b) => a - b);
    
    sortedRegisters.forEach(addr => {
        const value = registerMap[addr];
        const definition = registerDefinitions[addr] || 'Unknown';
        let displayValue = value;
        
        // Handle signed values
        if ([19, 20, 22, 23, 24, 47, 49, 70, 81].includes(addr)) {
            displayValue = toSigned16(value);
        }
        
        // Handle scaled values
        if ([4, 5, 6].includes(addr)) {
            displayValue = `${(value / 10).toFixed(1)}V`;
        } else if (addr === 68) {
            displayValue = `${(value / 1000).toFixed(3)}`;
        } else if (addr === 69) {
            displayValue = `${(value / 1000).toFixed(3)}Hz`;
        } else if (addr === 85) {
            displayValue = `${(value / 10).toFixed(1)}Hz`;
        } else if ([630, 631, 632, 633, 634, 635, 636, 637, 638, 639, 640].includes(addr)) {
            displayValue = `${(value / 1000).toFixed(3)}V`;
        }
        
        console.log(`${addr.toString().padStart(3)}: ${displayValue.toString().padStart(8)} | ${definition}`);
    });
}

// Main function
function main() {
    console.log('ATESS ENERGY STORAGE SYSTEM - REGISTER MAP DISPLAY');
    console.log('==================================================');
    console.log('');
    
    const registerMap = parseRegisterMap();
    
    if (Object.keys(registerMap).length === 0) {
        console.error('Không có data nào trong register map!');
        return;
    }
    
    displayKeyRegisters(registerMap);
    
    console.log('Press Enter to display all registers...');
    process.stdin.once('data', () => {
        displayAllRegisters(registerMap);
    });
}

// Run if executed directly
if (require.main === module) {
    main();
}

module.exports = {
    parseRegisterMap,
    displayKeyRegisters,
    displayAllRegisters,
    registerDefinitions
};
