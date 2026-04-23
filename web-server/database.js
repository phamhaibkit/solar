const { Pool } = require('pg');

// PostgreSQL Connection
// Use DATABASE_URL for Railway, fallback to localhost for development
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:12345678x@X@localhost:5432/postgres';

const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Initialize TimescaleDB tables
async function initDatabase() {
  try {
    // Drop and recreate raw_data table to add function_code column
    try {
      await pool.query(`DROP TABLE IF EXISTS raw_data CASCADE`);
      console.log('🗑️  Dropped old raw_data table');
    } catch (dropError) {
      console.warn('⚠️  Could not drop raw_data:', dropError.message);
    }

    // Raw data table
    await pool.query(`
      CREATE TABLE raw_data (
        id SERIAL PRIMARY KEY,
        function_code TEXT,
        source TEXT NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        data_length INTEGER NOT NULL,
        data TEXT NOT NULL
      );
    `);

    // Try to create hypertable (ignore if already exists)
    try {
      await pool.query(`SELECT create_hypertable('raw_data', 'timestamp')`);
    } catch (hypertableError) {
      if (!hypertableError.message.includes('already a hypertable')) {
        console.warn('⚠️  Could not create hypertable for raw_data:', hypertableError.message);
      }
    }

    // Drop and recreate atess_data table to ensure correct schema
    try {
      await pool.query(`DROP TABLE IF EXISTS atess_data CASCADE`);
      console.log('🗑️  Dropped old atess_data table');
    } catch (dropError) {
      console.warn('⚠️  Could not drop atess_data:', dropError.message);
    }

    // Parsed data table
    await pool.query(`
      CREATE TABLE atess_data (
        time TIMESTAMPTZ NOT NULL,
        logger_sn TEXT,
        device_sn TEXT,
        pv_daily REAL,
        pv_total REAL,
        load_daily REAL,
        load_total REAL,
        battery_charge REAL,
        battery_discharge REAL,
        battery_soc REAL,
        grid_import_daily REAL,
        grid_import_total REAL,
        grid_export_daily REAL,
        grid_export_total REAL,
        gen_daily REAL,
        gen_total REAL
      );
    `);

    // Try to create hypertable (ignore if already exists)
    try {
      await pool.query(`SELECT create_hypertable('atess_data', 'time')`);
    } catch (hypertableError) {
      if (!hypertableError.message.includes('already a hypertable')) {
        console.warn('⚠️  Could not create hypertable for atess_data:', hypertableError.message);
      }
    }

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
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

// Save parsed data to TimescaleDB
async function saveToDatabase(data) {
  try {
    const query = `
      INSERT INTO atess_data (
        time, logger_sn, device_sn,
        pv_daily, pv_total,
        load_daily, load_total,
        battery_charge, battery_discharge, battery_soc,
        grid_import_daily, grid_import_total,
        grid_export_daily, grid_export_total,
        gen_daily, gen_total
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    `;

    const values = [
      data.timestamp || new Date(),
      data.device?.loggerSN || null,
      data.device?.deviceSN || null,
      data.pv?.daily || 0,
      data.pv?.total || 0,
      data.load?.daily || 0,
      data.load?.total || 0,
      data.battery?.charge || 0,
      data.battery?.discharge || 0,
      data.battery?.soc || 0,
      data.grid?.import?.daily || 0,
      data.grid?.import?.total || 0,
      data.grid?.export?.daily || 0,
      data.grid?.export?.total || 0,
      data.gen?.daily || 0,
      data.gen?.total || 0
    ];

    await pool.query(query, values);
    console.log('💾 Data saved to TimescaleDB');
  } catch (error) {
    console.error('❌ Error saving to database:', error);
  }
}

// Get latest data from database
async function getLatestData() {
  try {
    const query = `
      SELECT * FROM atess_data
      ORDER BY time DESC
      LIMIT 1
    `;
    const result = await pool.query(query);
    const row = result.rows[0];
    
    if (!row) return null;
    
    // Transform flat database row to nested structure for Vue
    return {
      timestamp: row.time,
      device: {
        loggerSN: row.logger_sn,
        deviceSN: row.device_sn
      },
      pv: {
        daily: row.pv_daily || 0,
        total: row.pv_total || 0,
        dailyUnit: 'kWh',
        totalUnit: 'MWh',
        label: 'Generated energy of PV'
      },
      load: {
        daily: row.load_daily || 0,
        total: row.load_total || 0,
        dailyUnit: 'kWh',
        totalUnit: 'kWh',
        label: 'Consumption of load'
      },
      battery: {
        charge: row.battery_charge || 0,
        discharge: row.battery_discharge || 0,
        soc: row.battery_soc || 0,
        unit: 'kWh',
        label: 'Battery charge/discharge'
      },
      grid: {
        import: {
          daily: row.grid_import_daily || 0,
          total: row.grid_import_total || 0
        },
        export: {
          daily: row.grid_export_daily || 0,
          total: row.grid_export_total || 0
        },
        dailyUnit: 'kWh',
        totalUnit: 'MWh',
        label: 'Import from grid / Export to grid'
      },
      gen: {
        daily: row.gen_daily || 0,
        total: row.gen_total || 0,
        dailyUnit: 'kWh',
        totalUnit: 'MWh',
        label: 'GEN Energy'
      }
    };
  } catch (error) {
    console.error('❌ Error getting latest data:', error);
    return null;
  }
}

// Get historical data from database
async function getHistoryData(hours = 24) {
  try {
    const query = `
      SELECT * FROM atess_data
      WHERE time > NOW() - INTERVAL '${hours} hours'
      ORDER BY time DESC
    `;
    const result = await pool.query(query);
    
    // Transform flat database rows to nested structure for Vue
    return result.rows.map(row => ({
      timestamp: row.time,
      device: {
        loggerSN: row.logger_sn,
        deviceSN: row.device_sn
      },
      pv: {
        daily: row.pv_daily || 0,
        total: row.pv_total || 0,
        dailyUnit: 'kWh',
        totalUnit: 'MWh',
        label: 'Generated energy of PV'
      },
      load: {
        daily: row.load_daily || 0,
        total: row.load_total || 0,
        dailyUnit: 'kWh',
        totalUnit: 'kWh',
        label: 'Consumption of load'
      },
      battery: {
        charge: row.battery_charge || 0,
        discharge: row.battery_discharge || 0,
        soc: row.battery_soc || 0,
        unit: 'kWh',
        label: 'Battery charge/discharge'
      },
      grid: {
        import: {
          daily: row.grid_import_daily || 0,
          total: row.grid_import_total || 0
        },
        export: {
          daily: row.grid_export_daily || 0,
          total: row.grid_export_total || 0
        },
        dailyUnit: 'kWh',
        totalUnit: 'MWh',
        label: 'Import from grid / Export to grid'
      },
      gen: {
        daily: row.gen_daily || 0,
        total: row.gen_total || 0,
        dailyUnit: 'kWh',
        totalUnit: 'MWh',
        label: 'GEN Energy'
      }
    }));
  } catch (error) {
    console.error('❌ Error getting history data:', error);
    return [];
  }
}

// Get raw data from database
async function getRawData(source = null, limit = 100) {
  try {
    let query = `
      SELECT * FROM raw_data
    `;
    const params = [];
    
    if (source) {
      query += ` WHERE source = $1`;
      params.push(source);
    }
    
    query += ` ORDER BY timestamp DESC LIMIT $${params.length + 1}`;
    params.push(limit);
    
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('❌ Error getting raw data:', error);
    return [];
  }
}

module.exports = {
  pool,
  initDatabase,
  saveRawDataToDatabase,
  saveToDatabase,
  getLatestData,
  getHistoryData,
  getRawData
};
