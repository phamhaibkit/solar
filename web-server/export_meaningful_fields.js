// Export Meaningful Fields as JSON from parsePacket output

// Function to convert signed values
const toSigned16 = (value) => {
    if (value > 32767) return value - 65536;
    return value;
};

// Official Register Map from ATESS Protocol
const OFFICIAL_REGISTER_MAP = {
    // PV (Photovoltaic) - Address 0-5
    pv1: { address: 0, name: 'PV1 Voltage', unit: 'V', scale: 0.1 },
    pv1Current: { address: 1, name: 'PV1 Current', unit: 'A', scale: 0.1 },
    pv1Power: { address: 2, name: 'PV1 Power', unit: 'kW', scale: 0.1 },
    pv2: { address: 3, name: 'PV2 Voltage', unit: 'V', scale: 0.1 },
    pv2Current: { address: 4, name: 'PV2 Current', unit: 'A', scale: 0.1 },
    pv2Power: { address: 5, name: 'PV2 Power', unit: 'kW', scale: 0.1 },
    
    // Battery - Address 16-18, 24, 26, 47
    batteryVoltage: { address: 16, name: 'Battery Voltage', unit: 'V', scale: 0.1 },
    batteryPower: { address: 17, name: 'Battery Power', unit: 'kW', scale: 0.1, signed: true },
    soc: { address: 18, name: 'SOC', unit: '%', scale: 1 },
    batteryDailyDischargeCapacity: { address: 24, name: 'Battery Daily Discharge Capacity', unit: 'kWh', scale: 0.1 },
    batteryDailyChargeCapacity: { address: 26, name: 'Battery Daily Charge Capacity', unit: 'kWh', scale: 0.1 },
    batteryPercentage: { address: 47, name: 'Battery Percentage', unit: '%', scale: 1 },
    
    // Grid - Address 34-36, 43
    gridVoltageL1: { address: 34, name: 'Grid Voltage L1 (U)', unit: 'V', scale: 0.1 },
    gridVoltageL2: { address: 35, name: 'Grid Voltage L2 (V)', unit: 'V', scale: 0.1 },
    gridVoltageL3: { address: 36, name: 'Grid Voltage L3 (W)', unit: 'V', scale: 0.1 },
    gridTotalPower: { address: 43, name: 'Grid Total Power', unit: 'kW', scale: 0.1 },
    
    // Load - Address 49
    loadTotalPower: { address: 49, name: 'Load Total Power', unit: 'kW', scale: 0.1 },
    
    // System - Address 192
    operationMode: { address: 192, name: 'Operation Mode', unit: '', scale: 1 },
    
    // Diesel Generator (DG) - Address 216-220
    dgCurrentU: { address: 216, name: 'DG Current U', unit: 'A', scale: 0.1, offset: 1 },
    dgCurrentV: { address: 217, name: 'DG Current V', unit: 'A', scale: 0.1, offset: 1 },
    dgCurrentW: { address: 218, name: 'DG Current W', unit: 'A', scale: 0.1, offset: 1 },
    dgActivePower: { address: 220, name: 'DG Active Power', unit: 'kW', scale: 0.1, offset: 1 },
    
    // Energy - Daily
    pvGeneratedDaily: { address: 62, name: 'PV Generated (Daily)', unit: 'kWh', scale: 0.1 },
    loadConsumptionDaily: { address: 82, name: 'Load Consumption (Daily)', unit: 'kWh', scale: 0.1 },
    gridImportDaily: { address: 88, name: 'Grid Import (Daily)', unit: 'kWh', scale: 0.1 },
    gridExportDaily: { address: 94, name: 'Grid Export (Daily)', unit: 'kWh', scale: 0.1 },
    genEnergyDaily: { address: 222, name: 'GEN Energy (Daily)', unit: 'kWh', scale: 0.1 },
    
    // Energy - Total (High/Low bits)
    pvTotalLow: { address: 64, name: 'PV Total (Low)', unit: 'kWh', scale: 0.1 },
    pvTotalHigh: { address: 65, name: 'PV Total (High)', unit: 'kWh', scale: 0.1 },
    loadTotalLow: { address: 84, name: 'Load Total (Low)', unit: 'kWh', scale: 0.1 },
    loadTotalHigh: { address: 85, name: 'Load Total (High)', unit: 'kWh', scale: 0.1 },
    gridImportTotalLow: { address: 90, name: 'Grid Import Total (Low)', unit: 'kWh', scale: 0.1 },
    gridImportTotalHigh: { address: 91, name: 'Grid Import Total (High)', unit: 'kWh', scale: 0.1 },
    gridExportTotalLow: { address: 96, name: 'Grid Export Total (Low)', unit: 'kWh', scale: 0.1 },
    gridExportTotalHigh: { address: 97, name: 'Grid Export Total (High)', unit: 'kWh', scale: 0.1 },
    genTotalLow: { address: 224, name: 'GEN Total (Low)', unit: 'kWh', scale: 0.1 },
    genTotalHigh: { address: 225, name: 'GEN Total (High)', unit: 'kWh', scale: 0.1 }
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
    
    const meaningfulData = {
        timestamp: timestamp,
        device: {
            loggerSN: parsedData.loggerSN,
            deviceSN: parsedData.deviceSN,
        },
        pv: {
            daily: applyScale(registerMap[OFFICIAL_REGISTER_MAP.pvGeneratedDaily.address], OFFICIAL_REGISTER_MAP.pvGeneratedDaily.scale),
            total: calculateHighLow(registerMap[OFFICIAL_REGISTER_MAP.pvTotalLow.address], registerMap[OFFICIAL_REGISTER_MAP.pvTotalHigh.address], OFFICIAL_REGISTER_MAP.pvTotalLow.scale) / 1000,
            dailyUnit: 'kWh',
            totalUnit: 'MWh',
            label: "Generated energy of PV"
        },
        load: {
            daily: applyScale(registerMap[OFFICIAL_REGISTER_MAP.loadConsumptionDaily.address], OFFICIAL_REGISTER_MAP.loadConsumptionDaily.scale),
            total: calculateHighLow(registerMap[OFFICIAL_REGISTER_MAP.loadTotalLow.address], registerMap[OFFICIAL_REGISTER_MAP.loadTotalHigh.address], OFFICIAL_REGISTER_MAP.loadTotalLow.scale),
            dailyUnit: 'kWh',
            totalUnit: 'kWh',
            label: "Consumption of load"
        },
        battery: {
            charge: applyScale(registerMap[OFFICIAL_REGISTER_MAP.batteryDailyChargeCapacity.address], OFFICIAL_REGISTER_MAP.batteryDailyChargeCapacity.scale),
            discharge: applyScale(registerMap[OFFICIAL_REGISTER_MAP.batteryDailyDischargeCapacity.address], OFFICIAL_REGISTER_MAP.batteryDailyDischargeCapacity.scale),
            unit: OFFICIAL_REGISTER_MAP.batteryDailyChargeCapacity.unit,
            label: "Battery charge/discharge"
        },
        grid: {
            import: {
                daily: applyScale(registerMap[OFFICIAL_REGISTER_MAP.gridImportDaily.address], OFFICIAL_REGISTER_MAP.gridImportDaily.scale),
                total: calculateHighLow(registerMap[OFFICIAL_REGISTER_MAP.gridImportTotalLow.address], registerMap[OFFICIAL_REGISTER_MAP.gridImportTotalHigh.address], OFFICIAL_REGISTER_MAP.gridImportTotalLow.scale) / 1000
            },
            export: {
                daily: applyScale(registerMap[OFFICIAL_REGISTER_MAP.gridExportDaily.address], OFFICIAL_REGISTER_MAP.gridExportDaily.scale),
                total: calculateHighLow(registerMap[OFFICIAL_REGISTER_MAP.gridExportTotalLow.address], registerMap[OFFICIAL_REGISTER_MAP.gridExportTotalHigh.address], OFFICIAL_REGISTER_MAP.gridExportTotalLow.scale) / 1000
            },
            dailyUnit: 'kWh',
            totalUnit: 'MWh',
            label: "Import from grid / Export to grid"
        },
        gen: {
            daily: applyScale(registerMap[OFFICIAL_REGISTER_MAP.genEnergyDaily.address], OFFICIAL_REGISTER_MAP.genEnergyDaily.scale),
            total: calculateHighLow(registerMap[OFFICIAL_REGISTER_MAP.genTotalLow.address], registerMap[OFFICIAL_REGISTER_MAP.genTotalHigh.address], OFFICIAL_REGISTER_MAP.genTotalLow.scale) / 1000,
            dailyUnit: 'kWh',
            totalUnit: 'MWh',
            label: "GEN Energy"
        }
    };
    
    return meaningfulData;
}

module.exports = { extractMeaningfulFields };
