// Quick test to verify Machiya database connection
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

async function testConnection() {
  try {
    console.log('🔄 Testing connection to Machiya database...');
    await prisma.$connect();
    console.log('✅ Successfully connected to Machiya database!');
    
    // Try to query (will fail if no tables, but shows connection works)
    const result = await prisma.$queryRaw`SELECT current_database(), current_user`;
    console.log('📊 Database info:', result);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('🔍 Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
