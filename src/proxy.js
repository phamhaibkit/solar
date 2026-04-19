const net = require('net');
require('dotenv').config();
const { Pool } = require('pg');

// ===== CONFIG =====
const PROXY_PORT = 1500;
const TARGET_HOST = '127.0.0.1';
const TARGET_PORT = 1600;
const HEALTH_CHECK_INTERVAL = 5000; // 5 seconds
const MAX_RESTART_ATTEMPTS = 10;
const RESTART_DELAY = 2000; // 2 seconds

// ===== STATE MANAGEMENT =====
let proxyServer = null;
let restartAttempts = 0;
let isHealthy = true;
let targetConnectionStatus = 'disconnected';

// ===== POSTGRESQL CONNECTION =====
const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT) || 5432,
  database: process.env.PG_DATABASE || 'atess_data',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test PostgreSQL connection
pool.connect()
  .then(client => {
    console.log('✅ Connected to PostgreSQL');
    client.release();
  })
  .catch(err => {
    console.error('❌ PostgreSQL connection error:', err.message);
    console.log('⚠️  Raw data will not be saved to database');
  });

// ===== RAW DATA LOGGING TO POSTGRESQL =====
async function logRawData(data, source, clientAddress) {
  const timestamp = new Date();
  const hexData = data.toString('hex').toUpperCase();
  
  try {
    await pool.query(
      'INSERT INTO raw_data (timestamp, source, client_address, data_length, hex_data) VALUES ($1, $2, $3, $4, $5)',
      [timestamp, source, clientAddress, data.length, hexData]
    );
    console.log(`📝 Logged raw data from ${source}: ${data.length} bytes`);
  } catch (err) {
    console.error('❌ Error saving to PostgreSQL:', err.message);
  }
}

// ===== HEALTH CHECK =====
function checkTargetConnection() {
  const testSocket = net.connect(TARGET_PORT, TARGET_HOST);
  
  testSocket.on('connect', () => {
    if (targetConnectionStatus !== 'connected') {
      console.log('✅ Target server connection restored');
      targetConnectionStatus = 'connected';
    }
    testSocket.destroy();
  });
  
  testSocket.on('error', () => {
    if (targetConnectionStatus !== 'disconnected') {
      console.error('❌ Target server connection lost');
      targetConnectionStatus = 'disconnected';
    }
    testSocket.destroy();
  });
}

// ===== GRACEFUL ERROR HANDLING =====
function handleProxyError(err) {
  console.error('❌ Proxy error:', err.message);
  isHealthy = false;
  
  if (restartAttempts < MAX_RESTART_ATTEMPTS) {
    restartAttempts++;
    console.log(`🔄 Attempting to restart proxy (${restartAttempts}/${MAX_RESTART_ATTEMPTS}) in ${RESTART_DELAY}ms...`);
    
    setTimeout(() => {
      if (proxyServer) {
        proxyServer.close(() => {
          startProxy();
        });
      } else {
        startProxy();
      }
    }, RESTART_DELAY);
  } else {
    console.error('❌ Max restart attempts reached. Manual intervention required.');
  }
}

// ===== PROXY SERVER START =====
function startProxy() {
  proxyServer = net.createServer(clientSocket => {
    const targetSocket = net.connect(TARGET_PORT, TARGET_HOST);

    // Handle target connection errors
    targetSocket.on('error', (err) => {
      console.error('❌ Target connection error:', err.message);
      targetConnectionStatus = 'disconnected';
      
      // Try to reconnect without closing client connection
      try {
        const newTargetSocket = net.connect(TARGET_PORT, TARGET_HOST);
        
        newTargetSocket.on('connect', () => {
          console.log('✅ Target reconnected');
          targetConnectionStatus = 'connected';
          
          newTargetSocket.on('data', (data) => {
            logRawData(data, 'server', clientSocket.remoteAddress);
            clientSocket.write(data);
          });
          
          newTargetSocket.on('error', handleProxyError);
        });
        
        newTargetSocket.on('error', () => {
          console.error('❌ Target reconnection failed');
        });
        
      } catch (reconnectErr) {
        console.error('❌ Reconnection attempt failed:', reconnectErr.message);
      }
    });

    targetSocket.on('connect', () => {
      if (targetConnectionStatus !== 'connected') {
        console.log('✅ Target server connected');
        targetConnectionStatus = 'connected';
      }
    });

    clientSocket.on('data', data => {
      logRawData(data, 'client', clientSocket.remoteAddress);
      
      if (targetConnectionStatus === 'connected') {
        targetSocket.write(data);
      } else {
        console.warn('⚠️  Target disconnected, data not forwarded');
      }
    });

    targetSocket.on('data', data => {
      logRawData(data, 'server', clientSocket.remoteAddress);
      clientSocket.write(data);
    });

    clientSocket.on('close', () => {
      if (!targetSocket.destroyed) {
        targetSocket.end();
      }
    });

    targetSocket.on('close', () => {
      if (!clientSocket.destroyed) {
        clientSocket.end();
      }
    });

    clientSocket.on('error', (err) => {
      console.error('❌ Client error:', err.message);
      if (!targetSocket.destroyed) {
        targetSocket.end();
      }
    });
  });

  proxyServer.on('error', handleProxyError);
  
  proxyServer.listen(PROXY_PORT, () => {
    console.log(`🚀 Proxy running on port ${PROXY_PORT}`);
    console.log(`📡 Forwarding to ${TARGET_HOST}:${TARGET_PORT}`);
    isHealthy = true;
    restartAttempts = 0;
  });
}

// ===== START PROXY WITH HEALTH MONITOR =====
startProxy();

setInterval(checkTargetConnection, HEALTH_CHECK_INTERVAL);

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down proxy gracefully...');
  if (proxyServer) {
    proxyServer.close(() => {
      console.log('✅ Proxy server closed');
      pool.end(() => {
        console.log('✅ PostgreSQL pool closed');
        process.exit(0);
      });
    });
  } else {
    pool.end(() => {
      console.log('✅ PostgreSQL pool closed');
      process.exit(0);
    });
  }
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down...');
  if (proxyServer) {
    proxyServer.close(() => {
      console.log('✅ Proxy server closed');
      pool.end(() => {
        console.log('✅ PostgreSQL pool closed');
        process.exit(0);
      });
    });
  }
});