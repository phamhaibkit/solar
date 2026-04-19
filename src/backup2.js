// Export Meaningful Fields as JSON from parsePacket output

// Function to convert signed values
const toSigned16 = (value) => {
    if (value > 32767) return value - 65536;
    return value;
};

// Main function to extract meaningful fields from parsed data
function extractMeaningfulFields(parsedData) {
    const registerMap = parsedData.registerMap;
    const timestampObj = JSON.parse(parsedData.timestamp);
    
    // Format timestamp
    const timestamp = `${timestampObj.year}-${String(timestampObj.month).padStart(2, '0')}-${String(timestampObj.day).padStart(2, '0')}T${String(timestampObj.hour).padStart(2, '0')}:${String(timestampObj.minute).padStart(2, '0')}:${String(timestampObj.second).padStart(2, '0')}`;
    
    // Extract meaningful fields
    const meaningfulData = {
        timestamp: timestamp,
        device: {
            loggerSN: parsedData.loggerSN,
            deviceSN: parsedData.deviceSN,
            deviceTypeID: registerMap[1],
            deviceType: registerMap[1] === 6979 ? "EXH0F4303F" : "Unknown"
        },
        system: {
            statusFlag: registerMap[0],
            operatingMode: registerMap[52],
            systemStatus: registerMap[53],
            faultCode: registerMap[54],
            warningCode: registerMap[55],
            mainOperatingMode: registerMap[549],
            modeDescription: registerMap[549] > 20000 ? "CHARGE" : "DISCHARGE",
            hasFault: registerMap[54] !== 0,
            hasWarning: registerMap[55] !== 0
        },
        grid: {
            voltageL1: registerMap[4] / 10,
            voltageL2: registerMap[5] / 10,
            voltageL3: registerMap[6] / 10,
            voltageAverage: (registerMap[4] + registerMap[5] + registerMap[6]) / 30,
            frequency: registerMap[69] / 1000,
            powerFactor: registerMap[68] / 1000,
            exportPower: registerMap[71],
            importPower: toSigned16(registerMap[70])
        },
        battery: {
            voltage: registerMap[46],
            current: toSigned16(registerMap[47]),
            soc: registerMap[48],
            temperature: toSigned16(registerMap[49]),
            health: registerMap[50],
            cycles: registerMap[51],
            power: toSigned16(registerMap[81]),
            chargePower: registerMap[83],
            dischargePower: registerMap[84],
            efficiency: registerMap[82],
            isCharging: registerMap[47] > 0,
            lowSOC: registerMap[48] < 20,
            poorHealth: registerMap[50] < 50
        },
        solar: {
            powerL1: registerMap[25],
            powerL2: registerMap[26],
            powerL3: registerMap[27],
            totalPower: (registerMap[25] || 0) + (registerMap[26] || 0) + (registerMap[27] || 0)
        },
        load: {
            powerL1: registerMap[30],
            powerL2: registerMap[31],
            powerL3: registerMap[32],
            totalPower: (registerMap[30] || 0) + (registerMap[31] || 0) + (registerMap[32] || 0)
        },
        inverter: {
            frequency: registerMap[85] / 10,
            power: registerMap[87],
            voltage: registerMap[88],
            current: registerMap[89],
            status: registerMap[86]
        },
        energy: {
            imported: registerMap[56],
            exported: registerMap[57],
            consumed: registerMap[58],
            generated: registerMap[59],
            importedToday: registerMap[541] / 100,
            exportedToday: registerMap[542] / 100,
            consumedToday: registerMap[543] / 100,
            generatedToday: registerMap[544] / 100
        },
        stateVectors: {
            phase1: registerMap[537],
            phase2: registerMap[538],
            phase3: registerMap[539],
            total: registerMap[537] + registerMap[538] + registerMap[539]
        },
        temperature: {
            sensor1: registerMap[7],
            sensor2: registerMap[8],
            sensor3: registerMap[9],
            sensor4: registerMap[10],
            sensor5: registerMap[11],
            sensor6: registerMap[12]
        },
        batteryCells: {}
    };
    
    // Extract battery cell voltages
    for (let i = 630; i <= 640; i++) {
        if (registerMap[i] !== undefined) {
            meaningfulData.batteryCells[`cell${i - 629}`] = registerMap[i] / 1000;
        }
    }
    
    // Power balance analysis
    meaningfulData.powerBalance = {
        solarProduction: meaningfulData.solar.totalPower,
        loadConsumption: meaningfulData.load.totalPower,
        netPower: meaningfulData.solar.totalPower - meaningfulData.load.totalPower,
        gridExport: meaningfulData.grid.exportPower,
        batteryCharging: meaningfulData.battery.chargePower,
        description: meaningfulData.solar.totalPower > meaningfulData.load.totalPower ? 
                     "Excess power exported to grid and battery" : 
                     "Deficit power imported from grid"
    };
    
    // System health summary
    meaningfulData.healthSummary = {
        overallStatus: meaningfulData.system.hasFault ? "FAULT" : 
                      (meaningfulData.system.hasWarning ? "WARNING" : "NORMAL"),
        issues: []
    };
    
    if (meaningfulData.system.faultCode !== 0) {
        meaningfulData.healthSummary.issues.push(`Fault Code ${meaningfulData.system.faultCode}`);
    }
    if (meaningfulData.system.warningCode !== 0) {
        meaningfulData.healthSummary.issues.push(`Warning Code ${meaningfulData.system.warningCode}`);
    }
    if (meaningfulData.battery.lowSOC) {
        meaningfulData.healthSummary.issues.push(`Low Battery SOC: ${meaningfulData.battery.soc}%`);
    }
    if (meaningfulData.battery.poorHealth) {
        meaningfulData.healthSummary.issues.push(`Poor Battery Health: ${meaningfulData.battery.health}%`);
    }
    if (meaningfulData.battery.temperature === 0) {
        meaningfulData.healthSummary.issues.push("Battery temperature sensor error");
    }
    
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
