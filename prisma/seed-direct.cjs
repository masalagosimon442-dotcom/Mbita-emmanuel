/**
 * Direct MySQL seed using mysql2 (no Prisma needed)
 * Seeds the database with initial data
 */
const mysql = require('mysql2/promise');

const DB_URL = 'mysql://root:@localhost:3306/professor_website';

async function main() {
  // Parse connection URL
  const url = new URL(DB_URL);
  const conn = await mysql.createConnection({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password || '',
    database: url.pathname.slice(1),
    multipleStatements: true,
  });

  console.log('Connected to MySQL');

  // Hash password manually (bcrypt hash of 'admin123456' with cost 12)
  // Pre-computed to avoid bcrypt dependency
  const passwordHash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGniYE6Nd.NumkCODVZMtB8.2Oe';

  // Admin user
  await conn.execute(
    'INSERT INTO AdminUser (id, username, passwordHash, failedAttempts, updatedAt) VALUES (1, ?, ?, 0, NOW()) ON DUPLICATE KEY UPDATE id=id',
    ['admin', passwordHash]
  );
  console.log('✓ AdminUser seeded (username: admin, password: admin123456)');

  // Profile
  const academicProfiles = JSON.stringify([
    { label: 'Google Scholar', url: 'https://scholar.google.com' },
    { label: 'ORCID', url: 'https://orcid.org' },
    { label: 'ResearchGate', url: 'https://www.researchgate.net' },
  ]);
  await conn.execute(
    `INSERT INTO Profile (id, fullName, title, department, institution, email, officeLocation, officeHours, bio, photoUrl, cvUrl, academicProfiles, updatedAt)
     VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, '', '', ?, NOW())
     ON DUPLICATE KEY UPDATE id=id`,
    [
      'Dr. Jane Smith',
      'Professor of Computer Science',
      'Department of Computer Science',
      'University of Technology',
      'jane.smith@university.edu',
      'Building A, Room 301',
      'Monday & Wednesday, 2:00 PM – 4:00 PM',
      'Dr. Jane Smith is a Professor of Computer Science at the University of Technology, where she has been a faculty member since 2010. Her research focuses on machine learning, natural language processing, and human-computer interaction.\n\nShe received her Ph.D. in Computer Science from MIT in 2008 and completed a postdoctoral fellowship at Stanford University. She has published over 80 peer-reviewed papers and has been recognised with numerous awards for her contributions to the field.',
      academicProfiles,
    ]
  );
  console.log('✓ Profile seeded');

  // SiteSettings
  await conn.execute(
    `INSERT INTO SiteSettings (id, siteTitle, tagline, footerText, contactEmail, maintenanceMode, socialLinks, hiddenSections, updatedAt)
     VALUES (1, ?, ?, ?, ?, 0, '[]', '[]', NOW())
     ON DUPLICATE KEY UPDATE id=id`,
    [
      'Prof. Jane Smith',
      'Professor of Computer Science | University of Technology',
      '© 2024 Dr. Jane Smith. All rights reserved.',
      'jane.smith@university.edu',
    ]
  );
  console.log('✓ SiteSettings seeded');

  // Publications
  const pubs = [
    ['Advances in Neural Language Models for Scientific Text Understanding', JSON.stringify(['Jane Smith', 'Alice Johnson', 'Bob Chen']), 'Journal of Artificial Intelligence Research', 2023, 'journal', '10.1234/jair.2023.001', null],
    ['Interactive Visualisation of High-Dimensional Data in Machine Learning', JSON.stringify(['Jane Smith', 'Carlos Rivera']), 'ACM CHI Conference on Human Factors in Computing Systems', 2022, 'conference', '10.1145/chi.2022.002', null],
    ['Deep Learning for Medical Image Analysis: A Survey', JSON.stringify(['Jane Smith', 'David Nguyen', 'Sarah Kim']), 'IEEE Transactions on Medical Imaging', 2021, 'journal', null, null],
  ];
  for (const pub of pubs) {
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    await conn.execute(
      'INSERT IGNORE INTO Publication (id, title, authors, venue, year, type, doi, url, published, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())',
      [id, ...pub]
    );
  }
  console.log('✓ Publications seeded');

  // Research projects
  const projects = [
    ['nlp-scientific-discovery', 'Natural Language Processing for Scientific Discovery', 'This project investigates the use of large language models to accelerate scientific discovery by automatically extracting insights from research literature at scale.', 'active', 2021, null, JSON.stringify(['National Science Foundation', 'University Research Fund']), JSON.stringify(['MIT CSAIL', 'Stanford NLP Group']), JSON.stringify(['NLP', 'Machine Learning', 'Science'])],
    ['hci-accessibility-tools', 'Accessible Human-Computer Interaction Tools', 'Developing novel interaction paradigms and assistive technologies to make computing more accessible for users with diverse abilities.', 'completed', 2018, 2022, JSON.stringify(['NIH Accessibility Research Grant']), null, JSON.stringify(['HCI', 'Accessibility'])],
  ];
  for (const p of projects) {
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    await conn.execute(
      'INSERT IGNORE INTO ResearchProject (id, slug, title, description, status, startYear, endYear, fundingSources, collaborators, tags, published, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())',
      [id, ...p]
    );
  }
  console.log('✓ ResearchProjects seeded');

  // Courses
  const courses = [
    ['Introduction to Machine Learning', 'CS 4810', 'Fall 2024', 'active', 'A comprehensive introduction to machine learning algorithms, covering supervised and unsupervised learning, neural networks, and practical applications.', JSON.stringify([{ day: 'Monday', time: '10:00 AM', room: 'Room 201' }, { day: 'Wednesday', time: '10:00 AM', room: 'Room 201' }])],
    ['Advanced Natural Language Processing', 'CS 6320', 'Spring 2023', 'archived', 'Graduate-level course covering modern NLP techniques including transformers, pre-training, and fine-tuning.', null],
  ];
  for (const c of courses) {
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    await conn.execute(
      'INSERT IGNORE INTO Course (id, name, code, term, status, description, schedule, published, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())',
      [id, ...c]
    );
  }
  console.log('✓ Courses seeded');

  // Students
  const students = [
    ['Michael Torres', 'PhD', 'Large language models for biomedical text mining', 'current', null, null, null],
    ['Sarah Kim', 'PhD', 'Multimodal learning for scientific figure understanding', 'current', null, null, null],
    ['David Nguyen', 'PhD', 'Explainable AI for clinical decision support', 'alumni', 'Towards Interpretable Deep Learning in Healthcare', 2022, 'Research Scientist at Google Health'],
    ['Amina Hassan', 'Masters', 'Sentiment analysis for Swahili social media', 'current', null, null, null],
  ];
  for (const s of students) {
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    await conn.execute(
      'INSERT IGNORE INTO Student (id, name, degreeLevel, researchTopic, status, thesisTitle, graduationYear, currentPosition, published, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())',
      [id, ...s]
    );
  }
  console.log('✓ Students seeded');

  // Awards
  const awards = [
    ['Best Paper Award', 'ACM CHI 2022', 2022, 'award', null, null, 'Awarded for outstanding contribution to human-computer interaction research.'],
    ['NSF CAREER Award', 'National Science Foundation', 2015, 'grant', '$500,000', '2015–2020', 'Five-year grant supporting early-career faculty research in NLP.'],
    ['Distinguished Teaching Award', 'University of Technology', 2020, 'honor', null, null, 'Recognized for excellence in undergraduate teaching.'],
  ];
  for (const a of awards) {
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    await conn.execute(
      'INSERT IGNORE INTO Award (id, name, organization, year, category, amount, fundingPeriod, description, published, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())',
      [id, ...a]
    );
  }
  console.log('✓ Awards seeded');

  // Blog posts
  const posts = [
    ['Reflections on Teaching Machine Learning in 2024', 'reflections-on-teaching-ml-2024', '2024-03-15', 'As AI tools become ubiquitous, teaching machine learning requires a fresh approach that balances theory with hands-on experimentation.', '# Reflections on Teaching Machine Learning in 2024\n\nAs AI tools become ubiquitous in everyday life, teaching machine learning at the university level requires a fresh approach.\n\n## Hands-on First\n\nRather than starting with theory, I began the course with a practical project.\n\n## Ethical Considerations\n\nEvery algorithm we covered was paired with a discussion of its societal implications.', JSON.stringify(['teaching', 'machine learning', 'pedagogy'])],
    ['Our Paper on Scientific NLP Accepted at JAIR', 'scientific-nlp-paper-accepted-jair', '2023-11-20', 'Excited to share that our work on neural language models for scientific text understanding has been accepted for publication.', '# Our Paper on Scientific NLP Accepted at JAIR\n\nI am thrilled to announce that our paper has been accepted for publication in the Journal of Artificial Intelligence Research.\n\nThis work represents three years of collaborative effort with my students and colleagues.', JSON.stringify(['research', 'NLP', 'publication'])],
  ];
  for (const p of posts) {
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    await conn.execute(
      'INSERT IGNORE INTO BlogPost (id, title, slug, publishedAt, excerpt, content, tags, draft, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())',
      [id, ...p]
    );
  }
  console.log('✓ BlogPosts seeded');

  // Events
  const events = [
    ['Invited Talk: NLP for Science at Stanford AI Lab', '2025-08-14 14:00:00', 'Stanford University, Gates CS Building', 'Invited talk on applying large language models to accelerate scientific discovery.'],
    ['ACM CHI 2024 — Paper Presentation', '2024-05-12 10:00:00', 'Honolulu, Hawaii, USA', 'Presenting our paper on interactive visualisation techniques for high-dimensional ML data.'],
  ];
  for (const e of events) {
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    await conn.execute(
      'INSERT IGNORE INTO Event (id, name, date, location, description, published, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())',
      [id, ...e]
    );
  }
  console.log('✓ Events seeded');

  // Collaborators
  const collabs = [
    ['Prof. Alan Turing', 'MIT CSAIL', 'Natural Language Processing', null, 'individual'],
    ['Stanford NLP Group', 'Stanford University', 'Language Model Research', 'https://nlp.stanford.edu', 'institution'],
  ];
  for (const c of collabs) {
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    await conn.execute(
      'INSERT IGNORE INTO Collaborator (id, name, institution, area, profileUrl, type, published, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW())',
      [id, ...c]
    );
  }
  console.log('✓ Collaborators seeded');

  // Resources
  const resources = [
    ['CS 4810 Course Materials', 'Lecture slides, assignments, and datasets for Intro to ML.', 'https://university.edu/cs4810', 'Teaching'],
    ['ScientificNLP Dataset', 'Annotated corpus of 50,000 scientific abstracts for NLP.', 'https://github.com/janesmith/scientificnlp', 'Research'],
  ];
  for (const r of resources) {
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    await conn.execute(
      'INSERT IGNORE INTO Resource (id, title, description, url, category, published, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())',
      [id, ...r]
    );
  }
  console.log('✓ Resources seeded');

  // Gallery
  const gallery = [
    ['https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600', 'Research group photo in the lab', 'Our research group, autumn 2023', 'Lab'],
    ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600', 'Conference presentation', 'Presenting at ACM CHI 2022', 'Conferences'],
    ['https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600', 'Workshop session', 'NLP Workshop 2023', 'Workshops'],
  ];
  for (const g of gallery) {
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    await conn.execute(
      'INSERT IGNORE INTO GalleryItem (id, imageUrl, alt, caption, category, published, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())',
      [id, ...g]
    );
  }
  console.log('✓ GalleryItems seeded');

  // Testimonials
  const testimonials = [
    ['Michael Torres', 'PhD Student', 'Prof. Smith is an exceptional mentor. Her guidance has been invaluable in shaping my research direction and academic career.'],
    ['Sarah Kim', 'PhD Candidate', 'The research environment here is outstanding. Prof. Smith encourages creative thinking and provides excellent support throughout the PhD journey.'],
    ['David Nguyen', 'Alumni, Research Scientist at Google', "My time under Prof. Smith's supervision was transformative. The skills I developed continue to serve me well in industry."],
  ];
  for (const t of testimonials) {
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    await conn.execute(
      'INSERT IGNORE INTO Testimonial (id, name, role, content, published, createdAt, updatedAt) VALUES (?, ?, ?, ?, 1, NOW(), NOW())',
      [id, ...t]
    );
  }
  console.log('✓ Testimonials seeded');

  // Announcements
  const announcements = [
    ['New Paper Accepted at NeurIPS 2024', 'Our latest work on multimodal learning has been accepted at NeurIPS 2024. Congratulations to all co-authors!', null],
    ['PhD Position Available', 'We are looking for motivated PhD students to join our lab. Applications open for Fall 2025.', '/contact'],
  ];
  for (const a of announcements) {
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    await conn.execute(
      'INSERT IGNORE INTO Announcement (id, title, content, link, published, createdAt, updatedAt) VALUES (?, ?, ?, ?, 1, NOW(), NOW())',
      [id, ...a]
    );
  }
  console.log('✓ Announcements seeded');

  await conn.end();
  console.log('\n🌱 Database seeded successfully!');
  console.log('📋 Login: username=admin, password=admin123456');
  console.log('🌐 Open http://localhost:3000 in your browser');
}

main().catch(e => { console.error('Seed failed:', e.message); process.exit(1); });
