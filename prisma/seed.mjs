// ESM seed script for Prisma v7
import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually
const envPath = join(__dirname, '..', '.env');
try {
  const envContent = readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
} catch {}

// Now import Prisma (it reads DATABASE_URL from process.env via prisma.config.ts)
const { PrismaClient } = await import('@prisma/client');
const bcrypt = await import('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const passwordHash = await bcrypt.default.hash('mbita@12345', 12);
  await prisma.adminUser.upsert({
    where: { id: 1 },
    update: { username: 'Mbita', passwordHash },
    create: { id: 1, username: 'Mbita', passwordHash },
  });
  console.log('✓ AdminUser seeded  (username: Mbita, password: mbita@12345)');

  // Empty Profile — admin will fill via panel
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {
      fullName: 'Dr. Emmanuel Deogratias Mbita',
      title: 'Senior Lecturer of Mathematics',
      department: 'Department of Mathematics and Statistics',
      institution: 'Sokoine University of Agriculture (SUA)',
      email: 'emmanuel.mbita@sua.ac.tz',
      academicProfiles: [
        { label: 'Google Scholar', url: 'https://scholar.google.com/citations?user=JEeMxH0AAAAJ' },
        { label: 'ResearchGate', url: 'https://www.researchgate.net/profile/Emmanuel-Deogratias' },
        { label: 'ORCID', url: 'https://orcid.org/0000-0000-0000-0000' },
        { label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=0000000000' },
        { label: 'LinkedIn', url: 'https://www.linkedin.com/in/emmanuel-deogratias-mbita' },
        { label: 'Academia.edu', url: 'https://sua.academia.edu/EmmanuelMbita' },
      ],
    },
    create: {
      id: 1,
      fullName: 'Dr. Emmanuel Deogratias Mbita',
      title: 'Senior Lecturer of Mathematics',
      department: 'Department of Mathematics and Statistics',
      institution: 'Sokoine University of Agriculture (SUA)',
      email: 'emmanuel.mbita@sua.ac.tz',
      officeLocation: '',
      officeHours: '',
      bio: '',
      photoUrl: '',
      cvUrl: '',
      academicProfiles: [
        { label: 'Google Scholar', url: 'https://scholar.google.com/citations?user=JEeMxH0AAAAJ' },
        { label: 'ResearchGate', url: 'https://www.researchgate.net/profile/Emmanuel-Deogratias' },
        { label: 'ORCID', url: 'https://orcid.org/0000-0000-0000-0000' },
        { label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=0000000000' },
        { label: 'LinkedIn', url: 'https://www.linkedin.com/in/emmanuel-deogratias-mbita' },
        { label: 'Academia.edu', url: 'https://sua.academia.edu/EmmanuelMbita' },
      ],
    },
  });
  console.log('✓ Empty Profile created');

  // Empty SiteSettings — admin will fill via panel
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      siteTitle: 'Dr. Emmanuel Deogratias Mbita',
      tagline: 'Senior Lecturer of Mathematics | Sokoine University of Agriculture',
      footerText: '© 2025 Dr. Emmanuel Deogratias Mbita',
      contactEmail: 'emmanuel.mbita@sua.ac.tz',
    },
    create: {
      id: 1,
      siteTitle: 'Dr. Emmanuel Deogratias Mbita',
      tagline: 'Senior Lecturer of Mathematics | Sokoine University of Agriculture',
      footerText: '© 2025 Dr. Emmanuel Deogratias Mbita',
      contactEmail: 'emmanuel.mbita@sua.ac.tz',
      maintenanceMode: false,
      socialLinks: [],
      hiddenSections: [],
    },
  });
  console.log('✓ Empty SiteSettings created');

  console.log('\n🌱 Database seeded successfully!');
  console.log('📋 Login: username=Mbita, password=mbita@12345');
  console.log('ℹ️  All sections empty — add content via Admin Panel.');
}

main()
  .catch((e) => { console.error('Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
