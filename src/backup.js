/**
 * FULL CODE GIẢI MÃ DỮ LIỆU ATESS/GROWATT
 * Protocol: ATESS Data Service Protocol (Function 0x24)
 * Register Map: Modbus RTU V3.30
 */

const rawHex = "00010007031f01240c2b274727404677432d7761747447726f7761747447726f7761747447722a2f29443273415f4427747447726f7761747447726f7761747447726f777b707f4d7174726174743b72f76c227474477260ea6ee37bd5725d77597445474f6f3b61777bdd7df878e167fe47726f539e8a8b9a61e5776174124739678567a079bb726f7761753446006d7f61747447726f762b74746062486746645357726f776174744772626c6117744a726f776c747447506f67616574507a997e747c8c47ae6f7761747447726f7761747447726f5561719f6e726f6aca747214cb6f777a9f746e72707761747447727cfd617763f0726f753f74747c0c685b6d0c7441ff0f77616ff847726f516171f381726f7b6a78344b326f776174744772e07761747447706f7761747447726f7761747447726f7761747447726f7761747447726f2261f3743a72967732747447726f7761577447726f7761747447726f7761747447726f776175f247726f7761757447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7663767647736e75416972457f6d7a0d788a47736f7761747447726c7761747447726f7763747447726f7761747447766f7761717447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f77617474477295764a747447729089617530aa726e7761747447726f7761747447726f7761747447726f7761747447726f24323724183a382837455a765c5e5741545467522727324544772d5d42513f3c112d2721522b27114341464f444518333f2741545467524f5741545445666d5261747447726f776174745d76647d626f744772e7764974a847ae6f7761747447726ffdd0762845f26f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f7761747447726f776127270422303f362b22765c5e5950545467524f572924c897";

function parseAtessData(hexString) {
    // 1. Chuyển đổi chuỗi Hex thành mảng Byte
    const bytes = [];
    for (let i = 0; i < hexString.length; i += 2) {
        bytes.push(parseInt(hexString.substr(i, 2), 16));
    }

    // 2. Tách Header (8 byte đầu)
    // 0001 (MsgID) 0007 (ProtoID) 031f (Len) 01 (UnitID) 24 (Function)
    const protocolHeader = bytes.slice(0, 8);
    const payload = bytes.slice(8);

    // 3. Giải mã XOR với Key "Growatt"
    const key = "Growatt";
    const decodedPayload = payload.map((byte, index) => {
        return byte ^ key.charCodeAt(index % key.length);
    });

    // 4. Trích xuất thông tin Header của Payload (15 byte đầu sau giải mã)
    const loggerSN = String.fromCharCode(...decodedPayload.slice(0, 10));
    const model = decodedPayload[10];
    
    // Dữ liệu thanh ghi bắt đầu từ byte thứ 15 của decodedPayload (Index 15)
    // Mỗi thanh ghi tương ứng với 2 byte
    const registers = decodedPayload.slice(15);

    function getRegValue(addr, length = 1) {
        let val = 0;
        for (let i = 0; i < length * 2; i++) {
            val = (val << 8) | registers[(addr * 2) + i];
        }
        return val;
    }

    // 5. Tra cứu Register Map (Theo Docs ATESS Modbus RTU 3.30)
    const result = {
        device_info: {
            logger_sn: loggerSN,
            model_code: model
        },
        data: {
            pv1_voltage: (getRegValue(0) * 0.1).toFixed(1) + " V",
            pv1_current: (getRegValue(1) * 0.1).toFixed(1) + " A",
            pv1_power: getRegValue(2, 2) + " W", // 32-bit (2 regs)
            
            p_bus_voltage: (getRegValue(34) * 0.1).toFixed(1) + " V",
            n_bus_voltage: (getRegValue(35) * 0.1).toFixed(1) + " V",
            
            output_power: getRegValue(38) + " W",
            grid_frequency: (getRegValue(40) * 0.01).toFixed(2) + " Hz",
            
            phase1_voltage: (getRegValue(41) * 0.1).toFixed(1) + " V",
            phase1_current: (getRegValue(42) * 0.1).toFixed(1) + " A",
            
            temperature: (getRegValue(93) * 0.1).toFixed(1) + " °C",
            operation_mode: getRegValue(192)
        }
    };

    return result;
}

// Chạy thử
const finalData = parseAtessData(rawHex);
console.log("--- KẾT QUẢ GIẢI MÃ ---");
console.log(JSON.stringify(finalData, null, 2));