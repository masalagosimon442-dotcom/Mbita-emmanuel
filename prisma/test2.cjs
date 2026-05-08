process.env.DATABASE_URL = 'mysql://root:@localhost:3306/professor_website';
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.profile.count()
  .then(c => { console.log('Connected! Count:', c); return p.$disconnect(); })
  .catch(e => { console.error('FAIL:', e.message); process.exit(1); });
