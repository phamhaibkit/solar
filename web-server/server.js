const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const net = require('net');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import parser functions from proxy folder
const { parsePacket } = require('./parser');
const { extractMeaningfulFields } = require('./export_meaningful_fields');

// Import database functions
const {
  initDatabase,
  saveRawDataToDatabase,
  saveToDatabase,
  getLatestData,
  getHistoryData,
  getRawData
} = require('./database');

const app = express();
const server = http.createServer(app);
const WEB_PORT = process.env.WEB_PORT || 3001;
const TCP_DATA_PORT = 3003; // Single port for both collector and web server data

console.log(`🔍 HTTP PORT: ${WEB_PORT}`);
console.log(`🔍 TCP DATA PORT: ${TCP_DATA_PORT}`);

// WebSocket Server
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const path = require('path');
const distPath = path.join(__dirname, 'dashboard/dist');
const publicPath = path.join(__dirname, 'public');
console.log('📁 Serving static files from:', distPath);
app.use(express.static(distPath));
app.use(express.static(publicPath)); // Fallback to old public folder

// Store latest data in memory
let latestData = {
  pv: { daily: 0, total: 0, dailyUnit: 'kWh', totalUnit: 'MWh', label: 'Generated energy of PV' },
  load: { daily: 0, total: 0, dailyUnit: 'kWh', totalUnit: 'kWh', label: 'Consumption of load' },
  battery: { charge: 0, discharge: 0, unit: 'kWh', label: 'Battery charge/discharge' },
  grid: { import: { daily: 0, total: 0 }, export: { daily: 0, total: 0 }, dailyUnit: 'kWh', totalUnit: 'MWh', label: 'Import from grid / Export to grid' },
  gen: { daily: 0, total: 0, dailyUnit: 'kWh', totalUnit: 'MWh', label: 'GEN Energy' },
  timestamp: new Date().toISOString(),
  device: { loggerSN: '', deviceSN: '' }
};

// Broadcast data to all WebSocket clients
function broadcastData(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// API endpoint to receive raw data from proxy
app.post('/api/raw-data', async (req, res) => {
  try {
    const { source, data, timestamp } = req.body;
    console.log('📊 Received raw data:', new Date().toISOString(), '[Source:', source, ']');
    
    // Save raw data to database first
    await saveRawDataToDatabase(source || 'UNKNOWN', data);
    
    // Try to parse - only save to atess_data if parsing succeeds (contains 0x24)
    try {
      const parsedData = parsePacket(data);
      const meaningfulData = extractMeaningfulFields(parsedData);
      
      // Update latest data
      latestData = {
        ...meaningfulData,
        timestamp: timestamp || new Date().toISOString()
      };
      
      // Save parsed data to database
      await saveToDatabase(meaningfulData);
      
      // Broadcast to WebSocket clients
      broadcastData(latestData);
      
      res.json({ success: true, message: 'Raw data received and processed' });
    } catch (parseError) {
      console.log('⚠️  Invalid packet (no 0x24), skipping parse and save to atess_data');
      res.json({ success: true, message: 'Raw data saved (invalid packet, skipped parse)' });
    }
  } catch (error) {
    console.error('❌ Error processing raw data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint to receive data from proxy (legacy)
app.post('/api/data', async (req, res) => {
  try {
    const data = req.body;
    console.log('📊 Received data:', new Date().toISOString());
    
    // Update latest data
    latestData = {
      ...data,
      timestamp: new Date().toISOString()
    };
    
    // Save to database
    await saveToDatabase(data);
    
    // Broadcast to WebSocket clients
    broadcastData(latestData);
    
    res.json({ success: true, message: 'Data received and processed' });
  } catch (error) {
    console.error('❌ Error processing data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint to get latest data
app.get('/api/data', async (req, res) => {
  try {
    const data = await getLatestData();
    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching latest data:', error);
    res.json(latestData); // Fallback to memory if database fails
  }
});

// API endpoint to get historical data from TimescaleDB
app.get('/api/history', async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const data = await getHistoryData(hours);
    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching historical data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint to get raw data
app.get('/api/raw-data', async (req, res) => {
  try {
    const { source, limit = 100 } = req.query;
    const data = await getRawData(source, parseInt(limit));
    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching raw data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('🔗 New WebSocket client connected');
  
  // Send latest data to new client
  ws.send(JSON.stringify(latestData));
  
  ws.on('close', () => {
    console.log('🔌 WebSocket client disconnected');
  });
});

// Start server
async function startServer() {
  await initDatabase();

  server.listen(WEB_PORT, () => {
    console.log(`🚀 ATESS Web Server running on http://localhost:${WEB_PORT}`);
    console.log(`📡 WebSocket server ready`);
    console.log(`💾 TimescaleDB connected`);
  });

  // Start TCP server only if enabled (for Railway multi-replica support)
  const enableTcpServer = process.env.ENABLE_TCP_SERVER?.trim().replace(/^=/, '');
  console.log(`🔍 ENABLE_TCP_SERVER: ${process.env.ENABLE_TCP_SERVER} -> ${enableTcpServer}`);
  if (enableTcpServer === 'true') {
    tcpServer.listen(TCP_DATA_PORT, () => {
      console.log(`📡 TCP server listening on port ${TCP_DATA_PORT} (with source prefix parsing)`);
    });
  } else {
    console.log(`⚠️  TCP server disabled (set ENABLE_TCP_SERVER=true to enable)`);
  }
}

// ===== TCP SERVER =====

// Single TCP Server for both Collector and Web Server Data (port 3002)
const tcpServer = net.createServer(socket => {
  socket.on('data', async (data) => {
    const dataString = data.toString();
    let source = 'UNKNOWN';
    let hexData = dataString;

    // Parse source prefix from text
    if (dataString.startsWith('COLLECTOR:')) {
      source = 'COLLECTOR';
      hexData = dataString.substring(10); // Remove "COLLECTOR:" (10 chars)
    } else if (dataString.startsWith('WEBSERVER:')) {
      source = 'WEB_SERVER';
      hexData = dataString.substring(10); // Remove "WEBSERVER:" (10 chars)
    }

    console.log(`📊 Received TCP data from ${source} on port ${TCP_DATA_PORT}`);
    console.log(`📝 Data string: ${dataString.substring(0, 50)}...`);

    try {
      // Convert binary data to hex string for database storage
      const hexDataString = Buffer.from(hexData, 'utf8').toString('hex');

      // Save raw data to database first
      await saveRawDataToDatabase(source, hexDataString);

      // Try to parse - only save to atess_data if parsing succeeds (contains 0x24)
      try {
        const parsedData = parsePacket(hexDataString);
        const meaningfulData = extractMeaningfulFields(parsedData);

        // Update latest data
        latestData = {
          ...meaningfulData,
          timestamp: new Date().toISOString()
        };

        // Save parsed data to database
        await saveToDatabase(meaningfulData);

        // Broadcast to WebSocket clients
        broadcastData(latestData);

        console.log(`✅ ${source} data processed and saved`);
      } catch (parseError) {
        console.log('⚠️  Invalid packet (no 0x24), skipping parse and save to atess_data');
      }
    } catch (error) {
      console.error(`❌ Error processing ${source} TCP data:`, error.message);
    }
  });

  socket.on('error', (err) => {
    console.error('❌ TCP socket error:', err.message);
  });
});

startServer();
