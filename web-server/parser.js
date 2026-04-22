function readString(buf, start, len) {
  return buf
    .slice(start, start + len)
    .toString("ascii")
    .replace(/\0/g, "")
    .trim();
}

function xorDecode(buffer) {
  const key = Buffer.from("Growatt");
  const out = Buffer.alloc(buffer.length);

  for (let i = 0; i < buffer.length; i++) {
    out[i] = buffer[i] ^ key[i % key.length];
  }

  return out;
}

function parsePacket(hex, debug = false) {
  const raw = Buffer.from(hex, "hex");

  const body = raw.slice(7);

  if (body[0] !== 0x24) {
    throw new Error("Invalid packet header (not 0x24)");
  }

  const decoded = xorDecode(body.slice(1));

  let offset = 0;

  // ===== HEADER =====
  const loggerSN = readString(decoded, offset, 30);
  offset += 30;

  const deviceSN = readString(decoded, offset, 30);
  offset += 30;

  // ===== TIMESTAMP (NEW) =====
  const timestampBytes = decoded.slice(offset, offset + 6);
  offset += 6;

  const timestamp = {
    year: timestampBytes.readUInt8(0) + 2000,
    month: timestampBytes.readUInt8(1),
    day: timestampBytes.readUInt8(2),
    hour: timestampBytes.readUInt8(3),
    minute: timestampBytes.readUInt8(4),
    second: timestampBytes.readUInt8(5)
  };

  // ===== SEGMENT COUNT =====
  const segmentCount = decoded.readUInt8(offset);
  offset += 1;

  const segments = [];

  const registerMap = {};

  // ===== SEGMENTS =====
  for (let i = 0; i < segmentCount; i++) {
    if (offset + 4 > decoded.length) break;

    const startReg = decoded.readUInt16BE(offset);
    const endReg = decoded.readUInt16BE(offset + 2);
    offset += 4;

    const regCount = Math.max(0, endReg - startReg + 1);
    const maxRegs = Math.floor((decoded.length - offset) / 2);
    const len = Math.min(regCount, maxRegs);

    const segmentData = [];

    for (let j = 0; j < len; j++) {
      const value = decoded.readUInt16BE(offset);
      offset += 2;

      registerMap[startReg + j] = value;
      segmentData.push(value);
    }

    // ===== STORE FULL SEGMENT (NEW) =====
    segments.push({
      index: i,
      startReg,
      endReg,
      length: len,
      data: segmentData
    });
  }

  return {
    loggerSN,
    deviceSN,
    timestamp: JSON.stringify(timestamp),          // ✅ NEW
    segmentCount,
    segments,           // ✅ NEW (raw structure)
    registerMap
  };
}

module.exports = { parsePacket };
