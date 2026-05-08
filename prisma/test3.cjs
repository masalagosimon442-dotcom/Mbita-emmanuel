const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient({ datasourceUrl: 'mysql://root:@localhost:3306/professor_website' });
p.profile.count()
  .then(c => { console.log('datasourceUrl works! Count:', c); return p.$disconnect(); })
  .catch(e => { console.error('datasourceUrl failed:', e.message); process.exit(1); });
