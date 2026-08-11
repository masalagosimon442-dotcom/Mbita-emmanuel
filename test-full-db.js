const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fullDatabaseTest() {
  console.log('========================================');
  console.log('  COMPLETE DATABASE CONNECTION TEST');
  console.log('========================================\n');
  
  try {
    // Step 1: Test connection
    console.log('[1/5] Testing database connection...');
    await prisma.$connect();
    console.log('✅ Connected to Neon PostgreSQL\n');
    
    // Step 2: Test raw query
    console.log('[2/5] Testing raw SQL queries...');
    const result = await prisma.$queryRaw`SELECT NOW() as current_time, version() as pg_version`;
    console.log('✅ PostgreSQL version:', result[0].pg_version.substring(0, 50));
    console.log('✅ Server time:', result[0].current_time);
    console.log();
    
    // Step 3: Check tables exist
    console.log('[3/5] Checking database tables...');
    const tables = await prisma.$queryRaw`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `;
    console.log(`✅ Found ${tables.length} tables in database`);
    console.log('First 10 tables:', tables.slice(0, 10).map(t => t.tablename).join(', '));
    console.log();
    
    // Step 4: Test Prisma models
    console.log('[4/5] Testing Prisma models...');
    const studentCount = await prisma.student.count();
    const courseCount = await prisma.course.count();
    const profileCount = await prisma.profile.count();
    console.log(`✅ Student records: ${studentCount}`);
    console.log(`✅ Course records: ${courseCount}`);
    console.log(`✅ Profile records: ${profileCount}`);
    console.log();
    
    // Step 5: Test connection pool
    console.log('[5/5] Testing connection pool...');
    await Promise.all([
      prisma.student.count(),
      prisma.course.count(),
      prisma.publication.count(),
    ]);
    console.log('✅ Concurrent queries working\n');
    
    // Success summary
    console.log('========================================');
    console.log('  ✅ ALL DATABASE TESTS PASSED!');
    console.log('========================================');
    console.log('Database Status: FULLY OPERATIONAL');
    console.log('Total Tables:', tables.length);
    console.log('Prisma Client: WORKING');
    console.log('Connection Pool: ACTIVE');
    console.log('========================================\n');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ DATABASE TEST FAILED!\n');
    console.error('Error:', error.message);
    console.error('\nDetails:', error);
    
    console.error('\n========================================');
    console.error('  TROUBLESHOOTING STEPS:');
    console.error('========================================');
    console.error('1. Check DATABASE_URL in .env file');
    console.error('2. Verify Neon database is not suspended');
    console.error('3. Run: npx prisma db push');
    console.error('4. Run: npx prisma generate');
    console.error('5. Restart your terminal');
    console.error('========================================\n');
    
    return false;
    
  } finally {
    await prisma.$disconnect();
    console.log('Database connection closed.\n');
  }
}

// Run the test
fullDatabaseTest()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
