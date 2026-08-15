// Verify all tables were created in Machiya database
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyTables() {
  try {
    console.log('🔍 Verifying Machiya database tables...\n');
    
    // Get all tables
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    console.log(`✅ Total tables created: ${tables.length}\n`);
    
    // Test a few key tables with counts
    const tests = [
      { name: 'User', query: () => prisma.user.count() },
      { name: 'Profile', query: () => prisma.profile.count() },
      { name: 'Student', query: () => prisma.student.count() },
      { name: 'Course', query: () => prisma.course.count() },
      { name: 'Research', query: () => prisma.research.count() },
      { name: 'Publication', query: () => prisma.publication.count() },
      { name: 'ConnectedAccount', query: () => prisma.connectedAccount.count() },
      { name: 'SyncedContent', query: () => prisma.syncedContent.count() },
    ];
    
    console.log('📊 Testing key tables:');
    for (const test of tests) {
      try {
        const count = await test.query();
        console.log(`  ✓ ${test.name}: ${count} records`);
      } catch (error) {
        console.log(`  ✗ ${test.name}: Error - ${error.message}`);
      }
    }
    
    console.log('\n🎉 Database verification complete!');
    console.log('📋 Table list (first 20):');
    tables.slice(0, 20).forEach((t, i) => {
      console.log(`  ${i + 1}. ${t.table_name}`);
    });
    if (tables.length > 20) {
      console.log(`  ... and ${tables.length - 20} more tables`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyTables();
