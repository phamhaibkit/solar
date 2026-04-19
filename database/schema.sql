-- Create database (if not exists)
-- CREATE DATABASE atess_data;

-- Connect to atess_data
-- \c atess_data

-- Create raw_data table
CREATE TABLE IF NOT EXISTS raw_data (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  source VARCHAR(10) NOT NULL CHECK (source IN ('client', 'server')),
  function_code VARCHAR(10),
  client_address VARCHAR(50),
  data_length INTEGER NOT NULL,
  hex_data TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_raw_data_timestamp ON raw_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_raw_data_source ON raw_data(source);
CREATE INDEX IF NOT EXISTS idx_raw_data_client_address ON raw_data(client_address);
CREATE INDEX IF NOT EXISTS idx_raw_data_function_code ON raw_data(function_code);

-- Add comment
COMMENT ON TABLE raw_data IS 'Stores raw ATESS data packets from proxy server';
COMMENT ON COLUMN raw_data.source IS 'Source of data: client (data collector) or server (ATESS server)';
COMMENT ON COLUMN raw_data.function_code IS 'Function code: 0x16 (Heartbeat), 0x23 (Property Data), 0x24 (Telemetry), 0x19 (Query), 0x03 (Response)';
COMMENT ON COLUMN raw_data.hex_data IS 'Raw hex data from ATESS device';
