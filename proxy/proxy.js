const net = require('net');

// ===== CONFIG =====
const PROXY_PORT = 1500;
const TARGET_HOST = '127.0.0.1';
const TARGET_PORT = 1600;
const SECOND_WEB_SERVER_HOST = process.env.RAILWAY_TCP_HOST || 'shuttle.proxy.rlwy.net';
const SECOND_WEB_SERVER_PORT = process.env.RAILWAY_TCP_PORT || 33268; // Railway TCP proxy port
const HEALTH_CHECK_INTERVAL = 5000; // 5 seconds
const MAX_RESTART_ATTEMPTS = 10;
const RESTART_DELAY = 2000; // 2 seconds

// ===== STATE MANAGEMENT =====
let proxyServer = null;
let restartAttempts = 0;
let targetConnectionStatus = 'disconnected';

// ===== SEND RAW DATA TO SECOND WEB SERVER =====
function sendRawDataToSecondWebServer(data, source) {
  const secondServerSocket = net.connect(SECOND_WEB_SERVER_PORT, SECOND_WEB_SERVER_HOST);

  secondServerSocket.on('connect', () => {
    // Map source names to prefix
    const sourcePrefix = source === 'COLLECTOR' ? 'COLLECTOR' : 'WEBSERVER';
    const prefix = sourcePrefix + ':';

    // Concatenate prefix and data into single buffer to ensure they arrive together
    const prefixedData = Buffer.concat([Buffer.from(prefix), data]);
    secondServerSocket.write(prefixedData);
    console.log(`✅ Raw data sent to second web server ${SECOND_WEB_SERVER_HOST}:${SECOND_WEB_SERVER_PORT} [Source: ${source}]`);
    secondServerSocket.end();
  });

  secondServerSocket.on('error', (err) => {
    console.error(`❌ Error sending to second web server [Source: ${source}]: ${err.message}`);
  });

  secondServerSocket.on('timeout', () => {
    console.warn(`⚠️ Timeout sending to second web server [Source: ${source}]`);
    secondServerSocket.destroy();
  });

  secondServerSocket.setTimeout(5000); // 5 second timeout
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
    const targetSocket = net.connect(TARGET_PORT, TARGET_PORT);

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
            // Stream 1: Send to original web server (current behavior)
            clientSocket.write(data);
            
            // Stream 2: Send raw data to second web server
            sendRawDataToSecondWebServer(data, 'COLLECTOR');
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
      // Forward to target server (collector)
      if (targetConnectionStatus === 'connected') {
        targetSocket.write(data);
      } else {
        console.warn('⚠️  Target disconnected, data not forwarded');
      }
      
      // Send raw data to second web server
      sendRawDataToSecondWebServer(data, 'WEB_SERVER_CURRENT');
    });

    targetSocket.on('data', data => {
      // Stream 1: Send to original web server (current behavior)
      clientSocket.write(data);
      
      // Stream 2: Send raw data to second web server
      sendRawDataToSecondWebServer(data, 'COLLECTOR');
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
    console.log(`📊 Sending data to ${SECOND_WEB_SERVER_HOST}:${SECOND_WEB_SERVER_PORT} (with source prefix)`);
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
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down...');
  if (proxyServer) {
    proxyServer.close(() => {
      console.log('✅ Proxy server closed');
      process.exit(0);
    });
  }
});
