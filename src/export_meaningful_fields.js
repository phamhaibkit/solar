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
    
    // Battery - Address 16-18, 24, 26
    batteryVoltage: { address: 16, name: 'Battery Voltage', unit: 'V', scale: 0.1 },
    batteryPower: { address: 17, name: 'Battery Power', unit: 'kW', scale: 0.1, signed: true },
    soc: { address: 18, name: 'SOC', unit: '%', scale: 1 },
    batteryDailyDischargeCapacity: { address: 24, name: 'Battery Daily Discharge Capacity', unit: 'kWh', scale: 0.1 },
    batteryDailyChargeCapacity: { address: 26, name: 'Battery Daily Charge Capacity', unit: 'kWh', scale: 0.1 },
    
    // Grid - Address 34-36, 43
    gridVoltageL1: { address: 34, name: 'Grid Voltage L1 (U)', unit: 'V', scale: 0.1 },
    gridVoltageL2: { address: 35, name: 'Grid Voltage L2 (V)', unit: 'V', scale: 0.1 },
    gridVoltageL3: { address: 36, name: 'Grid Voltage L3 (W)', unit: 'V', scale: 0.1 },
    gridTotalPower: { address: 43, name: 'Grid Total Power', unit: 'kW', scale: 0.1 },
    
    // Load - Address 49 (Register 50 in some scanning software)
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
    
    // Energy - Address 243-245
    dailyEnergyFromMeter: { address: 243, name: 'Daily Energy From Meter', unit: 'kWh', scale: 0.1, offset: 1 },
    totalEnergyFromMeterLow: { address: 244, name: 'Total Energy From Meter (Low)', unit: 'kWh', scale: 0.1 },
    totalEnergyFromMeterHigh: { address: 245, name: 'Total Energy From Meter (High)', unit: 'kWh', scale: 0.1 }
};

// Helper function to apply scaling and offset
function applyScale(value, scale = 1, offset = 0, signed = false) {
    let result = signed ? toSigned16(value) : value;
    result = result * scale;
    if (offset) result += offset;
    return result;
}

// Main function to extract meaningful fields from parsed data (Simplified for Web Server display)
function extractMeaningfulFields(parsedData) {
    const registerMap = parsedData.registerMap;
    const timestampObj = JSON.parse(parsedData.timestamp);
    
    // Format timestamp
    const timestamp = `${timestampObj.year}-${String(timestampObj.month).padStart(2, '0')}-${String(timestampObj.day).padStart(2, '0')}T${String(timestampObj.hour).padStart(2, '0')}:${String(timestampObj.minute).padStart(2, '0')}:${String(timestampObj.second).padStart(2, '0')}`;
    
    // Extract simplified fields matching Web Server display
    const meaningfulData = {
        timestamp: timestamp,
        device: {
            loggerSN: parsedData.loggerSN,
            deviceSN: parsedData.deviceSN,
        },
        pv: {
            generatedEnergy: applyScale(registerMap[OFFICIAL_REGISTER_MAP.pvGeneratedDaily.address], OFFICIAL_REGISTER_MAP.pvGeneratedDaily.scale),
            unit: OFFICIAL_REGISTER_MAP.pvGeneratedDaily.unit,
            label: "Generated energy of PV"
        },
        load: {
            consumption: applyScale(registerMap[OFFICIAL_REGISTER_MAP.loadConsumptionDaily.address], OFFICIAL_REGISTER_MAP.loadConsumptionDaily.scale),
            unit: OFFICIAL_REGISTER_MAP.loadConsumptionDaily.unit,
            label: "Consumption of load"
        },
        battery: {
            charge: applyScale(registerMap[OFFICIAL_REGISTER_MAP.batteryDailyChargeCapacity.address], OFFICIAL_REGISTER_MAP.batteryDailyChargeCapacity.scale),
            discharge: applyScale(registerMap[OFFICIAL_REGISTER_MAP.batteryDailyDischargeCapacity.address], OFFICIAL_REGISTER_MAP.batteryDailyDischargeCapacity.scale),
            unit: OFFICIAL_REGISTER_MAP.batteryDailyChargeCapacity.unit,
            label: "Battery charge/discharge"
        },
        grid: {
            import: applyScale(registerMap[OFFICIAL_REGISTER_MAP.gridImportDaily.address], OFFICIAL_REGISTER_MAP.gridImportDaily.scale),
            export: applyScale(registerMap[OFFICIAL_REGISTER_MAP.gridExportDaily.address], OFFICIAL_REGISTER_MAP.gridExportDaily.scale),
            unit: OFFICIAL_REGISTER_MAP.gridImportDaily.unit,
            label: "Import from grid / Export to grid"
        },
        gen: {
            energy: applyScale(registerMap[OFFICIAL_REGISTER_MAP.genEnergyDaily.address], OFFICIAL_REGISTER_MAP.genEnergyDaily.scale),
            unit: OFFICIAL_REGISTER_MAP.genEnergyDaily.unit,
            label: "GEN Energy"
        }
    };
    
    return meaningfulData;
}

// Test with parsePacket
if (require.main === module) {
    const { parsePacket } = require('./parser');
    const hexInput = "00010007031f01240c2b274727404677432d7761747447726f7761747447726f7761747447722a2f29443273415f4427747447726f7761747447726f7761747447726f777b707f4d7f73726174743b72e86c257474477260c96ec27bff725d77587445474c6f3a61777bfd7dda78c467fc47726f539e8a8b9b61e7776174124739678567a079bb726f7761753446006e8961747447726f762b74746062486746645357726f776174744772626b6117744a726f776c747447506f67616574507b657e487d7f47ae6f7761747447726f7761747447726f5561719f6e726f6aca747214cb6f777a9f746e724f7761747447727cff61706c59726f753f74747c0d685b6d0c7441ff0f77616ff847726f516171f381726f7b6a78344b326f776174744772ea7761747447706f7761747447726f7761747447726f7761747447726f7761747447726f236108743a72967732747447726f7761577447726f7761747447726f7761747447726f7761750847726f7761757447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f77617474477295764a747447729089617530aa726e7761747447726f7761747447726f7761747447726f7761747447726f24323724183a382837455a765c5e5741545467522727324544772d5d42513f3c112d2721522b27114341464f444518333f2741545467524f5741545445666d5261747447726f776174745d76647d6c68744772e7766d74a547ae6f7761747447726f6bc3762845f26f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f776127270422303f362b22765c5e5950545467524f572924e1d3";
    
    try {
        const parsedData = parsePacket(hexInput);
        const meaningfulData = extractMeaningfulFields(parsedData);
        console.log(JSON.stringify(meaningfulData, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

module.exports = { extractMeaningfulFields };
