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
      academicProfiles: [
        { label: 'Google Scholar', url: 'https://scholar.google.com/citations?user=example' },
        { label: 'ORCID', url: 'https://orcid.org/0000-0000-0000-0000' },
        { label: 'ResearchGate', url: 'https://www.researchgate.net/profile/Example' },
        { label: 'LinkedIn', url: 'https://www.linkedin.com/in/example' },
        { label: 'GitHub', url: 'https://github.com/example' },
        { label: 'Twitter/X', url: 'https://x.com/example' },
        { label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=example' },
        { label: 'Semantic Scholar', url: 'https://www.semanticscholar.org/author/example' },
        { label: 'Academia.edu', url: 'https://university.academia.edu/example' },
        { label: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=example' },
        { label: 'Web of Science', url: 'https://www.webofscience.com/wos/author/record/example' },
        { label: 'Mendeley', url: 'https://www.mendeley.com/profiles/example' },
        { label: 'IEEE', url: 'https://ieeexplore.ieee.org/author/example' },
        { label: 'arXiv', url: 'https://arxiv.org/search/?query=example' },
      ],
    },
    create: {
      id: 1,
      fullName: 'Dr. Jane Smith',
      title: 'Professor of Computer Science',
      department: 'Department of Computer Science',
      institution: 'University of Technology',
      email: 'jane.smith@university.edu',
      officeLocation: 'Building A, Room 301',
      officeHours: 'Monday & Wednesday, 2:00 PM – 4:00 PM',
      bio: `Dr. Jane Smith is a Professor of Computer Science at the University of Technology, where she has been a faculty member since 2010. Her research focuses on machine learning, natural language processing, and human-computer interaction.\n\nShe received her Ph.D. in Computer Science from MIT in 2008 and completed a postdoctoral fellowship at Stanford University. She has published over 80 peer-reviewed papers and has been recognised with numerous awards for her contributions to the field.\n\nDr. Smith is passionate about mentoring the next generation of researchers and has supervised more than 20 doctoral students throughout her career.`,
      photoUrl: '',
      cvUrl: '',
      academicProfiles: [
        { label: 'Google Scholar', url: 'https://scholar.google.com/citations?user=example' },
        { label: 'ORCID', url: 'https://orcid.org/0000-0000-0000-0000' },
        { label: 'ResearchGate', url: 'https://www.researchgate.net/profile/Example' },
        { label: 'LinkedIn', url: 'https://www.linkedin.com/in/example' },
        { label: 'GitHub', url: 'https://github.com/example' },
        { label: 'Twitter/X', url: 'https://x.com/example' },
        { label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=example' },
        { label: 'Semantic Scholar', url: 'https://www.semanticscholar.org/author/example' },
        { label: 'Academia.edu', url: 'https://university.academia.edu/example' },
        { label: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=example' },
        { label: 'Web of Science', url: 'https://www.webofscience.com/wos/author/record/example' },
        { label: 'Mendeley', url: 'https://www.mendeley.com/profiles/example' },
        { label: 'IEEE', url: 'https://ieeexplore.ieee.org/author/example' },
        { label: 'arXiv', url: 'https://arxiv.org/search/?query=example' },
      ],
    },
  });
  console.log('✓ Profile seeded');

  // SiteSettings
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteTitle: 'Prof. Jane Smith',
      tagline: 'Professor of Computer Science | University of Technology',
      footerText: '© 2024 Dr. Jane Smith',
      contactEmail: 'jane.smith@university.edu',
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
        title: 'Advances in Neural Language Models for Scientific Text Understanding',
        authors: ['Jane Smith', 'Alice Johnson', 'Bob Chen'],
        venue: 'Journal of Artificial Intelligence Research',
        year: 2023,
        type: 'journal',
        doi: '10.1234/jair.2023.001',
        abstract: 'We present a novel approach to scientific text understanding using transformer-based language models.',
        published: true,
      },
      {
        title: 'Interactive Visualisation of High-Dimensional Data in Machine Learning',
        authors: ['Jane Smith', 'Carlos Rivera'],
        venue: 'ACM CHI Conference on Human Factors in Computing Systems',
        year: 2022,
        type: 'conference',
        doi: '10.1145/chi.2022.002',
        published: true,
      },
      {
        title: 'Deep Learning for Medical Image Analysis: A Survey',
        authors: ['Jane Smith', 'David Nguyen', 'Sarah Kim'],
        venue: 'IEEE Transactions on Medical Imaging',
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
        slug: 'nlp-scientific-discovery',
        title: 'Natural Language Processing for Scientific Discovery',
        description: 'This project investigates the use of large language models to accelerate scientific discovery by automatically extracting insights from research literature at scale.',
        status: 'active',
        startYear: 2021,
        fundingSources: ['National Science Foundation', 'University Research Fund'],
        collaborators: ['MIT CSAIL', 'Stanford NLP Group'],
        tags: ['NLP', 'Machine Learning', 'Science'],
        published: true,
      },
      {
        slug: 'hci-accessibility-tools',
        title: 'Accessible Human-Computer Interaction Tools',
        description: 'Developing novel interaction paradigms and assistive technologies to make computing more accessible for users with diverse abilities.',
        status: 'completed',
        startYear: 2018,
        endYear: 2022,
        fundingSources: ['NIH Accessibility Research Grant'],
        tags: ['HCI', 'Accessibility'],
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
        name: 'Introduction to Machine Learning',
        code: 'CS 4810',
        term: 'Fall 2024',
        status: 'active',
        description: 'A comprehensive introduction to machine learning algorithms, covering supervised and unsupervised learning, neural networks, and practical applications.',
        schedule: [{ day: 'Monday', time: '10:00 AM', room: 'Room 201' }, { day: 'Wednesday', time: '10:00 AM', room: 'Room 201' }],
        published: true,
      },
      {
        name: 'Advanced Natural Language Processing',
        code: 'CS 6320',
        term: 'Spring 2023',
        status: 'archived',
        description: 'Graduate-level course covering modern NLP techniques including transformers, pre-training, and fine-tuning.',
        published: true,
      },
    ],
  });
  console.log('✓ Courses seeded');

  // Students
  await prisma.student.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Michael Torres', degreeLevel: 'PhD', researchTopic: 'Large language models for biomedical text mining', status: 'current', published: true },
      { name: 'Sarah Kim', degreeLevel: 'PhD', researchTopic: 'Multimodal learning for scientific figure understanding', status: 'current', published: true },
      { name: 'David Nguyen', degreeLevel: 'PhD', researchTopic: 'Explainable AI for clinical decision support', status: 'alumni', thesisTitle: 'Towards Interpretable Deep Learning in Healthcare', graduationYear: 2022, currentPosition: 'Research Scientist at Google Health', published: true },
      { name: 'Amina Hassan', degreeLevel: 'Masters', researchTopic: 'Sentiment analysis for Swahili social media', status: 'current', published: true },
    ],
  });
  console.log('✓ Students seeded');

  // Awards
  await prisma.award.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Best Paper Award', organization: 'ACM CHI 2022', year: 2022, category: 'award', description: 'Awarded for outstanding contribution to human-computer interaction research.', published: true },
      { name: 'NSF CAREER Award', organization: 'National Science Foundation', year: 2015, category: 'grant', amount: '$500,000', fundingPeriod: '2015–2020', description: 'Five-year grant supporting early-career faculty research in NLP.', published: true },
      { name: 'Distinguished Teaching Award', organization: 'University of Technology', year: 2020, category: 'honor', description: 'Recognized for excellence in undergraduate teaching.', published: true },
    ],
  });
  console.log('✓ Awards seeded');

  // Blog posts
  await prisma.blogPost.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Reflections on Teaching Machine Learning in 2024',
        slug: 'reflections-on-teaching-ml-2024',
        publishedAt: new Date('2024-03-15'),
        excerpt: 'As AI tools become ubiquitous, teaching machine learning requires a fresh approach that balances theory with hands-on experimentation.',
        content: '# Reflections on Teaching Machine Learning in 2024\n\nAs AI tools become ubiquitous in everyday life, teaching machine learning at the university level requires a fresh approach.\n\n## Hands-on First\n\nRather than starting with theory, I began the course with a practical project: students built a simple image classifier in the first week.\n\n## Ethical Considerations\n\nEvery algorithm we covered was paired with a discussion of its societal implications.',
        tags: ['teaching', 'machine learning', 'pedagogy'],
        draft: false,
      },
      {
        title: 'Our Paper on Scientific NLP Accepted at JAIR',
        slug: 'scientific-nlp-paper-accepted-jair',
        publishedAt: new Date('2023-11-20'),
        excerpt: 'Excited to share that our work on neural language models for scientific text understanding has been accepted for publication.',
        content: '# Our Paper on Scientific NLP Accepted at JAIR\n\nI am thrilled to announce that our paper has been accepted for publication in the Journal of Artificial Intelligence Research.\n\nThis work represents three years of collaborative effort with my students and colleagues.',
        tags: ['research', 'NLP', 'publication'],
        draft: false,
      },
    ],
  });
  console.log('✓ BlogPosts seeded');

  // Events
  await prisma.event.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Invited Talk: NLP for Science at Stanford AI Lab', date: new Date('2025-08-14T14:00:00Z'), location: 'Stanford University, Gates CS Building', description: 'Invited talk on applying large language models to accelerate scientific discovery.', published: true },
      { name: 'ACM CHI 2024 — Paper Presentation', date: new Date('2024-05-12T10:00:00Z'), location: 'Honolulu, Hawaii, USA', description: 'Presenting our paper on interactive visualisation techniques for high-dimensional ML data.', published: true },
    ],
  });
  console.log('✓ Events seeded');

  // Collaborators
  await prisma.collaborator.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Prof. Alan Turing', institution: 'MIT CSAIL', area: 'Natural Language Processing', type: 'individual', published: true },
      { name: 'Stanford NLP Group', institution: 'Stanford University', area: 'Language Model Research', type: 'institution', profileUrl: 'https://nlp.stanford.edu', published: true },
    ],
  });
  console.log('✓ Collaborators seeded');

  // Resources
  await prisma.resource.createMany({
    skipDuplicates: true,
    data: [
      { title: 'CS 4810 Course Materials', description: 'Lecture slides, assignments, and datasets for Intro to ML.', url: 'https://university.edu/cs4810', category: 'Teaching', published: true },
      { title: 'ScientificNLP Dataset', description: 'Annotated corpus of 50,000 scientific abstracts for NLP benchmarking.', url: 'https://github.com/janesmith/scientificnlp', category: 'Research', published: true },
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
      { name: 'Michael Torres', role: 'PhD Student', content: 'Prof. Smith is an exceptional mentor. Her guidance has been invaluable in shaping my research direction and academic career.', published: true },
      { name: 'Sarah Kim', role: 'PhD Candidate', content: 'The research environment here is outstanding. Prof. Smith encourages creative thinking and provides excellent support throughout the PhD journey.', published: true },
      { name: 'David Nguyen', role: 'Alumni, Research Scientist at Google', content: 'My time under Prof. Smith\'s supervision was transformative. The skills I developed continue to serve me well in industry.', published: true },
    ],
  });
  console.log('✓ Testimonials seeded');

  // Announcements
  await prisma.announcement.createMany({
    skipDuplicates: true,
    data: [
      { title: 'New Paper Accepted at NeurIPS 2024', content: 'Our latest work on multimodal learning has been accepted at NeurIPS 2024. Congratulations to all co-authors!', published: true },
      { title: 'PhD Position Available', content: 'We are looking for motivated PhD students to join our lab. Applications open for Fall 2025.', link: '/contact', published: true },
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
