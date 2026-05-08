// Reset admin password to a known value
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function main() {
  const password = 'admin123456';
  const hash = await bcrypt.hash(password, 12);
  console.log('Generated hash:', hash);

  // Verify it works
  const valid = await bcrypt.compare(password, hash);
  console.log('Hash verification:', valid ? '✓ VALID' : '✗ INVALID');

  // Update in database
  const conn = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'professor_website',
  });

  await conn.execute(
    'UPDATE AdminUser SET passwordHash = ? WHERE id = 1',
    [hash]
  );
  console.log('✓ Admin password updated in database');
  console.log('');
  console.log('Login credentials:');
  console.log('  Username: admin');
  console.log('  Password: admin123456');
  console.log('  URL: http://localhost:3000/login');

  await conn.end();
}

main().catch(e => { console.error(e.message); process.exit(1); });
