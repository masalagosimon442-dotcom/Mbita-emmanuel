// Direct database connection test
const { Client } = require('pg');

const client = new Client({
  host: 'ep-cold-river-axk4zdve-pooler.c-4.us-east-2.aws.neon.tech',
  port: 5432,
  database: 'simonmachibya',
  user: 'neondb_owner',
  password: 'npg_nAFN5lLjUZw9',
  ssl: { rejectUnauthorized: false }
});

async function connect() {
  try {
    await client.connect();
    console.log('✅ Connected to database!');
    
    // Test query
    const result = await client.query('SELECT current_database(), current_user, version()');
    console.log('\n📊 Connection Info:');
    console.log(result.rows[0]);
    
    // Count tables
    const tables = await client.query(`
      SELECT COUNT(*) as total_tables
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('\n📋 Total Tables:', tables.rows[0].total_tables);
    
    // List tables
    const tableList = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
      LIMIT 10
    `);
    console.log('\n📝 First 10 Tables:');
    tableList.rows.forEach(row => console.log('  -', row.table_name));
    
    console.log('\n✅ Database connection working perfectly!');
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  } finally {
    await client.end();
  }
}

connect();
