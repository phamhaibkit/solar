// Test extractMeaningfulFields with parse2.txt and parse3.txt

const fs = require('fs');
const { extractMeaningfulFields } = require('./src/export_meaningful_fields');

// Function to parse registerMap from parse file
function parseRegisterMapFromFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract registerMap section
        const registerMapMatch = content.match(/"registerMap":\s*\{([\s\S]*?)\n  \}/);
        if (!registerMapMatch) {
            console.error('Không tìm registerMap trong', filePath);
            return null;
        }
        
        // Parse the register map
        const registerMapStr = '{' + registerMapMatch[1] + '}';
        const registerMap = JSON.parse(registerMapStr);
        
        // Extract timestamp
        const timestampMatch = content.match(/"timestamp":\s*"([^"]+)"/);
        const timestamp = timestampMatch ? timestampMatch[1] : null;
        
        // Extract loggerSN and deviceSN
        const loggerSNMatch = content.match(/"loggerSN":\s*"([^"]+)"/);
        const deviceSNMatch = content.match(/"deviceSN":\s*"([^"]+)"/);
        
        return {
            registerMap,
            timestamp,
            loggerSN: loggerSNMatch ? loggerSNMatch[1] : null,
            deviceSN: deviceSNMatch ? deviceSNMatch[1] : null
        };
    } catch (error) {
        console.error('Lỗi khi parse', filePath, ':', error.message);
        return null;
    }
}

// Test with parse1.txt, parse2.txt, parse3.txt
const files = [
    'parse1.txt',
    'parse2.txt',
    'parse3.txt'
];

console.log('=== TEST EXTRACT MEANINGFUL FIELDS ===\n');

files.forEach((file, index) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`FILE: ${file}`);
    console.log('='.repeat(60));
    
    const parsedData = parseRegisterMapFromFile(file);
    
    if (!parsedData) {
        console.log(`❌ Không thể parse ${file}`);
        return;
    }
    
    console.log(`✅ Parse thành công:`);
    console.log(`   - Logger SN: ${parsedData.loggerSN}`);
    console.log(`   - Device SN: ${parsedData.deviceSN}`);
    console.log(`   - Timestamp: ${parsedData.timestamp}`);
    console.log(`   - Registers: ${Object.keys(parsedData.registerMap).length}`);
    
    try {
        const meaningfulData = extractMeaningfulFields(parsedData);
        
        console.log(`\n📊 KEY METRICS:`);
        console.log(`   - Grid Voltage L1: ${meaningfulData.grid.voltageL1.toFixed(1)} V`);
        console.log(`   - Grid Voltage L2: ${meaningfulData.grid.voltageL2.toFixed(1)} V`);
        console.log(`   - Grid Voltage L3: ${meaningfulData.grid.voltageL3.toFixed(1)} V`);
        console.log(`   - Grid Frequency: ${meaningfulData.grid.frequency.toFixed(2)} Hz`);
        console.log(`   - Battery Voltage: ${meaningfulData.battery.voltage} V`);
        console.log(`   - Battery Current: ${meaningfulData.battery.current} A`);
        console.log(`   - Battery SOC: ${meaningfulData.battery.soc} %`);
        console.log(`   - Battery Temperature: ${meaningfulData.battery.temperature} °C`);
        console.log(`   - Solar Power: ${meaningfulData.solar.totalPower} W`);
        console.log(`   - Load Power: ${meaningfulData.load.totalPower} W`);
        console.log(`   - Grid Export: ${meaningfulData.grid.exportPower} W`);
        console.log(`   - Grid Import: ${meaningfulData.grid.importPower} W`);
        console.log(`   - Inverter Power: ${meaningfulData.inverter.power} W`);
        console.log(`   - Energy Imported: ${meaningfulData.energy.imported} kWh`);
        console.log(`   - Energy Exported: ${meaningfulData.energy.exported} kWh`);
        console.log(`   - Energy Consumed: ${meaningfulData.energy.consumed} kWh`);
        console.log(`   - Energy Generated: ${meaningfulData.energy.generated} kWh`);
        
        console.log(`\n🔋 BATTERY CELLS:`);
        const cellCount = Object.keys(meaningfulData.batteryCells).length;
        console.log(`   - Cells detected: ${cellCount}`);
        if (cellCount > 0) {
            const sampleCells = Object.entries(meaningfulData.batteryCells).slice(0, 3);
            sampleCells.forEach(([cell, voltage]) => {
                console.log(`   - ${cell}: ${voltage.toFixed(3)} V`);
            });
            if (cellCount > 3) {
                console.log(`   - ... (${cellCount - 3} more)`);
            }
        }
        
        console.log(`\n⚠️ HEALTH STATUS: ${meaningfulData.healthSummary.overallStatus}`);
        if (meaningfulData.healthSummary.issues.length > 0) {
            meaningfulData.healthSummary.issues.forEach(issue => {
                console.log(`   - ${issue}`);
            });
        } else {
            console.log(`   - No issues detected`);
        }
        
    } catch (error) {
        console.error(`❌ Lỗi khi extract meaningful fields:`, error.message);
    }
});

console.log(`\n${'='.repeat(60)}`);
console.log('=== COMPARISON SUMMARY ===');
console.log('='.repeat(60));

// Compare key metrics across files
const parse1 = parseRegisterMapFromFile('parse1.txt');
const parse2 = parseRegisterMapFromFile('parse2.txt');
const parse3 = parseRegisterMapFromFile('parse3.txt');

if (parse1 && parse2 && parse3) {
    const metrics1 = extractMeaningfulFields(parse1);
    const metrics2 = extractMeaningfulFields(parse2);
    const metrics3 = extractMeaningfulFields(parse3);
    
    console.log('\n📈 METRICS COMPARISON:');
    console.log('Metric           | Parse1  | Parse2  | Parse3  | Change');
    console.log('-'.repeat(70));
    
    const compareMetric = (name, getter) => {
        const v1 = getter(metrics1);
        const v2 = getter(metrics2);
        const v3 = getter(metrics3);
        const change = Math.abs(v2 - v1) > 0.01 || Math.abs(v3 - v2) > 0.01 ? '✓' : '-';
        console.log(`${name.padEnd(17)}| ${v1.toFixed(2).padStart(7)}| ${v2.toFixed(2).padStart(7)}| ${v3.toFixed(2).padStart(7)}| ${change}`);
    };
    
    compareMetric('Grid Voltage (V)', m => m.grid.voltageAverage);
    compareMetric('Grid Freq (Hz)', m => m.grid.frequency);
    compareMetric('Battery Voltage (V)', m => m.battery.voltage);
    compareMetric('Battery Current (A)', m => m.battery.current);
    compareMetric('Battery SOC (%)', m => m.battery.soc);
    compareMetric('Battery Temp (°C)', m => m.battery.temperature);
    compareMetric('Solar Power (W)', m => m.solar.totalPower);
    compareMetric('Load Power (W)', m => m.load.totalPower);
    compareMetric('Grid Export (W)', m => m.grid.exportPower);
    compareMetric('Grid Import (W)', m => m.grid.importPower);
    compareMetric('Inverter Power (W)', m => m.inverter.power);
    
    console.log('\n✓ = Values changed between files (expected for real-time data)');
    console.log('- = Values stable across files (expected for static config)');
}
