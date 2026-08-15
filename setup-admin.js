// Setup admin account with custom credentials
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    console.log('🔐 Setting up Admin Account...\n');

    // Custom admin credentials
    const adminUsername = 'Mbita';
    const adminEmail = 'mbita@university.edu';
    const adminPassword = 'mbita@!12345';
    const adminName = 'Mbita Deogratias Emmanuel';

    // Hash the password
    console.log('🔒 Hashing password...');
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Check if admin already exists
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email: adminEmail }
    }).catch(() => null);

    if (existingAdmin) {
      console.log('⚠️  Admin already exists, updating password...');
      await prisma.adminUser.update({
        where: { email: adminEmail },
        data: {
          username: adminUsername,
          password: hashedPassword,
          name: adminName,
        }
      });
      console.log('✅ Admin password updated!\n');
    } else {
      console.log('➕ Creating new admin account...');
      await prisma.adminUser.create({
        data: {
          username: adminUsername,
          email: adminEmail,
          password: hashedPassword,
          name: adminName,
          role: 'SUPER_ADMIN',
          isActive: true,
        },
      });
      console.log('✅ Admin account created!\n');
    }

    console.log('============================================');
    console.log('🎉 ADMIN SETUP COMPLETE!');
    console.log('============================================');
    console.log('📋 Login Credentials:');
    console.log('   Username:', adminUsername);
    console.log('   Email:', adminEmail);
    console.log('   Password:', adminPassword);
    console.log('============================================');
    console.log('🌐 Access your admin panel at:');
    console.log('   https://your-site.vercel.app/admin/login');
    console.log('============================================\n');

  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
    console.log('\n📝 Manual Setup:');
    console.log('   Username: Mbita');
    console.log('   Password: mbita@!12345');
    console.log('   Email: mbita@university.edu');
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin();
