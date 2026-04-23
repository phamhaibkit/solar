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
const PORT = process.env.PORT || 3001;
const TCP_COLLECTOR_PORT = 3002; // Port for collector data
const TCP_WEB_PORT = 3003; // Port for web server data

// WebSocket Server
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('dashboard/dist'));
app.use(express.static('public')); // Fallback to old public folder

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
  
  server.listen(PORT, () => {
    console.log(`🚀 ATESS Web Server running on http://localhost:${PORT}`);
    console.log(`📡 WebSocket server ready`);
    console.log(`💾 TimescaleDB connected`);
  });
}

// ===== TCP SERVERS =====

// TCP Server for Collector Data (port 3002)
const collectorTcpServer = net.createServer(socket => {
  socket.on('data', async (data) => {
    console.log('📊 Received TCP data from COLLECTOR on port', TCP_COLLECTOR_PORT);
    try {
      const hexString = data.toString('hex');
      
      // Save raw data to database first
      await saveRawDataToDatabase('COLLECTOR', hexString);
      
      // Try to parse - only save to atess_data if parsing succeeds (contains 0x24)
      try {
        const parsedData = parsePacket(hexString);
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
        
        console.log('✅ Collector data processed and saved');
      } catch (parseError) {
        console.log('⚠️  Invalid packet (no 0x24), skipping parse and save to atess_data');
      }
    } catch (error) {
      console.error('❌ Error processing collector TCP data:', error.message);
    }
  });
  
  socket.on('error', (err) => {
    console.error('❌ Collector TCP socket error:', err.message);
  });
});

collectorTcpServer.listen(TCP_COLLECTOR_PORT, () => {
  console.log(`📡 Collector TCP server listening on port ${TCP_COLLECTOR_PORT}`);
});

// TCP Server for Web Server Data (port 3003)
const webTcpServer = net.createServer(socket => {
  socket.on('data', async (data) => {
    console.log('📊 Received TCP data from WEB SERVER on port', TCP_WEB_PORT);
    try {
      const hexString = data.toString('hex');
      
      // Save raw data to database first
      await saveRawDataToDatabase('WEB_SERVER', hexString);
      
      // Try to parse - only save to atess_data if parsing succeeds (contains 0x24)
      try {
        const parsedData = parsePacket(hexString);
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
        
        console.log('✅ Web server data processed and saved');
      } catch (parseError) {
        console.log('⚠️  Invalid packet (no 0x24), skipping parse and save to atess_data');
      }
    } catch (error) {
      console.error('❌ Error processing web server TCP data:', error.message);
    }
  });
  
  socket.on('error', (err) => {
    console.error('❌ Web TCP socket error:', err.message);
  });
});

webTcpServer.listen(TCP_WEB_PORT, () => {
  console.log(`📡 Web Server TCP server listening on port ${TCP_WEB_PORT}`);
});

startServer();
