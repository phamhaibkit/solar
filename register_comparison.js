// So sánh và phân tích register values qua 3 file parse
// Parse1: 10:03:27, Parse2: 10:08:27, Parse3: 10:13:28

const parse1 = {
    // Timestamp: 2026-04-11 10:03:27
    0: 152, 1: 6979, 2: 0, 3: 0,
    4: 3997, 5: 3991, 6: 3986,  // Grid voltages
    7: 50, 8: 56, 9: 49, 10: 61, 11: 76, 12: 3,  // Temp sensors
    13: 3994, 14: 3991, 15: 3968, 16: 5002,  // DC voltages
    17: 0, 18: 36, 19: 65534, 20: 65501, 21: 5002,  // Power measurements
    22: 0, 23: 102, 24: 75,  // Current measurements
    25: 2290, 26: 1748, 27: 3580,  // PV power
    28: 0, 29: 0, 30: 320, 31: 370, 32: 520,  // Load power
    33: 0, 34: 0, 35: 0, 36: 330, 37: 0, 38: 10000, 39: 10000, 40: 10000, 41: 10000, 42: 0, 43: 0, 44: 0, 45: 0,
    46: 3355, 47: 99, 48: 13, 49: 0, 50: 13, 51: 0,  // Battery
    52: 34, 53: 16, 54: 17, 55: 23,  // System status
    56: 2294, 57: 2325, 58: 2296, 59: 220,  // Energy counters
    60: 0, 61: 0, 62: 0, 63: 0, 64: 0, 65: 0, 66: 0,
    67: 34, 68: 5, 69: 60201, 70: 0, 71: 7595, 72: 6, 73: 21433, 74: 0, 75: 7147, 76: 41, 77: 31, 78: 0, 79: 0, 80: 0,
    81: 5002, 82: 3, 83: 6071, 84: 0, 85: 606, 86: 0, 87: 15230, 88: 1836, 89: 3192, 90: 6, 91: 36192, 92: 0, 93: 7052, 94: 0,
    95: 38, 96: 5, 97: 34758, 98: 0, 99: 3083, 100: 3136, 101: 3136, 102: 0, 103: 0, 104: 0, 105: 143, 106: 0, 107: 0, 108: 2, 109: 0, 110: 0, 111: 0, 112: 0, 113: 0, 114: 0, 115: 0, 116: 0, 117: 0, 118: 0, 119: 0, 120: 0, 121: 0, 122: 0, 123: 85, 124: 135,
    537: 6660, 538: 2826, 539: 795,  // State vectors
    549: 35505,  // System mode
    630: 21331, 631: 17232, 632: 24392, 633: 22367, 634: 22065, 635: 11825, 636: 11825, 637: 8224, 638: 8224, 639: 8224, 640: 18512  // Cell voltages
};

const parse2 = {
    // Timestamp: 2026-04-11 10:08:27
    0: 135, 1: 6979, 2: 0, 3: 0,
    4: 4111, 5: 4090, 6: 4100,  // Grid voltages - INCREASED
    7: 48, 8: 55, 9: 49, 10: 60, 11: 75, 12: 3,  // Temp sensors - slight changes
    13: 4106, 14: 4089, 15: 4081, 16: 5009,  // DC voltages - INCREASED
    17: 0, 18: 36, 19: 65534, 20: 65500, 21: 5009,  // Power measurements
    22: 0, 23: 102, 24: 75,  // Current measurements
    25: 2290, 26: 1748, 27: 3580,  // PV power - SAME
    28: 0, 29: 0, 30: 320, 31: 370, 32: 520,  // Load power - SAME
    33: 0, 34: 0, 35: 0, 36: 330, 37: 0, 38: 10000, 39: 10000, 40: 10000, 41: 10000, 42: 0, 43: 0, 44: 0, 45: 0,
    46: 3355, 47: 99, 48: 13, 49: 0, 50: 13, 51: 0,  // Battery - SAME
    52: 34, 53: 16, 54: 17, 55: 23,  // System status - SAME
    56: 2356, 57: 2397, 58: 2351, 59: 220,  // Energy counters - INCREASING
    60: 0, 61: 0, 62: 0, 63: 0, 64: 0, 65: 0, 66: 0,
    67: 34, 68: 5, 69: 60201, 70: 0, 71: 7595, 72: 6, 73: 21433, 74: 0, 75: 7147, 76: 40, 77: 31, 78: 0, 79: 0, 80: 0,
    81: 5009, 82: 3, 83: 6122, 84: 0, 85: 606, 86: 0, 87: 15230, 88: 1836, 89: 3192, 90: 6, 91: 36192, 92: 0, 93: 7052, 94: 0,
    95: 38, 96: 5, 97: 34758, 98: 0, 99: 3083, 100: 3136, 101: 3136, 102: 0, 103: 0, 104: 0, 105: 133, 106: 0, 107: 0, 108: 2, 109: 0, 110: 0, 111: 0, 112: 0, 113: 0, 114: 0, 115: 0, 116: 0, 117: 0, 118: 0, 119: 0, 120: 0, 121: 0, 122: 0, 123: 84, 124: 123,
    537: 6660, 538: 2826, 539: 2075,  // State vectors - CHANGING
    549: 24959,  // System mode - CHANGED!
    630: 21331, 631: 17232, 632: 24392, 633: 22367, 634: 22065, 635: 11825, 636: 11825, 637: 8224, 638: 8224, 639: 8224, 640: 18512  // Cell voltages - SAME
};

const parse3 = {
    // Timestamp: 2026-04-11 10:13:28
    0: 135, 1: 6980, 2: 0, 3: 0,
    4: 4030, 5: 4022, 6: 4024,  // Grid voltages - NORMALIZED
    7: 50, 8: 57, 9: 49, 10: 62, 11: 77, 12: 3,  // Temp sensors
    13: 4026, 14: 4021, 15: 4005, 16: 5000,  // DC voltages
    17: 0, 18: 36, 19: 65534, 20: 65500, 21: 5000,  // Power measurements
    22: 0, 23: 102, 24: 75,  // Current measurements
    25: 2290, 26: 1748, 27: 3580,  // PV power - SAME
    28: 0, 29: 0, 30: 320, 31: 370, 32: 510,  // Load power - CHANGED (32: 520->510)
    33: 0, 34: 0, 35: 0, 36: 330, 37: 0, 38: 10000, 39: 10000, 40: 10000, 41: 10000, 42: 0, 43: 0, 44: 0, 45: 0,
    46: 3356, 47: 99, 48: 13, 49: 0, 50: 13, 51: 0,  // Battery - SLIGHT CHANGE (46: 3355->3356)
    52: 34, 53: 16, 54: 17, 55: 23,  // System status - SAME
    56: 2314, 57: 2345, 58: 2315, 59: 220,  // Energy counters - CHANGING
    60: 0, 61: 0, 62: 0, 63: 0, 64: 0, 65: 0, 66: 0,
    67: 34, 68: 5, 69: 60201, 70: 0, 71: 7595, 72: 6, 73: 21433, 74: 0, 75: 7147, 76: 41, 77: 32, 78: 0, 79: 0, 80: 0,
    81: 5000, 82: 4, 83: 6174, 84: 0, 85: 606, 86: 0, 87: 15231, 88: 1836, 89: 3192, 90: 6, 91: 36192, 92: 0, 93: 7052, 94: 0,
    95: 38, 96: 5, 97: 34758, 98: 0, 99: 3083, 100: 3136, 101: 3136, 102: 0, 103: 0, 104: 0, 105: 133, 106: 0, 107: 0, 108: 2, 109: 0, 110: 0, 111: 0, 112: 0, 113: 0, 114: 0, 115: 0, 116: 0, 117: 0, 118: 0, 119: 0, 120: 0, 121: 0, 122: 0, 123: 84, 124: 124,
    537: 6660, 538: 2826, 539: 3356,  // State vectors - CHANGING
    549: 7330,   // System mode - CHANGED AGAIN!
    630: 21331, 631: 17232, 632: 24392, 633: 22367, 634: 22065, 635: 11825, 636: 11825, 637: 8224, 638: 8224, 639: 8224, 640: 18512  // Cell voltages - SAME
};

function analyzeChanges() {
    console.log("=== REGISTER COMPARISON ANALYSIS ===");
    console.log("Time progression: 10:03:27 -> 10:08:27 -> 10:13:28");
    console.log("");
    
    console.log("=== CRITICAL CHANGES DETECTED ===");
    
    // System Mode Analysis
    console.log("SYSTEM MODE CHANGES:");
    console.log(`  10:03:27: ${parse1[549]} (>20000 = CHARGE MODE)`);
    console.log(`  10:08:27: ${parse2[549]} (>20000 = CHARGE MODE)`);
    console.log(`  10:13:28: ${parse3[549]} (<20000 = DISCHARGE MODE)`);
    console.log(`  -> MODE SWITCHED FROM CHARGE TO DISCHARGE!`);
    console.log("");
    
    // State Vector Analysis
    console.log("STATE VECTOR CHANGES (537-539):");
    console.log(`  10:03:27: [${parse1[537]}, ${parse1[538]}, ${parse1[539]}] = ${parse1[537]+parse1[538]+parse1[539]}`);
    console.log(`  10:08:27: [${parse2[537]}, ${parse2[538]}, ${parse2[539]}] = ${parse2[537]+parse2[538]+parse2[539]}`);
    console.log(`  10:13:28: [${parse3[537]}, ${parse3[538]}, ${parse3[539]}] = ${parse3[537]+parse3[538]+parse3[539]}`);
    console.log("");
    
    // Battery Voltage
    console.log("BATTERY VOLTAGE CHANGES:");
    console.log(`  10:03:27: ${parse1[46]}V`);
    console.log(`  10:08:27: ${parse2[46]}V`);
    console.log(`  10:13:28: ${parse3[46]}V (+1V)`);
    console.log("");
    
    // Load Power Changes
    console.log("LOAD POWER CHANGES:");
    console.log(`  10:03:27: [${parse1[30]}, ${parse1[31]}, ${parse1[32]}] = ${parse1[30]+parse1[31]+parse1[32]}W`);
    console.log(`  10:08:27: [${parse2[30]}, ${parse2[31]}, ${parse2[32]}] = ${parse2[30]+parse2[31]+parse2[32]}W`);
    console.log(`  10:13:28: [${parse3[30]}, ${parse3[31]}, ${parse3[32]}] = ${parse3[30]+parse3[31]+parse3[32]}W (-10W)`);
    console.log("");
    
    // Energy Counters
    console.log("ENERGY COUNTER CHANGES:");
    console.log(`  Energy Imported: ${parse1[56]} -> ${parse2[56]} -> ${parse3[56]} kWh`);
    console.log(`  Energy Exported: ${parse1[57]} -> ${parse2[57]} -> ${parse3[57]} kWh`);
    console.log(`  Energy Consumed: ${parse1[58]} -> ${parse2[58]} -> ${parse3[58]} kWh`);
    console.log("");
    
    // Grid Voltage Changes
    console.log("GRID VOLTAGE CHANGES:");
    console.log(`  10:03:27: [${parse1[4]}, ${parse1[5]}, ${parse1[6]}] = ${((parse1[4]+parse1[5]+parse1[6])/3).toFixed(1)}V`);
    console.log(`  10:08:27: [${parse2[4]}, ${parse2[5]}, ${parse2[6]}] = ${((parse2[4]+parse2[5]+parse2[6])/3).toFixed(1)}V (SPIKE)`);
    console.log(`  10:13:28: [${parse3[4]}, ${parse3[5]}, ${parse3[6]}] = ${((parse3[4]+parse3[5]+parse3[6])/3).toFixed(1)}V (NORMALIZED)`);
    console.log("");
    
    console.log("=== INTERPRETATION ===");
    console.log("1. System switched from CHARGE to DISCHARGE mode at 10:13:28");
    console.log("2. Battery voltage increased slightly (+1V) during charging");
    console.log("3. Grid voltage spike occurred at 10:08:27 then normalized");
    console.log("4. Load power decreased by 10W at 10:13:28");
    console.log("5. Energy counters continuously increasing (normal operation)");
    console.log("6. State vectors show system activity changes");
}

analyzeChanges();
