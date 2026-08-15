// Seed sample data for Mbita Emmanuel Academic Platform
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedData() {
  try {
    console.log('🌱 Starting to seed sample data...\n');

    // ============================================
    // 1. CREATE SAMPLE PROFILE (Professor)
    // ============================================
    console.log('📝 Creating Professor Profile...');
    const profile = await prisma.profile.create({
      data: {
        fullName: 'Dr. Mbita Deogratias Emmanuel',
        email: 'mbita.emmanuel@university.edu',
        bio: 'Associate Professor of Computer Science specializing in AI, Machine Learning, and Educational Technology. Passionate about bridging the gap between theoretical research and practical applications.',
        title: 'Associate Professor',
        department: 'Computer Science',
        institution: 'University of Technology',
        photoUrl: '/images/profile/professor.jpg',
        officeLocation: 'Building A, Room 301',
        officeHours: 'Monday & Wednesday 2:00 PM - 4:00 PM',
        academicProfiles: {
          googleScholar: 'https://scholar.google.com/citations?user=example',
          orcid: '0000-0001-2345-6789',
          researchGate: 'https://researchgate.net/profile/mbita-emmanuel',
          linkedin: 'https://linkedin.com/in/mbita-emmanuel',
          twitter: 'https://twitter.com/mbitaemmanuel',
          github: 'https://github.com/mbitaemmanuel'
        },
        education: [
          { degree: 'PhD in Computer Science', institution: 'MIT', year: 2015 },
          { degree: 'MSc in Computer Science', institution: 'Stanford University', year: 2010 },
          { degree: 'BSc in Computer Engineering', institution: 'University of Dar es Salaam', year: 2008 }
        ],
        skills: ['Machine Learning', 'Artificial Intelligence', 'Web Development', 'Cloud Computing', 'Data Science'],
        languages: ['English', 'Swahili', 'French'],
        vision: 'To revolutionize education in Africa through innovative technology solutions that bridge the digital divide.',
        mission: 'Developing accessible, affordable, and effective educational platforms for African universities.',
        whatsapp: '+255123456789',
        autoSyncEnabled: true,
      },
    });
    console.log('✅ Profile created:', profile.fullName);

    // ============================================
    // 2. CREATE SAMPLE STUDENTS
    // ============================================
    console.log('\n👨‍🎓 Creating Sample Students...');
    
    const student1 = await prisma.student.create({
      data: {
        name: 'John Mwangi',
        degreeLevel: 'PhD',
        researchTopic: 'Machine Learning Applications in Agricultural Technology',
        status: 'current',
        thesisTitle: 'Deep Learning Models for Crop Disease Prediction in East Africa',
        photoUrl: '/images/students/john.jpg',
        profileUrl: 'https://scholar.google.com/citations?user=john-example',
        achievements: {
          publications: 3,
          conferences: 5,
          awards: ['Best Paper Award - AI Conference 2024']
        },
        published: true,
      },
    });
    console.log('✅ Student created:', student1.name);

    const student2 = await prisma.student.create({
      data: {
        name: 'Sarah Kamau',
        degreeLevel: 'Masters',
        researchTopic: 'Natural Language Processing for Low-Resource African Languages',
        status: 'alumni',
        thesisTitle: 'Building NLP Models for Swahili Text Classification',
        graduationYear: 2023,
        currentPosition: 'Research Scientist at AI Research Lab',
        photoUrl: '/images/students/sarah.jpg',
        profileUrl: 'https://linkedin.com/in/sarah-kamau',
        achievements: {
          publications: 2,
          conferences: 3,
          awards: ['Outstanding Graduate Award 2023']
        },
        published: true,
      },
    });
    console.log('✅ Student created:', student2.name);

    // ============================================
    // 3. CREATE SAMPLE COURSES
    // ============================================
    console.log('\n📚 Creating Sample Courses...');
    
    const course1 = await prisma.course.create({
      data: {
        name: 'Advanced Machine Learning',
        code: 'CS401',
        term: 'Fall 2024',
        status: 'active',
        description: 'Deep dive into machine learning algorithms, neural networks, and practical applications. Students will work on real-world projects using Python and TensorFlow.',
        syllabusUrl: '/files/courses/cs401-syllabus.pdf',
        zoomUrl: 'https://zoom.us/j/cs401',
        schedule: {
          days: ['Monday', 'Wednesday'],
          time: '10:00 AM - 11:30 AM',
          location: 'Building B, Room 205'
        },
        materials: [
          { name: 'Lecture 1: Introduction to ML', url: '/files/lecture1.pdf' },
          { name: 'Assignment 1', url: '/files/assignment1.pdf' }
        ],
        published: true,
      },
    });
    console.log('✅ Course created:', course1.code, '-', course1.name);

    const course2 = await prisma.course.create({
      data: {
        name: 'Web Development & Cloud Computing',
        code: 'CS305',
        term: 'Fall 2024',
        status: 'active',
        description: 'Full-stack web development with modern frameworks (React, Next.js) and cloud deployment (AWS, Vercel). Hands-on projects building scalable applications.',
        syllabusUrl: '/files/courses/cs305-syllabus.pdf',
        zoomUrl: 'https://zoom.us/j/cs305',
        classroomUrl: 'https://classroom.google.com/cs305',
        schedule: {
          days: ['Tuesday', 'Thursday'],
          time: '2:00 PM - 3:30 PM',
          location: 'Building C, Room 101'
        },
        materials: [
          { name: 'Intro to Next.js', url: '/files/nextjs-intro.pdf' },
          { name: 'Cloud Deployment Guide', url: '/files/cloud-guide.pdf' }
        ],
        published: true,
      },
    });
    console.log('✅ Course created:', course2.code, '-', course2.name);

    // ============================================
    // 4. CREATE SAMPLE RESEARCH PROJECTS
    // ============================================
    console.log('\n🔬 Creating Sample Research Projects...');
    
    const research1 = await prisma.researchProject.create({
      data: {
        slug: 'ai-education-africa',
        title: 'AI-Powered Educational Platforms for African Universities',
        description: 'Developing intelligent tutoring systems and adaptive learning platforms tailored for African educational contexts. This research explores how AI can bridge educational gaps and improve student outcomes in resource-constrained environments.',
        status: 'active',
        startYear: 2023,
        fundingSources: [
          { name: 'African Research Council Grant', amount: 150000, currency: 'USD' }
        ],
        collaborators: [
          { name: 'Dr. Jane Ochieng', institution: 'University of Nairobi' },
          { name: 'Prof. Ahmed Hassan', institution: 'Cairo University' }
        ],
        imageUrl: '/images/research/ai-education.jpg',
        teamMembers: [
          { name: 'Dr. Mbita Emmanuel', role: 'Principal Investigator' },
          { name: 'John Mwangi', role: 'PhD Student' }
        ],
        githubUrl: 'https://github.com/ai-education-africa',
        tags: ['AI', 'Education', 'E-Learning', 'Africa', 'Adaptive Learning'],
        published: true,
      },
    });
    console.log('✅ Research created:', research1.title);

    const research2 = await prisma.researchProject.create({
      data: {
        slug: 'ml-agriculture-east-africa',
        title: 'Machine Learning for Agricultural Prediction in East Africa',
        description: 'Using ML models to predict crop yields, disease outbreaks, and optimal planting times for smallholder farmers in East Africa. The system provides SMS-based recommendations accessible to farmers without internet.',
        status: 'active',
        startYear: 2023,
        endYear: 2026,
        fundingSources: [
          { name: 'Gates Foundation Agricultural Innovation Grant', amount: 250000, currency: 'USD' }
        ],
        collaborators: [
          { name: 'Dr. Samuel Wanjala', institution: 'Agricultural Research Institute' },
          { name: 'Dr. Fatima Mohammed', institution: 'Climate Science Center' }
        ],
        imageUrl: '/images/research/ml-agriculture.jpg',
        teamMembers: [
          { name: 'Dr. Mbita Emmanuel', role: 'Principal Investigator' },
          { name: 'Sarah Kamau', role: 'Research Assistant' }
        ],
        tags: ['Machine Learning', 'Agriculture', 'Climate', 'SMS', 'Mobile'],
        published: true,
      },
    });
    console.log('✅ Research created:', research2.title);

    // ============================================
    // 5. SUMMARY
    // ============================================
    console.log('\n🎉 Sample data seeding complete!\n');
    console.log('📊 Summary:');
    console.log('   ✅ 1 Professor Profile created');
    console.log('   ✅ 2 Students created');
    console.log('   ✅ 2 Courses created');
    console.log('   ✅ 2 Research Projects created');
    console.log('\n🌐 You can now view this data on your deployed site!');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedData()
  .catch((error) => {
    console.error('Failed to seed data:', error);
    process.exit(1);
  });
