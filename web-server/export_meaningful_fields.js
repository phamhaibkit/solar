// Export Meaningful Fields as JSON from parsePacket output

// Function to convert signed values
const toSigned16 = (value) => {
    if (value > 32767) return value - 65536;
    return value;
};

// Official Register Map from ATESS Protocol
const OFFICIAL_REGISTER_MAP = {
    // CARD values (kWh - daily energy)
    pvGeneratedDaily: { address: 62, name: 'Generated energy of PV', unit: 'kWh', scale: 0.1 },
    loadConsumptionDaily: { address: 82, name: 'Consumption of load', unit: 'kWh', scale: 0.1 },
    batteryDailyChargeCapacity: { address: 26, name: 'Battery charge', unit: 'kWh', scale: 0.1 },
    batteryDailyDischargeCapacity: { address: 24, name: 'Battery discharge', unit: 'kWh', scale: 0.1 },
    gridImportDaily: { address: 88, name: 'Import from grid', unit: 'kWh', scale: 0.1 },
    gridExportDaily: { address: 94, name: 'Export to grid', unit: 'kWh', scale: 0.1 },
    genEnergyDaily: { address: 222, name: 'Energy of import from GEN', unit: 'kWh', scale: 0.1 },
    
    // CHART values (kW - realtime power)
    pvPower: { address: 51, name: 'PV power', unit: 'kW', scale: 0.1 },
    pvTotalPower: { address: 108, name: 'PV power', unit: 'kW', scale: 0.1 },
    loadTotalPower: { address: 49, name: 'Load active power', unit: 'kW', scale: 0.1 },
    batteryPower: { address: 17, name: 'Battery power', unit: 'kW', scale: 0.1, signed: true },
    bypassActivePower: { address: 19, name: 'Grid power (bypass)', unit: 'kW', scale: 0.1, signed: true },
    dgActivePower: { address: 220, name: 'DG power', unit: 'kW', scale: 0.1 },
    soc: { address: 47, name: 'Battery SOC', unit: '%', scale: 1 }
};

// Helper function to apply scaling and offset
function applyScale(value, scale = 1, offset = 0, signed = false) {
    let result = signed ? toSigned16(value) : value;
    result = result * scale;
    if (offset) result += offset;
    return result;
}

// Helper function to calculate High/Low bit value
function calculateHighLow(low, high, scale = 1) {
    const total = (low * 65536) + high;
    return total * scale;
}

// Main function to extract meaningful fields from parsed data
function extractMeaningfulFields(parsedData) {
    const registerMap = parsedData.registerMap;
    const timestampObj = JSON.parse(parsedData.timestamp);
    
    const timestamp = `${timestampObj.year}-${String(timestampObj.month).padStart(2, '0')}-${String(timestampObj.day).padStart(2, '0')}T${String(timestampObj.hour).padStart(2, '0')}:${String(timestampObj.minute).padStart(2, '0')}:${String(timestampObj.second).padStart(2, '0')}`;
    
    // Extract real-time power values (CHART data)
    const pvPower = registerMap[OFFICIAL_REGISTER_MAP.pvTotalPower.address] || 
                   registerMap[OFFICIAL_REGISTER_MAP.pvPower.address] || 0;
    const loadPower = registerMap[OFFICIAL_REGISTER_MAP.loadTotalPower.address] || 0;
    const batteryPower = registerMap[OFFICIAL_REGISTER_MAP.batteryPower.address] || 0;
    const bypassPower = registerMap[OFFICIAL_REGISTER_MAP.bypassActivePower.address] || 0;
    const genPower = registerMap[OFFICIAL_REGISTER_MAP.dgActivePower.address] || 0;
    const soc = registerMap[OFFICIAL_REGISTER_MAP.soc.address] || 0;
    
    // Calculate grid import/export from bypass power
    // 0 → import từ grid, < 0 → export ra grid
    let gridImportPower = 0;
    let gridExportPower = 0;
    if (bypassPower > 0) {
        gridImportPower = bypassPower;
    } else if (bypassPower < 0) {
        gridExportPower = Math.abs(bypassPower);
    }
    
    // Calculate battery charge/discharge from battery power
    // 0 → discharge, < 0 → charge
    let batteryCharge = 0;
    let batteryDischarge = 0;
    if (batteryPower < 0) {
        batteryCharge = Math.abs(batteryPower);
    } else {
        batteryDischarge = batteryPower;
    }
    
    const meaningfulData = {
        timestamp: timestamp,
        device: {
            loggerSN: parsedData.loggerSN,
            deviceSN: parsedData.deviceSN,
        },
        // CARD values (kWh - daily energy)
        pv: {
            daily: applyScale(registerMap[OFFICIAL_REGISTER_MAP.pvGeneratedDaily.address], OFFICIAL_REGISTER_MAP.pvGeneratedDaily.scale),
            dailyUnit: 'kWh',
            label: "Generated energy of PV"
        },
        load: {
            daily: applyScale(registerMap[OFFICIAL_REGISTER_MAP.loadConsumptionDaily.address], OFFICIAL_REGISTER_MAP.loadConsumptionDaily.scale),
            dailyUnit: 'kWh',
            label: "Consumption of load"
        },
        battery: {
            charge: applyScale(registerMap[OFFICIAL_REGISTER_MAP.batteryDailyChargeCapacity.address], OFFICIAL_REGISTER_MAP.batteryDailyChargeCapacity.scale),
            discharge: applyScale(registerMap[OFFICIAL_REGISTER_MAP.batteryDailyDischargeCapacity.address], OFFICIAL_REGISTER_MAP.batteryDailyDischargeCapacity.scale),
            unit: 'kWh',
            label: "Battery charge/discharge"
        },
        grid: {
            import: {
                daily: applyScale(registerMap[OFFICIAL_REGISTER_MAP.gridImportDaily.address], OFFICIAL_REGISTER_MAP.gridImportDaily.scale)
            },
            export: {
                daily: applyScale(registerMap[OFFICIAL_REGISTER_MAP.gridExportDaily.address], OFFICIAL_REGISTER_MAP.gridExportDaily.scale)
            },
            dailyUnit: 'kWh',
            label: "Import from grid / Export to grid"
        },
        gen: {
            daily: applyScale(registerMap[OFFICIAL_REGISTER_MAP.genEnergyDaily.address], OFFICIAL_REGISTER_MAP.genEnergyDaily.scale),
            dailyUnit: 'kWh',
            label: "Energy of import from GEN"
        },
        // CHART values (kW - realtime power)
        realtime: {
            pv: applyScale(pvPower, 0.1),
            load: applyScale(loadPower, 0.1),
            batteryCharge: applyScale(batteryCharge, 0.1),
            batteryDischarge: applyScale(batteryDischarge, 0.1),
            gridImport: applyScale(gridImportPower, 0.1),
            gridExport: applyScale(gridExportPower, 0.1),
            gen: applyScale(genPower, 0.1),
            soc: applyScale(soc, 1),
            unit: 'kW',
            socUnit: '%'
        },
        // SYSTEM DIAGRAM (flow năng lượng)
        systemFlow: {
            grid: Math.abs(applyScale(bypassPower, 0.1)),
            battery: Math.abs(applyScale(batteryPower, 0.1)),
            pv: applyScale(pvPower, 0.1),
            soc: applyScale(soc, 1),
            unit: 'kW',
            socUnit: '%'
        }
    };
    
    return meaningfulData;
}

module.exports = { extractMeaningfulFields };
