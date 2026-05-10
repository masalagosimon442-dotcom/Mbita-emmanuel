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

  // Publications
  await prisma.publication.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Mathematical Modelling of Infectious Disease Dynamics in Sub-Saharan Africa',
        authors: ['Mbita Deogratias', 'John Mwanga', 'Grace Lyimo'],
        venue: 'Journal of Mathematical Biology',
        year: 2023,
        type: 'journal',
        doi: '10.1007/jmb.2023.045',
        abstract: 'We develop a compartmental mathematical model to analyse the transmission dynamics of infectious diseases in resource-limited settings.',
        published: true,
      },
      {
        title: 'Numerical Solutions of Nonlinear Differential Equations Using Finite Element Methods',
        authors: ['Mbita Deogratias', 'Peter Kilonzo'],
        venue: 'Applied Mathematics and Computation',
        year: 2022,
        type: 'journal',
        doi: '10.1016/amc.2022.118',
        published: true,
      },
      {
        title: 'Optimal Control Strategies for Agricultural Pest Management: A Mathematical Approach',
        authors: ['Mbita Deogratias', 'Anna Mushi', 'Robert Temba'],
        venue: 'Mathematical Methods in the Applied Sciences',
        year: 2021,
        type: 'journal',
        published: true,
      },
    ],
  });
  console.log('✓ Publications seeded');

  // Research projects
  await prisma.researchProject.createMany({
    skipDuplicates: true,
    data: [
      {
        slug: 'mathematical-epidemiology',
        title: 'Mathematical Modelling of Disease Dynamics',
        description: 'This project develops mathematical models to understand and predict the spread of infectious diseases in East African communities, providing insights for public health interventions.',
        status: 'active',
        startYear: 2021,
        fundingSources: ['SUA Research Fund', 'COSTECH Tanzania'],
        collaborators: ['University of Dar es Salaam', 'NIMR Tanzania'],
        tags: ['Mathematical Modelling', 'Epidemiology', 'Applied Mathematics'],
        published: true,
      },
      {
        slug: 'numerical-methods-agriculture',
        title: 'Numerical Methods for Agricultural Systems Optimization',
        description: 'Applying numerical analysis and optimization techniques to improve agricultural productivity and resource management in Tanzania.',
        status: 'completed',
        startYear: 2018,
        endYear: 2022,
        fundingSources: ['Tanzania Commission for Science and Technology'],
        tags: ['Numerical Analysis', 'Optimization', 'Agriculture'],
        published: true,
      },
    ],
  });
  console.log('✓ ResearchProjects seeded');

  // Courses
  await prisma.course.createMany({
    skipDuplicates: true,
    data: [
      {
        name: 'Calculus and Analytical Geometry',
        code: 'MT 101',
        term: 'Semester I 2024/2025',
        status: 'active',
        description: 'Fundamental concepts of differential and integral calculus, limits, continuity, and analytical geometry for first-year students.',
        schedule: [{ day: 'Monday', time: '8:00 AM', room: 'Lecture Hall 3' }, { day: 'Wednesday', time: '8:00 AM', room: 'Lecture Hall 3' }],
        published: true,
      },
      {
        name: 'Ordinary Differential Equations',
        code: 'MT 201',
        term: 'Semester II 2023/2024',
        status: 'active',
        description: 'Theory and methods for solving ordinary differential equations, including first-order, second-order, and systems of ODEs with applications.',
        published: true,
      },
      {
        name: 'Numerical Analysis',
        code: 'MT 301',
        term: 'Semester I 2023/2024',
        status: 'archived',
        description: 'Numerical methods for solving mathematical problems including interpolation, numerical integration, and iterative methods for linear systems.',
        published: true,
      },
    ],
  });
  console.log('✓ Courses seeded');

  // Students
  await prisma.student.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Joseph Masanja', degreeLevel: 'PhD', researchTopic: 'Mathematical modelling of malaria transmission dynamics', status: 'current', published: true },
      { name: 'Happiness Mwakifuna', degreeLevel: 'PhD', researchTopic: 'Optimal control theory in agricultural pest management', status: 'current', published: true },
      { name: 'Emmanuel Kitindi', degreeLevel: 'PhD', researchTopic: 'Numerical solutions of fractional differential equations', status: 'alumni', thesisTitle: 'Fractional Calculus Methods for Biological Systems', graduationYear: 2022, currentPosition: 'Lecturer at UDSM', published: true },
      { name: 'Amina Ramadhani', degreeLevel: 'Masters', researchTopic: 'Statistical analysis of crop yield data in Morogoro region', status: 'current', published: true },
    ],
  });
  console.log('✓ Students seeded');

  // Awards
  await prisma.award.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Best Research Paper Award', organization: 'Tanzania Mathematics Association', year: 2022, category: 'award', description: 'Awarded for outstanding contribution to mathematical modelling research.', published: true },
      { name: 'COSTECH Research Grant', organization: 'Tanzania Commission for Science and Technology', year: 2020, category: 'grant', amount: 'TZS 50,000,000', fundingPeriod: '2020–2023', description: 'Research grant for mathematical epidemiology project.', published: true },
      { name: 'Distinguished Teaching Award', organization: 'Sokoine University of Agriculture', year: 2021, category: 'honor', description: 'Recognized for excellence in mathematics teaching.', published: true },
    ],
  });
  console.log('✓ Awards seeded');

  // Blog posts
  await prisma.blogPost.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Teaching Mathematics in the Digital Age',
        slug: 'teaching-mathematics-digital-age',
        publishedAt: new Date('2024-03-15'),
        excerpt: 'Exploring how digital tools and visualization software can enhance the teaching of abstract mathematical concepts to university students.',
        content: '# Teaching Mathematics in the Digital Age\n\nMathematics education is evolving with technology. At SUA, we are integrating computational tools like MATLAB and Python into our curriculum.\n\n## Visual Learning\n\nStudents can now visualize complex functions and differential equations in real-time.\n\n## Practical Applications\n\nEvery theorem we cover is paired with real-world applications in agriculture and biology.',
        tags: ['teaching', 'mathematics', 'pedagogy'],
        draft: false,
      },
      {
        title: 'New Publication on Mathematical Epidemiology',
        slug: 'new-publication-mathematical-epidemiology',
        publishedAt: new Date('2023-11-20'),
        excerpt: 'Our latest paper on mathematical modelling of disease dynamics has been accepted in the Journal of Mathematical Biology.',
        content: '# New Publication on Mathematical Epidemiology\n\nI am pleased to announce that our paper on infectious disease modelling has been accepted for publication.\n\nThis work represents collaborative effort with colleagues from UDSM and NIMR Tanzania.',
        tags: ['research', 'mathematics', 'publication'],
        draft: false,
      },
    ],
  });
  console.log('✓ BlogPosts seeded');

  // Events
  await prisma.event.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Tanzania Mathematics Conference 2025', date: new Date('2025-08-14T09:00:00Z'), location: 'University of Dar es Salaam, Tanzania', description: 'Presenting research on mathematical modelling approaches for disease control in East Africa.', published: true },
      { name: 'SUA Research Week — Mathematics Symposium', date: new Date('2025-06-12T10:00:00Z'), location: 'SUA Main Campus, Morogoro', description: 'Annual research symposium showcasing mathematical sciences research at SUA.', published: true },
    ],
  });
  console.log('✓ Events seeded');

  // Collaborators
  await prisma.collaborator.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Prof. Livingstone Luboobi', institution: 'University of Dar es Salaam', area: 'Mathematical Epidemiology', type: 'individual', published: true },
      { name: 'Department of Mathematics, UDSM', institution: 'University of Dar es Salaam', area: 'Applied Mathematics', type: 'institution', published: true },
    ],
  });
  console.log('✓ Collaborators seeded');

  // Resources
  await prisma.resource.createMany({
    skipDuplicates: true,
    data: [
      { title: 'MT 101 Course Materials', description: 'Lecture notes and problem sets for Calculus.', url: 'https://sua.ac.tz/mt101', category: 'Teaching', published: true },
      { title: 'Mathematical Modelling Toolkit', description: 'MATLAB scripts and datasets for epidemiological modelling.', url: 'https://sua.ac.tz/math-toolkit', category: 'Research', published: true },
    ],
  });
  console.log('✓ Resources seeded');

  // Gallery
  await prisma.galleryItem.createMany({
    skipDuplicates: true,
    data: [
      { imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600', alt: 'Research group photo in the lab', caption: 'Our research group, autumn 2023', category: 'Lab', published: true },
      { imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600', alt: 'Conference presentation', caption: 'Presenting at ACM CHI 2022', category: 'Conferences', published: true },
      { imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600', alt: 'Workshop session', caption: 'NLP Workshop 2023', category: 'Workshops', published: true },
    ],
  });
  console.log('✓ GalleryItems seeded');

  // Testimonials
  await prisma.testimonial.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Joseph Masanja', role: 'PhD Student', content: 'Dr. Mbita is an exceptional mentor. His guidance in mathematical modelling has been invaluable in shaping my research direction.', published: true },
      { name: 'Happiness Mwakifuna', role: 'PhD Candidate', content: 'The research environment is outstanding. Dr. Mbita encourages creative thinking and provides excellent support throughout the PhD journey.', published: true },
      { name: 'Emmanuel Kitindi', role: 'Alumni, Lecturer at UDSM', content: 'My time under Dr. Mbita\'s supervision was transformative. The mathematical skills I developed continue to serve me well in academia.', published: true },
    ],
  });
  console.log('✓ Testimonials seeded');

  // Announcements
  await prisma.announcement.createMany({
    skipDuplicates: true,
    data: [
      { title: 'New Paper Published in Journal of Mathematical Biology', content: 'Our latest work on mathematical epidemiology has been published. Congratulations to all co-authors!', published: true },
      { title: 'MSc/PhD Positions Available', content: 'We are looking for motivated postgraduate students to join our research group in mathematical modelling. Applications open for 2025/2026.', link: '/contact', published: true },
    ],
  });
  console.log('✓ Announcements seeded');

  console.log('\n🌱 Database seeded successfully!');
  console.log('📋 Login credentials: username=Mbita, password=mbita@12345');
  console.log('🌐 Open http://localhost:3000 in your browser');
}

main()
  .catch((e) => { console.error('Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
