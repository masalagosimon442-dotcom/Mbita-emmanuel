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

  // Profile
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {
      fullName: 'Dr. Mbita Deogratias',
      title: 'Lecturer of Mathematics',
      department: 'Department of Mathematics and Statistics',
      institution: 'Sokoine University of Agriculture (SUA)',
      email: 'mbita.deogratias@sua.ac.tz',
      officeLocation: 'Old Library, Mazimbu, SUA Solomon Mahlangu Campus',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.123!2d37.6584!3d-6.8441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4b0a0a0a0a0a%3A0x0!2sSolomon+Mahlangu+Campus+SUA!5e0!3m2!1sen!2stz!4v1700000000000!5m2!1sen!2stz',
      bio: `Dr. Mbita Deogratias is a Lecturer of Mathematics at Sokoine University of Agriculture (SUA), where he has been a faculty member dedicated to advancing mathematical sciences. His research focuses on mathematical modelling, numerical analysis, and applied mathematics.\n\nHe holds a Ph.D. in Mathematics and has published numerous peer-reviewed papers in reputable journals. His work contributes to solving real-world problems through mathematical approaches in areas such as epidemiology, ecology, and agricultural systems.\n\nDr. Mbita is passionate about teaching and mentoring students, guiding them through both undergraduate and postgraduate research in mathematics.`,
      academicProfiles: [
        { label: 'Google Scholar', url: 'https://scholar.google.com/citations?user=example' },
        { label: 'ORCID', url: 'https://orcid.org/0000-0000-0000-0000' },
        { label: 'ResearchGate', url: 'https://www.researchgate.net/profile/Example' },
        { label: 'LinkedIn', url: 'https://www.linkedin.com/in/example' },
        { label: 'Twitter/X', url: 'https://x.com/example' },
        { label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=example' },
        { label: 'Academia.edu', url: 'https://university.academia.edu/example' },
        { label: 'Web of Science', url: 'https://www.webofscience.com/wos/author/record/example' },
        { label: 'Mendeley', url: 'https://www.mendeley.com/profiles/example' },
      ],
    },
    create: {
      id: 1,
      fullName: 'Dr. Mbita Deogratias',
      title: 'Lecturer of Mathematics',
      department: 'Department of Mathematics and Statistics',
      institution: 'Sokoine University of Agriculture (SUA)',
      email: 'mbita.deogratias@sua.ac.tz',
      officeLocation: 'Old Library, Mazimbu, SUA Solomon Mahlangu Campus',
      officeHours: 'Monday & Thursday, 10:00 AM – 12:00 PM',
      bio: `Dr. Mbita Deogratias is a Lecturer of Mathematics at Sokoine University of Agriculture (SUA), where he has been a faculty member dedicated to advancing mathematical sciences. His research focuses on mathematical modelling, numerical analysis, and applied mathematics.\n\nHe holds a Ph.D. in Mathematics and has published numerous peer-reviewed papers in reputable journals. His work contributes to solving real-world problems through mathematical approaches in areas such as epidemiology, ecology, and agricultural systems.\n\nDr. Mbita is passionate about teaching and mentoring students, guiding them through both undergraduate and postgraduate research in mathematics.`,
      photoUrl: '',
      cvUrl: '',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.123!2d37.6584!3d-6.8441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4b0a0a0a0a0a%3A0x0!2sSolomon+Mahlangu+Campus+SUA!5e0!3m2!1sen!2stz!4v1700000000000!5m2!1sen!2stz',
      academicProfiles: [
        { label: 'Google Scholar', url: 'https://scholar.google.com/citations?user=example' },
        { label: 'ORCID', url: 'https://orcid.org/0000-0000-0000-0000' },
        { label: 'ResearchGate', url: 'https://www.researchgate.net/profile/Example' },
        { label: 'LinkedIn', url: 'https://www.linkedin.com/in/example' },
        { label: 'Twitter/X', url: 'https://x.com/example' },
        { label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=example' },
        { label: 'Academia.edu', url: 'https://university.academia.edu/example' },
        { label: 'Web of Science', url: 'https://www.webofscience.com/wos/author/record/example' },
        { label: 'Mendeley', url: 'https://www.mendeley.com/profiles/example' },
      ],
    },
  });
  console.log('✓ Profile seeded');

  // SiteSettings
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      siteTitle: 'Dr. Mbita Deogratias',
      tagline: 'Lecturer of Mathematics | Sokoine University of Agriculture',
      footerText: '© 2025 Dr. Mbita Deogratias',
      contactEmail: 'mbita.deogratias@sua.ac.tz',
    },
    create: {
      id: 1,
      siteTitle: 'Dr. Mbita Deogratias',
      tagline: 'Lecturer of Mathematics | Sokoine University of Agriculture',
      footerText: '© 2025 Dr. Mbita Deogratias',
      contactEmail: 'mbita.deogratias@sua.ac.tz',
      maintenanceMode: false,
      socialLinks: [],
      hiddenSections: [],
    },
  });
  console.log('✓ SiteSettings seeded');

  console.log('\n🌱 Database seeded successfully!');
  console.log('📋 Login credentials: username=Mbita, password=mbita@12345');
  console.log('🌐 Open http://localhost:3000 in your browser');
  console.log('ℹ️  All content sections are empty — add data via the Admin Panel.');
}

main()
  .catch((e) => { console.error('Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
