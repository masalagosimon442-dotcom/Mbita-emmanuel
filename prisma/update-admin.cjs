const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function main() {
  const username = 'Mbita';
  const password = 'Mbita@12345';
  const hash = await bcrypt.hash(password, 12);

  const valid = await bcrypt.compare(password, hash);
  console.log('Hash verification:', valid ? '✓ VALID' : '✗ INVALID');

  const conn = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'professor_website',
  });

  // Update existing admin user
  await conn.execute(
    'UPDATE AdminUser SET username = ?, passwordHash = ?, failedAttempts = 0, lockedUntil = NULL WHERE id = 1',
    [username, hash]
  );

  const [rows] = await conn.execute('SELECT id, username FROM AdminUser WHERE id = 1');
  console.log('Updated user:', rows);
  console.log('');
  console.log('✅ Admin credentials updated!');
  console.log('   Username: Mbita');
  console.log('   Password: Mbita@12345');
  console.log('   URL:      http://localhost:3000/login');

  await conn.end();
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
