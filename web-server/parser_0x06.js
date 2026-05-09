// parser_0x06.js

const XOR_KEY = Buffer.from("Growatt");

/**
 * XOR decrypt
 */
function xorDecrypt(buffer, key) {
  const out = Buffer.alloc(buffer.length);

  for (let i = 0; i < buffer.length; i++) {
    out[i] = buffer[i] ^ key[i % key.length];
  }

  return out;
}

/**
 * Parse ATESS/Growatt Function 0x06 packet
 *
 * Packet structure:
 *
 * Transaction ID   2 bytes
 * Protocol ID      2 bytes
 * Data Length      2 bytes
 * Device Address   1 byte
 * Function Code    1 byte
 * Logger SN        30 bytes (XOR encrypted)
 * Register Addr    2 bytes  (XOR encrypted)
 * Set Data         2 bytes  (XOR encrypted)
 * CRC              2 bytes
 *
 * XOR ONLY applies to:
 * LoggerSN + RegisterAddress + SetData
 */
function parseFunction06(rawHex) {
  const buf = Buffer.from(rawHex, "hex");

  // =========================
  // Header
  // =========================

  const transactionId = buf.readUInt16BE(0);
  const protocolId = buf.readUInt16BE(2);
  const dataLength = buf.readUInt16BE(4);

  // =========================
  // Fixed fields
  // =========================

  const deviceAddress = buf.readUInt8(6);
  const functionCode = buf.readUInt8(7);

  // =========================
  // CRC (last 2 bytes)
  // =========================

  const crc = buf.subarray(buf.length - 2);

  // =========================
  // Encrypted payload
  // =========================
  // starts after:
  // 6-byte header
  // + device address
  // + function code
  //
  // ends before CRC
  // =========================

  const encryptedPayload = buf.subarray(8, buf.length - 2);

  // Must be:
  // LoggerSN(30) + Register(2) + SetData(2)
  // = 34 bytes

  if (encryptedPayload.length !== 34) {
    throw new Error(
      `Invalid encrypted payload length: ${encryptedPayload.length}`
    );
  }

  // =========================
  // XOR decrypt
  // =========================

  const decrypted = xorDecrypt(encryptedPayload, XOR_KEY);

  // =========================
  // Parse decrypted fields
  // =========================

  const loggerSN = decrypted
    .subarray(0, 30)
    .toString("ascii")
    .replace(/\0/g, "");

  const registerAddress = decrypted.readUInt16BE(30);

  const setData = decrypted.readUInt16BE(32);

  return {
    header: {
      transactionId,
      protocolId,
      dataLength,
      deviceAddress,
    },

    functionCode,

    loggerSN,

    registerAddress,

    setData,

    crc: crc.toString("hex"),

    encryptedHex: encryptedPayload.toString("hex"),

    decryptedHex: decrypted.toString("hex"),
  };
}

// =====================================================
// TEST
// =====================================================

const raw =
  "00010007002401060c2b274727404677432d7761747447726f7761747447726f7761747447726f4471b887cd";

const result = parseFunction06(raw);

console.log(JSON.stringify(result, null, 2));

module.exports = {
  parseFunction06
};