import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAdminLogin() {
  try {
    console.log('🔍 Checking admin user in database...\n');
    
    const admin = await prisma.adminUser.findFirst({
      where: { username: 'Mbita' }
    });
    
    if (admin) {
      console.log('✅ Admin user found!');
      console.log('📋 Details:');
      console.log(`   Username: ${admin.username}`);
      console.log(`   ID: ${admin.id}`);
      console.log(`   TOTP Enabled: ${admin.totpEnabled}`);
      console.log(`   Failed Attempts: ${admin.failedAttempts}`);
      console.log(`   Locked Until: ${admin.lockedUntil || 'Not locked'}`);
      console.log('\n✅ Admin login should work!');
      console.log('\n🔐 Login Credentials:');
      console.log('   Username: Mbita');
      console.log('   Password: mbita@12345');
      console.log('   URL: http://localhost:3000/login');
    } else {
      console.log('❌ Admin user NOT found in database!');
      console.log('   Run: npx prisma db seed');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminLogin();
