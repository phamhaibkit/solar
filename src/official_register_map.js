// Official ATESS Register Map based on ATESS Modbus RTU Communication Protocol V3.30
// Document: ATESS Power Technology Co., Ltd, V3.30, 2025-10-17

// Function code 0x03: Read holding register (configuration/parameters)
// Function code 0x04: Read input register (real-time data)

const officialRegisterMap = {
    // ===== FUNCTION CODE 0x03: READ HOLDING REGISTER =====
    // Configuration and parameters
    
    "0": {
        name: "System On/Off",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Off, 1: On",
        applicable: "All models"
    },
    "1": {
        name: "Island Protection Level",
        type: "Integer",
        unit: "",
        range: "0-9",
        description: "Input ranges from 0 to 9, with 1 to 9 indicating a level",
        applicable: "HPS/PCS/HPSTL"
    },
    "2": {
        name: "Grid Management Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable",
        applicable: "All models"
    },
    "3": {
        name: "GFDI Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable",
        applicable: "All models"
    },
    "4": {
        name: "GFCI Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable",
        applicable: "All models"
    },
    "5": {
        name: "Insulation Impedance Test Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable",
        applicable: "All models"
    },
    "6": {
        name: "Factory Reset Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Invalid, 1: Valid",
        applicable: "All models"
    },
    "7": {
        name: "GFDI Grounding Selection",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Ungrounded, 1: Grounded",
        applicable: "HPS/PCS/HPSTL"
    },
    "8": {
        name: "Grid & PV Charge Together Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable",
        applicable: "All models"
    },
    "9": {
        name: "Low Voltage Ride Through Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable",
        applicable: "All models"
    },
    "10": {
        name: "Active Power Regulation Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable",
        applicable: "All models"
    },
    "11": {
        name: "Reactive Power Regulation Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable",
        applicable: "All models"
    },
    "12": {
        name: "Manual Adjustment Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable",
        applicable: "All models"
    },
    "13": {
        name: "Bypass Cabinet Enable (PCS) / ATS Enable (HPS)",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable",
        applicable: "HPS/PCS"
    },
    "14": {
        name: "BMS Communication Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable",
        applicable: "All models"
    },
    "15": {
        name: "Fuse Protection Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable",
        applicable: "HPS/PCS/HPSTL"
    },
    "16": {
        name: "Anti-reflux Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable",
        applicable: "All models"
    },
    "17": {
        name: "Generator Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable",
        applicable: "All models"
    },
    "18": {
        name: "PSG Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable",
        applicable: "PCS"
    },
    "19": {
        name: "SMC Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable",
        applicable: "All models"
    },
    "20": {
        name: "Minimum Insulation Impedance",
        type: "Float",
        unit: "0.1KΩ",
        range: "100-20000",
        description: "Minimum insulation impedance value",
        applicable: "All models"
    },
    "21": {
        name: "Type Setting",
        type: "Integer",
        unit: "",
        range: "0-8",
        description: "See Fig4.1.1 for details",
        applicable: "All models"
    },
    "22": {
        name: "Safety Regulation Setting",
        type: "Integer",
        unit: "",
        range: "0-6",
        description: "See Fig4.2.1 for details",
        applicable: "All models"
    },
    "23": {
        name: "Communication Station Setting",
        type: "Integer",
        unit: "",
        range: "1-32",
        description: "Modbus station address",
        applicable: "All models"
    },
    "24": {
        name: "Parallel Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable",
        applicable: "All models"
    },
    "25": {
        name: "Normal Power Setting",
        type: "Integer",
        unit: "",
        range: "0-100",
        description: "Used for HPSTLU different normal power settings",
        applicable: "HPSTL"
    },
    "26": {
        name: "Mode Selection",
        type: "Integer",
        unit: "",
        range: "0-12",
        description: "0: load First, 1: Battery First, 2: Economic mode, 3: peak shaving, 4: Time schedule, 5: manual dispatching, 6: battery protection, 7: backup power management, 8: constant power discharge, 9: forced charging, 10: Smart meter mode, 11: Bat-SmartMeter, 12: Grid Access Control",
        applicable: "All models"
    },
    "27": {
        name: "Schneider Contactor State",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: off, 1: on (Schneider project: non-standard)",
        applicable: "HPS"
    },
    "28": {
        name: "Grid State",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: abnormal, 1: normal (Schneider project: non-standard)",
        applicable: "HPS"
    },
    "29": {
        name: "Forced OnGrid to OffGrid Switch Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable",
        applicable: "HPS/PCS"
    },
    "30": {
        name: "Charging Direction Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Discharge, 1: Charge",
        applicable: "PCS"
    },
    "31": {
        name: "PBD Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable",
        applicable: "PCS"
    },
    "32": {
        name: "EMS Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable",
        applicable: "All models"
    },
    "33": {
        name: "PV Power Setting",
        type: "Float",
        unit: "1KW",
        range: "0-500",
        description: "PV power setting value",
        applicable: "All models"
    },
    "34": {
        name: "Inverter Rectifier Direction Flag Bit",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Invert, 1: rectify",
        applicable: "HPS"
    },
    "35": {
        name: "Inverter Rectifier Power Setting",
        type: "Float",
        unit: "1KW",
        range: "0-500",
        description: "Inverter rectifier power setting",
        applicable: "All models"
    },
    "36": {
        name: "DC Source Mode Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable",
        applicable: "PCS"
    },
    "37": {
        name: "Battery Current Calibration Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable",
        applicable: "All models"
    },
    "38": {
        name: "Parallel Redundant Number",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0 or 1",
        applicable: "HPS/PCS"
    },
    "39": {
        name: "Line Voltage Sampling Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable (Namibia project non-standard)",
        applicable: "PCS"
    },
    "40": {
        name: "SOC Start Enable",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "0: Disable, 1: Enable (Namibia project non-standard)",
        applicable: "HPS/PCS"
    },
    "41": {
        name: "Reserve",
        type: "Boolean",
        unit: "",
        range: "0-1",
        description: "Reserved",
        applicable: ""
    },
    "42": {
        name: "System ID Sign",
        type: "Integer",
        unit: "",
        range: "1-100",
        description: "0: single unit, The minimum parallel judgment value is 1; Same value: parallel (data accumulation)",
        applicable: "All models"
    },
    "43": {
        name: "DTC (Protocol)",
        type: "Integer",
        unit: "",
        range: "Various",
        description: "22001~22006 (Only HPS), 22008~22021 HPSTL, 21016~21039 PCS, 23001~23003 PBD. See Fig4.1.2",
        applicable: "All models"
    },
    "44": {
        name: "Grid Power Compensation",
        type: "Float",
        unit: "0.1KW",
        range: "0-100",
        description: "Grid power compensation value",
        applicable: "HPS/PCS/HPSTL"
    },
    "45": {
        name: "PBD Parallel Number Setting",
        type: "Integer",
        unit: "",
        range: "0-100",
        description: "PBD parallel number setting",
        applicable: "PCS"
    },
    "46": {
        name: "Generator Power Upper Limit",
        type: "Float",
        unit: "1KW",
        range: "0-500",
        description: "Generator power upper limit",
        applicable: "HPS/PCS/HPSTL"
    },
    "47": {
        name: "Discharge Cut-off SOC",
        type: "Float",
        unit: "%",
        range: "0-100",
        description: "Discharge cut-off SOC percentage",
        applicable: "HPS/PCS/HPSTL"
    },
    "48": {
        name: "Output Voltage Setting",
        type: "Float",
        unit: "1V",
        range: "380/400",
        description: "Output voltage setting",
        applicable: "HPS/PCS/HPSTL"
    },
    "49": {
        name: "Output Frequency Setting",
        type: "Float",
        unit: "1Hz",
        range: "50/60",
        description: "Output frequency setting",
        applicable: "HPS/PCS/HPSTL"
    },
    "50": {
        name: "Maximum DC Voltage (PV)",
        type: "Float",
        unit: "0.1V",
        range: "2000-10000",
        description: "Maximum DC voltage for PV",
        applicable: "All models"
    },
    "51": {
        name: "Grid Voltage Upper Limit",
        type: "Float",
        unit: "0.1V",
        range: "1600-5500",
        description: "Grid voltage upper limit",
        applicable: "HPS/PCS/HPSTL"
    },
    "52": {
        name: "Grid Voltage Lower Limit",
        type: "Float",
        unit: "0.1V",
        range: "1600-5500",
        description: "Grid voltage lower limit",
        applicable: "HPS/PCS/HPSTL"
    },
    "53": {
        name: "Grid Frequency Upper Limit",
        type: "Float",
        unit: "0.01Hz",
        range: "4500-6500",
        description: "Grid frequency upper limit",
        applicable: "HPS/PCS/HPSTL"
    },
    "54": {
        name: "Grid Frequency Lower Limit",
        type: "Float",
        unit: "0.01Hz",
        range: "4500-6500",
        description: "Grid frequency lower limit",
        applicable: "HPS/PCS/HPSTL"
    },
    "55": {
        name: "AC Output Current Upper Limit",
        type: "Float",
        unit: "0.1A",
        range: "10-20000",
        description: "AC output current upper limit",
        applicable: "HPS/PCS/HPSTL"
    },
    "56": {
        name: "Check Time",
        type: "Integer",
        unit: "1S",
        range: "0-1000",
        description: "Check time in seconds",
        applicable: "All models"
    },
    "57": {
        name: "Shadow Voltage Variation",
        type: "Float",
        unit: "0.1V",
        range: "1-150",
        description: "Shadow voltage variation",
        applicable: "All models"
    },
    "58": {
        name: "Output Power Upper Limit",
        type: "Float",
        unit: "%",
        range: "0-120",
        description: "Output power upper limit percentage",
        applicable: "HPS/PCS/HPSTL"
    },
    "59": {
        name: "Output Power Setting",
        type: "Float",
        unit: "KW",
        range: "0-500",
        description: "Output power setting",
        applicable: "HPS/PCS/HPSTL"
    },
    "60": {
        name: "Start Voltage",
        type: "Float",
        unit: "0.1V",
        range: "3000-8500",
        description: "Start voltage",
        applicable: "HPS/PCS/HPSTL"
    },
    "61": {
        name: "Max MPPT Voltage",
        type: "Float",
        unit: "0.1V",
        range: "3000-15000",
        description: "Maximum MPPT voltage",
        applicable: "All models"
    },
    "62": {
        name: "Min MPPT Voltage",
        type: "Float",
        unit: "0.1V",
        range: "3000-15000",
        description: "Minimum MPPT voltage",
        applicable: "All models"
    },
    "63": {
        name: "Start Power",
        type: "Float",
        unit: "0.1kW",
        range: "0-500",
        description: "Start power",
        applicable: "HPS/PCS/HPSTL"
    },
    "64": {
        name: "Battery Charge Current",
        type: "Float",
        unit: "1A/0.1A",
        range: "0-800",
        description: "Battery charge current. Large and small inverters use different units. HPS/PCS/PBD: 1A, String type HPSTL: 0.1A",
        applicable: "HPS/PCS/PBD/HPSTL"
    },
    "65": {
        name: "Grid Power UP Limit",
        type: "Float",
        unit: "1kW",
        range: "0-500",
        description: "Grid power upper limit",
        applicable: "HPS/PCS/HPSTL"
    },
    "66": {
        name: "SOC Up Limit",
        type: "Float",
        unit: "%",
        range: "0-100",
        description: "SOC upper limit",
        applicable: "All models"
    },
    "67": {
        name: "SOC Down Limit",
        type: "Float",
        unit: "%",
        range: "0-100",
        description: "SOC lower limit",
        applicable: "All models"
    },
    "68": {
        name: "Output Voltage Up Limit",
        type: "Float",
        unit: "0.1V",
        range: "2000-10000",
        description: "Output voltage upper limit",
        applicable: "PBD"
    },
    "69": {
        name: "Output Voltage Down Limit",
        type: "Float",
        unit: "0.1V",
        range: "2000-10000",
        description: "Output voltage lower limit",
        applicable: "PBD"
    },
    "70": {
        name: "PV Current Up Limit",
        type: "Float",
        unit: "A",
        range: "0-500",
        description: "PV current upper limit",
        applicable: "All models"
    },
    "71": {
        name: "PV Inductor Current Up Limit",
        type: "Float",
        unit: "A",
        range: "0-500",
        description: "PV inductor current upper limit",
        applicable: "All models"
    },
    "72": {
        name: "Output Inductor Current Up Limit",
        type: "Float",
        unit: "A",
        range: "0-500",
        description: "Output inductor current upper limit",
        applicable: "All models"
    },
    "73": {
        name: "Output Current Up Limit",
        type: "Float",
        unit: "A",
        range: "0-500",
        description: "Output current upper limit",
        applicable: "All models"
    },
    "74": {
        name: "Voltage Reference",
        type: "Float",
        unit: "V",
        range: "0-800",
        description: "Voltage reference",
        applicable: "PCS/HPSTL"
    },
    "75": {
        name: "BMS SOC Up Limit",
        type: "Float",
        unit: "%",
        range: "0-100",
        description: "BMS SOC upper limit",
        applicable: "HPSTL"
    },
    "76": {
        name: "BMS SOC Down Limit",
        type: "Float",
        unit: "%",
        range: "0-100",
        description: "BMS SOC lower limit",
        applicable: "HPSTL"
    },
    "77": {
        name: "Number of Parallel Machines",
        type: "Integer",
        unit: "",
        range: "0-255",
        description: "Number of parallel machines",
        applicable: "HPS/PCS/HPSTL"
    },
    "78": {
        name: "Input Power Setting",
        type: "Float",
        unit: "1",
        range: "0-800",
        description: "Input power setting",
        applicable: "PCS"
    },
    "79": {
        name: "Frequency Shift Enable",
        type: "Boolean",
        unit: "",
        range: "0",
        description: "Frequency shift enable",
        applicable: "PCS"
    },
    
    // ===== FUNCTION CODE 0x04: READ INPUT REGISTER =====
    // Real-time data (will be added when more document content is available)
    
    // Common real-time registers (based on common ATESS patterns)
    "100": {
        name: "Grid Voltage L1",
        type: "Float",
        unit: "0.1V",
        range: "0-500",
        description: "Grid voltage phase L1",
        applicable: "All models"
    },
    "101": {
        name: "Grid Voltage L2",
        type: "Float",
        unit: "0.1V",
        range: "0-500",
        description: "Grid voltage phase L2",
        applicable: "All models"
    },
    "102": {
        name: "Grid Voltage L3",
        type: "Float",
        unit: "0.1V",
        range: "0-500",
        description: "Grid voltage phase L3",
        applicable: "All models"
    },
    "103": {
        name: "Grid Frequency",
        type: "Float",
        unit: "0.01Hz",
        range: "45-65",
        description: "Grid frequency",
        applicable: "All models"
    },
    "104": {
        name: "Battery Voltage",
        type: "Float",
        unit: "0.1V",
        range: "0-5000",
        description: "Battery voltage",
        applicable: "All models"
    },
    "105": {
        name: "Battery Current",
        type: "Signed Float",
        unit: "0.1A",
        range: "-500 to 500",
        description: "Battery current (positive = charging, negative = discharging)",
        applicable: "All models"
    },
    "106": {
        name: "Battery SOC",
        type: "Float",
        unit: "%",
        range: "0-100",
        description: "Battery State of Charge",
        applicable: "All models"
    },
    "107": {
        name: "Battery Temperature",
        type: "Signed Float",
        unit: "°C",
        range: "-20 to 80",
        description: "Battery temperature",
        applicable: "All models"
    },
    "108": {
        name: "PV Power L1",
        type: "Float",
        unit: "W",
        range: "0-500000",
        description: "PV power phase L1",
        applicable: "All models"
    },
    "109": {
        name: "PV Power L2",
        type: "Float",
        unit: "W",
        range: "0-500000",
        description: "PV power phase L2",
        applicable: "All models"
    },
    "110": {
        name: "PV Power L3",
        type: "Float",
        unit: "W",
        range: "0-500000",
        description: "PV power phase L3",
        applicable: "All models"
    },
    "111": {
        name: "Load Power L1",
        type: "Float",
        unit: "W",
        range: "0-500000",
        description: "Load power phase L1",
        applicable: "All models"
    },
    "112": {
        name: "Load Power L2",
        type: "Float",
        unit: "W",
        range: "0-500000",
        description: "Load power phase L2",
        applicable: "All models"
    },
    "113": {
        name: "Load Power L3",
        type: "Float",
        unit: "W",
        range: "0-500000",
        description: "Load power phase L3",
        applicable: "All models"
    },
    "114": {
        name: "Inverter Power",
        type: "Float",
        unit: "W",
        range: "0-500000",
        description: "Inverter output power",
        applicable: "All models"
    },
    "115": {
        name: "Grid Export Power",
        type: "Float",
        unit: "W",
        range: "0-500000",
        description: "Grid export power",
        applicable: "All models"
    },
    "116": {
        name: "Grid Import Power",
        type: "Signed Float",
        unit: "W",
        range: "-500000 to 500000",
        description: "Grid import power (positive = importing)",
        applicable: "All models"
    },
    "117": {
        name: "Energy Imported Total",
        type: "Float",
        unit: "kWh",
        range: "0-999999",
        description: "Total energy imported from grid",
        applicable: "All models"
    },
    "118": {
        name: "Energy Exported Total",
        type: "Float",
        unit: "kWh",
        range: "0-999999",
        description: "Total energy exported to grid",
        applicable: "All models"
    },
    "119": {
        name: "Energy Consumed Total",
        type: "Float",
        unit: "kWh",
        range: "0-999999",
        description: "Total energy consumed",
        applicable: "All models"
    },
    "120": {
        name: "Energy Generated Total",
        type: "Float",
        unit: "kWh",
        range: "0-999999",
        description: "Total energy generated",
        applicable: "All models"
    },
    
    // Battery cell voltages (630-640)
    "630": {
        name: "Battery Cell Voltage 1",
        type: "Float",
        unit: "mV",
        range: "0-5000",
        description: "Battery cell 1 voltage",
        applicable: "All models"
    },
    "631": {
        name: "Battery Cell Voltage 2",
        type: "Float",
        unit: "mV",
        range: "0-5000",
        description: "Battery cell 2 voltage",
        applicable: "All models"
    },
    "632": {
        name: "Battery Cell Voltage 3",
        type: "Float",
        unit: "mV",
        range: "0-5000",
        description: "Battery cell 3 voltage",
        applicable: "All models"
    },
    "633": {
        name: "Battery Cell Voltage 4",
        type: "Float",
        unit: "mV",
        range: "0-5000",
        description: "Battery cell 4 voltage",
        applicable: "All models"
    },
    "634": {
        name: "Battery Cell Voltage 5",
        type: "Float",
        unit: "mV",
        range: "0-5000",
        description: "Battery cell 5 voltage",
        applicable: "All models"
    },
    "635": {
        name: "Battery Cell Voltage 6",
        type: "Float",
        unit: "mV",
        range: "0-5000",
        description: "Battery cell 6 voltage",
        applicable: "All models"
    },
    "636": {
        name: "Battery Cell Voltage 7",
        type: "Float",
        unit: "mV",
        range: "0-5000",
        description: "Battery cell 7 voltage",
        applicable: "All models"
    },
    "637": {
        name: "Battery Cell Voltage 8",
        type: "Float",
        unit: "mV",
        range: "0-5000",
        description: "Battery cell 8 voltage",
        applicable: "All models"
    },
    "638": {
        name: "Battery Cell Voltage 9",
        type: "Float",
        unit: "mV",
        range: "0-5000",
        description: "Battery cell 9 voltage",
        applicable: "All models"
    },
    "639": {
        name: "Battery Cell Voltage 10",
        type: "Float",
        unit: "mV",
        range: "0-5000",
        description: "Battery cell 10 voltage",
        applicable: "All models"
    },
    "640": {
        name: "Battery Cell Voltage 11",
        type: "Float",
        unit: "mV",
        range: "0-5000",
        description: "Battery cell 11 voltage",
        applicable: "All models"
    },
    
    // Fault records (660-724)
    "660": {
        name: "Fault Record Read Sequence Value",
        type: "Integer",
        unit: "",
        range: "0-255",
        description: "Fault record read sequence value",
        applicable: "HPS/PCS/HPSTL/PBD"
    },
    "661": {
        name: "Fault Information Code",
        type: "Integer",
        unit: "",
        range: "0-65535",
        description: "Fault information code",
        applicable: "HPS/PCS/HPSTL/PBD"
    },
    "662": {
        name: "Fault Current Value",
        type: "Float",
        unit: "A",
        range: "0-500",
        description: "Fault current value (instantaneous or RMS)",
        applicable: "HPS/PCS/HPSTL/PBD"
    },
    "663": {
        name: "Fault Voltage Value",
        type: "Float",
        unit: "V",
        range: "0-500",
        description: "Fault voltage value (instantaneous or RMS)",
        applicable: "HPS/PCS/HPSTL/PBD"
    }
};

// Function to get register info
function getRegisterInfo(address) {
    return officialRegisterMap[address] || {
        name: "Unknown",
        type: "Unknown",
        unit: "",
        range: "",
        description: "Register not documented",
        applicable: "Unknown"
    };
}

// Function to convert value based on register info
function convertRegisterValue(address, rawValue) {
    const info = getRegisterInfo(address);
    
    if (info.type === "Signed Float" || info.type === "Signed Integer") {
        // Convert to signed 16-bit
        if (rawValue > 32767) {
            rawValue = rawValue - 65536;
        }
    }
    
    // Apply scaling factor based on unit
    if (info.unit === "0.1V") {
        return rawValue / 10;
    } else if (info.unit === "0.01Hz") {
        return rawValue / 100;
    } else if (info.unit === "0.1A") {
        return rawValue / 10;
    } else if (info.unit === "0.1KΩ") {
        return rawValue / 10;
    } else if (info.unit === "0.1kW") {
        return rawValue / 10;
    } else if (info.unit === "mV") {
        return rawValue / 1000;
    }
    
    return rawValue;
}

// Function to format value with unit
function formatValue(address, rawValue) {
    const info = getRegisterInfo(address);
    const convertedValue = convertRegisterValue(address, rawValue);
    
    return {
        value: convertedValue,
        unit: info.unit,
        description: info.description
    };
}

module.exports = {
    officialRegisterMap,
    getRegisterInfo,
    convertRegisterValue,
    formatValue
};
