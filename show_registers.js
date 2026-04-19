// Simple Register Display from parse1.txt

const fs = require('fs');

// Read parse1.txt and extract register map
try {
    const content = fs.readFileSync('parse1.txt', 'utf8');
    
    // Extract registerMap section
    const registerMapMatch = content.match(/"registerMap":\s*\{([\s\S]*?)\n  \}/);
    if (!registerMapMatch) {
        console.error('Không tìm registerMap trong parse1.txt');
        return;
    }
    
    // Parse the register map
    const registerMapStr = '{' + registerMapMatch[1] + '}';
    const registerMap = JSON.parse(registerMapStr);
    
    console.log('=== KEY REGISTERS FROM PARSE1.TXT ===');
    console.log('Timestamp: 2026-04-11 10:03:27');
    console.log('Device: EXH0F4303F');
    console.log('');
    
    // Key System Information
    console.log('--- SYSTEM INFORMATION ---');
    console.log(`Device Type ID (1): ${registerMap[1]} (${registerMap[1] === 6979 ? 'EXH0F4303F' : 'Unknown'})`);
    console.log(`System Operating Mode (549): ${registerMap[549]} (>20000 = CHARGE, <20000 = DISCHARGE)`);
    console.log(`Fault Code (54): ${registerMap[54]} ${registerMap[54] !== 0 ? '(FAULT!)' : '(OK)'}`);
    console.log(`Warning Code (55): ${registerMap[55]} ${registerMap[55] !== 0 ? '(WARNING!)' : '(OK)'}`);
    console.log('');
    
    // Battery System
    console.log('--- BATTERY SYSTEM ---');
    console.log(`Battery Voltage (46): ${registerMap[46]}V`);
    console.log(`Battery Current (47): ${registerMap[47]}A (${registerMap[47] > 0 ? 'CHARGING' : 'DISCHARGING'})`);
    console.log(`Battery SOC (48): ${registerMap[48]}% ${registerMap[48] < 20 ? '(LOW!)' : ''}`);
    console.log(`Battery Health (50): ${registerMap[50]}%`);
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
    console.log(`Grid Export Power (71): ${registerMap[71]}W`);
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
    console.log('');
    
    // Inverter Status
    console.log('--- INVERTER STATUS ---');
    console.log(`Inverter Power (87): ${registerMap[87]}W`);
    console.log(`Inverter Frequency (85): ${(registerMap[85] / 10).toFixed(1)}Hz`);
    console.log('');
    
    // State Vectors
    console.log('--- STATE VECTORS ---');
    console.log(`State Vector Phase 1 (537): ${registerMap[537]}`);
    console.log(`State Vector Phase 2 (538): ${registerMap[538]}`);
    console.log(`State Vector Phase 3 (539): ${registerMap[539]}`);
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
    const issues = [];
    
    if (registerMap[54] !== 0) issues.push(`Fault Code ${registerMap[54]}`);
    if (registerMap[55] !== 0) issues.push(`Warning Code ${registerMap[55]}`);
    if (registerMap[48] < 20) issues.push(`Low Battery SOC: ${registerMap[48]}%`);
    if (registerMap[50] < 50) issues.push(`Poor Battery Health: ${registerMap[50]}%`);
    
    console.log(`System Mode: ${systemMode} (${registerMap[549]})`);
    console.log(`Power Balance: PV(${pvTotal}W) - Load(${loadTotal}W) = ${pvTotal - loadTotal}W`);
    console.log(`Grid Interaction: ${registerMap[71]}W export`);
    console.log(`Battery Status: ${registerMap[48]}% SOC, ${registerMap[50]}% health`);
    console.log(`Issues: ${issues.length > 0 ? issues.join(', ') : 'None detected'}`);
    
} catch (error) {
    console.error('Error:', error.message);
}
