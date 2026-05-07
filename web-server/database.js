const { Pool } = require('pg');
require('dotenv').config();
// PostgreSQL Connection
// Use DATABASE_URL for Railway, fallback to individual PG* env vars, then localhost for development
console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL);
console.log('🔍 PGHOST:', process.env.PGHOST);
console.log('🔍 PGPORT:', process.env.PGPORT);
console.log('🔍 PGUSER:', process.env.PGUSER);
console.log('🔍 PGDATABASE:', process.env.PGDATABASE);

const fallbackConnectionString = process.env.PGHOST
  ? `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE}`
  : 'postgresql://postgres:12345678x@X@localhost:5432/postgres';

const connectionString = process.env.DATABASE_URL || fallbackConnectionString;

const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  // Disable pg_stat_statements to fix Railway error
  statement_timeout: '30s',
  options: '-c statement_timeout=30s'
});

// Initialize PostgreSQL tables
async function initDatabase() {
  try {
    console.log('🔧 Initializing database...');

    // Raw data table
    console.log('📝 Creating raw_data table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS raw_data (
        id SERIAL PRIMARY KEY,
        function_code TEXT,
        source TEXT NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        data_length INTEGER NOT NULL,
        data TEXT NOT NULL
      );
    `);
    console.log('✅ raw_data table created');

    // Create index for performance
    try {
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_raw_data_timestamp ON raw_data(timestamp)`);
      console.log('✅ raw_data index created');
    } catch (indexError) {
      console.warn('⚠️  Could not create index for raw_data:', indexError.message);
    }

    
    // CARD data table (kWh - daily energy)
    console.log('📝 Creating card_data table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS card_data (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        logger_sn TEXT,
        device_sn TEXT,
        pv_daily REAL,
        pv_unit TEXT DEFAULT 'kWh',
        pv_label TEXT DEFAULT 'Generated energy of PV',
        load_daily REAL,
        load_unit TEXT DEFAULT 'kWh',
        load_label TEXT DEFAULT 'Consumption of load',
        battery_charge REAL,
        battery_discharge REAL,
        battery_unit TEXT DEFAULT 'kWh',
        battery_label TEXT DEFAULT 'Battery charge/discharge',
        grid_import_daily REAL,
        grid_export_daily REAL,
        grid_unit TEXT DEFAULT 'kWh',
        grid_label TEXT DEFAULT 'Import from grid / Export to grid',
        gen_daily REAL,
        gen_unit TEXT DEFAULT 'kWh',
        gen_label TEXT DEFAULT 'GEN Energy'
      );
    `);
    console.log('✅ card_data table created');

    // Create index for card_data table
    try {
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_card_data_timestamp ON card_data(timestamp)`);
      console.log('✅ card_data index created');
    } catch (indexError) {
      console.warn('⚠️  Could not create index for card_data:', indexError.message);
    }

    // CHART data table (kW - realtime power)
    console.log('📝 Creating chart_data table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chart_data (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        logger_sn TEXT,
        device_sn TEXT,
        pv_power REAL,
        pv_unit TEXT DEFAULT 'kW',
        pv_label TEXT DEFAULT 'PV power',
        load_power REAL,
        load_unit TEXT DEFAULT 'kW',
        load_label TEXT DEFAULT 'Load power',
        battery_power REAL,
        battery_soc REAL,
        battery_unit TEXT DEFAULT 'kW',
        battery_label TEXT DEFAULT 'Battery power',
        grid_power REAL,
        grid_unit TEXT DEFAULT 'kW',
        grid_label TEXT DEFAULT 'Grid power',
        gen_power REAL,
        gen_unit TEXT DEFAULT 'kW',
        gen_label TEXT DEFAULT 'GEN power'
      );
    `);
    console.log('✅ chart_data table created');

    // Create index for chart_data table
    try {
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_chart_data_timestamp ON chart_data(timestamp)`);
      console.log('✅ chart_data index created');
    } catch (indexError) {
      console.warn('⚠️  Could not create index for chart_data:', indexError.message);
    }

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    console.error('❌ Error details:', error.stack);
  }
}

// Save CARD data (kWh - daily energy)
async function saveCardData(meaningfulData) {
  try {
    const query = `
      INSERT INTO card_data (
        timestamp, logger_sn, device_sn,
        pv_daily, pv_unit, pv_label,
        load_daily, load_unit, load_label,
        battery_charge, battery_discharge, battery_unit, battery_label,
        grid_import_daily, grid_export_daily, grid_unit, grid_label,
        gen_daily, gen_unit, gen_label
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
    `;

    const values = [
      meaningfulData.timestamp || new Date(),
      meaningfulData.device?.loggerSN || null,
      meaningfulData.device?.deviceSN || null,
      meaningfulData.pv?.daily || 0,
      meaningfulData.pv?.dailyUnit || 'kWh',
      meaningfulData.pv?.label || 'Generated energy of PV',
      meaningfulData.load?.daily || 0,
      meaningfulData.load?.dailyUnit || 'kWh',
      meaningfulData.load?.label || 'Consumption of load',
      meaningfulData.battery?.charge || 0,
      meaningfulData.battery?.discharge || 0,
      meaningfulData.battery?.unit || 'kWh',
      meaningfulData.battery?.label || 'Battery charge/discharge',
      meaningfulData.grid?.import?.daily || 0,
      meaningfulData.grid?.export?.daily || 0,
      meaningfulData.grid?.dailyUnit || 'kWh',
      meaningfulData.grid?.label || 'Import from grid / Export to grid',
      meaningfulData.gen?.daily || 0,
      meaningfulData.gen?.dailyUnit || 'kWh',
      meaningfulData.gen?.label || 'GEN Energy'
    ];

    await pool.query(query, values);
    console.log('💾 CARD data saved to card_data table');
  } catch (error) {
    // Ignore pg_statements errors (Railway issue)
    if (error.message && error.message.includes('pg_statements')) {
      console.warn('⚠️  Ignoring pg_statements error in saveCardData (Railway limitation)');
      return;
    }
    console.error('❌ Error saving CARD data to database:', error);
  }
}

// Save CHART data (kW - realtime power)
async function saveChartData(meaningfulData) {
  try {
    const query = `
      INSERT INTO chart_data (
        timestamp, logger_sn, device_sn,
        pv_power, pv_unit, pv_label,
        load_power, load_unit, load_label,
        battery_power, battery_soc, battery_unit, battery_label,
        grid_power, grid_unit, grid_label,
        gen_power, gen_unit, gen_label
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    `;

    const values = [
      meaningfulData.timestamp || new Date(),
      meaningfulData.device?.loggerSN || null,
      meaningfulData.device?.deviceSN || null,
      meaningfulData.pv?.power || 0,
      meaningfulData.pv?.powerUnit || 'kW',
      meaningfulData.pv?.powerLabel || 'PV power',
      meaningfulData.load?.power || 0,
      meaningfulData.load?.powerUnit || 'kW',
      meaningfulData.load?.powerLabel || 'Load power',
      meaningfulData.battery?.power || 0,
      meaningfulData.battery?.soc || 0,
      meaningfulData.battery?.powerUnit || 'kW',
      meaningfulData.battery?.powerLabel || 'Battery power',
      meaningfulData.grid?.power || 0,
      meaningfulData.grid?.powerUnit || 'kW',
      meaningfulData.grid?.powerLabel || 'Grid power',
      meaningfulData.gen?.power || 0,
      meaningfulData.gen?.powerUnit || 'kW',
      meaningfulData.gen?.powerLabel || 'GEN power'
    ];

    await pool.query(query, values);
    console.log('💾 CHART data saved to chart_data table');
  } catch (error) {
    // Ignore pg_statements errors (Railway issue)
    if (error.message && error.message.includes('pg_statements')) {
      console.warn('⚠️  Ignoring pg_statements error in saveChartData (Railway limitation)');
      return;
    }
    console.error('❌ Error saving CHART data to database:', error);
  }
}

// Save raw data to TimescaleDB
async function saveRawDataToDatabase(source, hexString) {
  try {
    // Extract function code from byte 7 (positions 14-15 in hex string)
    let functionCode = null;
    if (hexString.length >= 16) {
      functionCode = hexString.substring(14, 16);
    }

    const query = `
      INSERT INTO raw_data (function_code, source, timestamp, data_length, data)
      VALUES ($1, $2, NOW(), $3, $4)
    `;

    const values = [
      functionCode,
      source,
      hexString.length / 2, // hex string length / 2 = bytes
      hexString
    ];

    await pool.query(query, values);
    console.log('💾 Raw data saved to TimescaleDB');
  } catch (error) {
    console.error('❌ Error saving raw data to database:', error);
  }
}

// Get historical data from database
async function getHistoryData(hours = 24) {
  try {
    const query = `
      SELECT * FROM card_data
      WHERE timestamp > NOW() - INTERVAL '${hours} hours'
      ORDER BY timestamp DESC
    `;
    const result = await pool.query(query);

    // Transform flat database rows to nested structure for Vue
    return result.rows.map(row => ({
      timestamp: row.timestamp,
      device: {
        loggerSN: row.logger_sn,
        deviceSN: row.device_sn
      },
      pv: {
        daily: row.pv_daily || 0,
        dailyUnit: 'kWh',
        label: 'Generated energy of PV'
      },
      load: {
        daily: row.load_daily || 0,
        dailyUnit: 'kWh',
        label: 'Consumption of load'
      },
      battery: {
        charge: row.battery_charge || 0,
        discharge: row.battery_discharge || 0,
        unit: 'kWh',
        label: 'Battery charge/discharge'
      },
      grid: {
        import: {
          daily: row.grid_import_daily || 0
        },
        export: {
          daily: row.grid_export_daily || 0
        },
        dailyUnit: 'kWh',
        label: 'Import from grid / Export to grid'
      },
      gen: {
        daily: row.gen_daily || 0,
        dailyUnit: 'kWh',
        label: 'GEN Energy'
      }
    }));
  } catch (error) {
    // Ignore pg_statements errors (Railway issue)
    if (error.message && error.message.includes('pg_statements')) {
      console.warn('⚠️  Ignoring pg_statements error in getHistoryData (Railway limitation)');
      return [];
    }
    console.error('❌ Error getting historical data:', error);
    return [];
  }
}

// Get chart data with date range (default to today)
async function getChartData(startDate = null, endDate = null) {
  try {
    let query = `SELECT * FROM chart_data`;
    const params = [];

    if (startDate && endDate) {
      query += ` WHERE timestamp >= $1 AND timestamp <= $2`;
      params.push(startDate, endDate);
    } else {
      // Default to today
      query += ` WHERE timestamp >= DATE_TRUNC('day', NOW())`;
    }

    query += ` ORDER BY timestamp DESC LIMIT 100`;

    const result = await pool.query(query, params);

    // Transform flat database rows to nested structure for Vue
    return result.rows.map(row => ({
      timestamp: row.timestamp,
      device: {
        loggerSN: row.logger_sn,
        deviceSN: row.device_sn
      },
      pv: {
        power: row.pv_power || 0,
        powerUnit: 'kW',
        powerLabel: 'PV power'
      },
      load: {
        power: row.load_power || 0,
        powerUnit: 'kW',
        powerLabel: 'Load power'
      },
      battery: {
        power: row.battery_power || 0,
        soc: row.battery_soc || 0,
        powerUnit: 'kW',
        powerLabel: 'Battery power'
      },
      grid: {
        power: row.grid_power || 0,
        powerUnit: 'kW',
        powerLabel: 'Grid power'
      },
      gen: {
        power: row.gen_power || 0,
        powerUnit: 'kW',
        powerLabel: 'GEN power'
      }
    })).reverse(); // Reverse to show oldest first
  } catch (error) {
    // Ignore pg_statements errors (Railway issue)
    if (error.message && error.message.includes('pg_statements')) {
      console.warn('⚠️  Ignoring pg_statements error in getChartData (Railway limitation)');
      return [];
    }
    console.error('❌ Error getting chart data:', error);
    return [];
  }
}

// Get raw data from database
async function getRawData(source = null, limit = 100, functionCode = null) {
  try {
    let query = `
      SELECT * FROM raw_data
    `;
    const params = [];

    console.log(`📋 getRawData called with source: ${source}, limit: ${limit}, functionCode: ${functionCode}`);

    if (source) {
      query += ` WHERE source = $1`;
      params.push(source);
    }

    if (functionCode) {
      if (source) {
        query += ` AND function_code = $${params.length + 1}`;
      } else {
        query += ` WHERE function_code = $1`;
      }
      // Remove 0x prefix if present
      const cleanFunctionCode = functionCode.replace(/^0x/i, '');
      params.push(cleanFunctionCode);
      console.log(`📋 Query with functionCode: ${query}, params: ${params}`);
    }

    query += ` ORDER BY timestamp DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await pool.query(query, params);
    console.log(`📋 Query returned ${result.rows.length} rows`);

    return result.rows;
  } catch (error) {
    // Ignore pg_stat_statements errors (Railway issue)
    if (error.message && error.message.includes('pg_stat_statements')) {
      console.warn('⚠️  Ignoring pg_stat_statements error (Railway limitation)');
      return [];
    }
    console.error('❌ Error getting raw data:', error);
    return [];
  }
}

module.exports = {
  pool,
  initDatabase,
  saveRawDataToDatabase,
  saveCardData,
  saveChartData,
  getLatestData,
  getHistoryData,
  getChartData,
  getRawData
};
