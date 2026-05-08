import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProfessorAvatar from "@/components/ui/ProfessorAvatar";
import rehypeSanitize from "rehype-sanitize";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import Link from "next/link";
import Image from "next/image";
import { getPhotoForSlot } from "@/lib/profilePhotos";

export const revalidate = 60;

interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  logoUrl?: string;
}

interface WorkExperienceItem {
  role: string;
  organization: string;
  period: string;
  description?: string;
}

interface SkillItem {
  name: string;
  level: number; // 0-100
}

interface CertificationItem {
  name: string;
  issuer: string;
  year: string;
  imageUrl?: string;
}

interface LeadershipItem {
  role: string;
  organization: string;
  period: string;
  description?: string;
}

interface MediaAppearanceItem {
  title: string;
  outlet: string;
  date: string;
  url?: string;
  imageUrl?: string;
  type?: string; // interview, article, podcast, tv
}

async function getProfile() {
  try {
    return await prisma.profile.findFirst();
  } catch {
    return null;
  }
}

async function getAwards() {
  try {
    return await prisma.award.findMany({
      where: { published: true },
      orderBy: { year: "desc" },
      take: 12,
      select: { id: true, name: true, organization: true, year: true, category: true, imageUrl: true },
    });
  } catch {
    return [];
  }
}

async function renderMarkdown(markdown: string): Promise<string> {
  try {
    const result = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeSanitize)
      .use(rehypeStringify)
      .process(markdown);
    return String(result);
  } catch {
    return `<p>${markdown}</p>`;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  if (!profile) return { title: "About", description: "About the professor" };
  return {
    title: "About",
    description: `Learn more about ${profile.fullName}, ${profile.title} at ${profile.institution}.`,
    openGraph: {
      title: `About — ${profile.fullName}`,
      description: `${profile.fullName} is ${profile.title} at ${profile.institution}.`,
      images: profile.photoUrl ? [{ url: profile.photoUrl }] : [],
    },
  };
}

export default async function AboutPage() {
  const [profile, awards] = await Promise.all([getProfile(), getAwards()]);

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-gray-600">Profile information not available.</p>
      </div>
    );
  }

  const bioHtml = await renderMarkdown(profile.bio);
  const education = Array.isArray(profile.education) ? (profile.education as unknown as EducationItem[]) : [];
  const workExperience = Array.isArray(profile.workExperience) ? (profile.workExperience as unknown as WorkExperienceItem[]) : [];
  const skills = Array.isArray(profile.skills) ? (profile.skills as unknown as SkillItem[]) : [];
  const certifications = Array.isArray(profile.certifications) ? (profile.certifications as unknown as CertificationItem[]) : [];
  const memberships = Array.isArray(profile.memberships) ? (profile.memberships as unknown as string[]) : [];
  const languages = Array.isArray(profile.languages) ? (profile.languages as unknown as string[]) : [];
  const leadershipPositions = Array.isArray(profile.leadershipPositions) ? (profile.leadershipPositions as unknown as LeadershipItem[]) : [];
  const mediaAppearances = Array.isArray(profile.mediaAppearances) ? (profile.mediaAppearances as unknown as MediaAppearanceItem[]) : [];
  // Use about-specific photo slot
  const aboutPhoto = getPhotoForSlot(profile, "about");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-navy-900 mb-10">About</h1>

      {/* ── PROFILE HEADER ── */}
      <section className="flex flex-col md:flex-row gap-8 mb-14">
        <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-4">
          <ProfessorAvatar
            photoUrl={aboutPhoto || profile.photoUrl}
            alt={`${profile.fullName} — ${profile.title}`}
            width={200}
            height={200}
            className="shadow-md"
          />
          <div className="text-center md:text-left">
            <p className="font-bold text-navy-900 text-lg">{profile.fullName}</p>
            <p className="text-navy-700">{profile.title}</p>
            <p className="text-navy-600 text-sm">{profile.department}</p>
            <p className="text-navy-600 text-sm">{profile.institution}</p>
          </div>
          {/* Download CV */}
          <a
            href={profile.cvUrl || "/cv.pdf"}
            download="curriculum-vitae.pdf"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download CV
          </a>
        </div>

        <div className="flex-1">
          {/* Biography */}
          <article
            className="prose prose-navy max-w-none text-navy-700 leading-relaxed mb-6"
            dangerouslySetInnerHTML={{ __html: bioHtml }}
          />

          {/* Vision & Mission */}
          {(profile.vision || profile.mission) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {profile.vision && (
                <div className="p-5 bg-navy-50 rounded-xl border border-navy-100">
                  <h3 className="font-semibold text-navy-900 mb-2 flex items-center gap-2">
                    <span aria-hidden="true">🎯</span> Vision
                  </h3>
                  <p className="text-navy-700 text-sm leading-relaxed">{profile.vision}</p>
                </div>
              )}
              {profile.mission && (
                <div className="p-5 bg-primary-light rounded-xl border border-navy-100">
                  <h3 className="font-semibold text-navy-900 mb-2 flex items-center gap-2">
                    <span aria-hidden="true">🚀</span> Mission
                  </h3>
                  <p className="text-navy-700 text-sm leading-relaxed">{profile.mission}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── VIDEO INTRODUCTION ── */}
      {profile.videoIntroUrl && (
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-navy-900 mb-6">Video Introduction</h2>
          <div className="aspect-video max-w-3xl rounded-xl overflow-hidden shadow-lg">
            <iframe
              src={profile.videoIntroUrl}
              title="Professor video introduction"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </section>
      )}

      {/* ── EDUCATION HISTORY ── */}
      {education.length > 0 && (
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-navy-900 mb-6">Education</h2>
          <div className="relative border-l-2 border-primary-light pl-8 space-y-8">
            {education.map((edu, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[2.6rem] w-4 h-4 rounded-full bg-primary border-2 border-white shadow" aria-hidden="true" />
                <div className="flex items-start gap-4">
                  {edu.logoUrl && (
                    <Image
                      src={edu.logoUrl}
                      alt={edu.institution}
                      width={48}
                      height={48}
                      className="rounded-lg object-contain flex-shrink-0 border border-border bg-white p-1"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-navy-900">{edu.degree}</p>
                    <p className="text-navy-700">{edu.institution}</p>
                    <p className="text-sm text-navy-500">{edu.year}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── WORK EXPERIENCE TIMELINE ── */}
      {workExperience.length > 0 && (
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-navy-900 mb-6">Professional Journey</h2>
          <div className="relative border-l-2 border-primary-light pl-8 space-y-8">
            {workExperience.map((exp, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[2.6rem] w-4 h-4 rounded-full bg-accent-blue border-2 border-white shadow" aria-hidden="true" />
                <p className="font-semibold text-navy-900">{exp.role}</p>
                <p className="text-navy-700">{exp.organization}</p>
                <p className="text-sm text-navy-500 mb-1">{exp.period}</p>
                {exp.description && <p className="text-sm text-navy-600">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── SKILLS ── */}
      {skills.length > 0 && (
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-navy-900 mb-6">Skills &amp; Expertise</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills.map((skill, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-navy-800">{skill.name}</span>
                  <span className="text-sm text-navy-500">{skill.level}%</span>
                </div>
                <div className="w-full bg-navy-100 rounded-full h-2.5" role="progressbar" aria-valuenow={skill.level} aria-valuemin={0} aria-valuemax={100} aria-label={`${skill.name}: ${skill.level}%`}>
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-700"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── CERTIFICATIONS ── */}
      {certifications.length > 0 && (
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-navy-900 mb-6">Certifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-white border border-border rounded-xl">
                {cert.imageUrl ? (
                  <Image
                    src={cert.imageUrl}
                    alt={cert.name}
                    width={56}
                    height={56}
                    className="rounded-lg object-contain flex-shrink-0 border border-border bg-white p-1"
                  />
                ) : (
                  <div className="w-14 h-14 bg-accent-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-navy-900 text-sm">{cert.name}</p>
                  <p className="text-navy-600 text-xs">{cert.issuer}</p>
                  <p className="text-navy-400 text-xs">{cert.year}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── MEMBERSHIPS & LANGUAGES ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
        {memberships.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Professional Memberships</h2>
            <ul className="space-y-2">
              {memberships.map((m, i) => (
                <li key={i} className="flex items-center gap-2 text-navy-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" aria-hidden="true" />
                  {m}
                </li>
              ))}
            </ul>
          </section>
        )}

        {languages.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Languages</h2>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang, i) => (
                <span key={i} className="px-3 py-1.5 bg-navy-100 text-navy-800 text-sm rounded-full font-medium">
                  {lang}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── LEADERSHIP POSITIONS ── */}
      {leadershipPositions.length > 0 && (
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-navy-900 mb-6">Leadership Positions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leadershipPositions.map((pos, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-white border border-border rounded-xl hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl" aria-hidden="true">👑</span>
                </div>
                <div>
                  <p className="font-semibold text-navy-900">{pos.role}</p>
                  <p className="text-navy-700 text-sm">{pos.organization}</p>
                  <p className="text-navy-500 text-xs mt-0.5">{pos.period}</p>
                  {pos.description && <p className="text-navy-600 text-sm mt-1">{pos.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── MEDIA APPEARANCES ── */}
      {mediaAppearances.length > 0 && (
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-navy-900 mb-6">Media Appearances</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaAppearances.map((media, i) => (
              <div key={i} className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                {media.imageUrl ? (
                  <Image src={media.imageUrl} alt={media.title} width={400} height={160} className="w-full h-36 object-cover" />
                ) : (
                  <div className="w-full h-24 bg-gradient-to-br from-navy-50 to-navy-100 flex items-center justify-center">
                    <span className="text-3xl" aria-hidden="true">
                      {media.type === "podcast" ? "🎙️" : media.type === "tv" ? "📺" : media.type === "interview" ? "🎤" : "📰"}
                    </span>
                  </div>
                )}
                <div className="p-4">
                  {media.type && (
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">{media.type}</span>
                  )}
                  <p className="font-semibold text-navy-900 text-sm mt-1 line-clamp-2">{media.title}</p>
                  <p className="text-navy-600 text-xs mt-0.5">{media.outlet}</p>
                  <p className="text-navy-400 text-xs">{media.date}</p>
                  {media.url && (
                    <a href={media.url} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline mt-2 inline-block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">
                      View →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── ACHIEVEMENT GALLERY ── */}
      {awards.length > 0 && (
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-navy-900 mb-6">Achievement Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {awards.map((award, i) => (
              <div key={i} className="group bg-white border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                {award.imageUrl ? (
                  <div className="relative h-36 overflow-hidden">
                    <Image src={award.imageUrl} alt={award.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 50vw, 25vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs font-semibold line-clamp-2">{award.name}</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-36 bg-gradient-to-br from-amber-50 to-amber-100 flex flex-col items-center justify-center p-3">
                    <span className="text-3xl mb-2" aria-hidden="true">
                      {award.category === "award" ? "🏆" : award.category === "grant" ? "💰" : award.category === "fellowship" ? "🎓" : "⭐"}
                    </span>
                    <p className="text-amber-900 text-xs font-semibold text-center line-clamp-2">{award.name}</p>
                  </div>
                )}
                <div className="p-3">
                  <p className="text-navy-600 text-xs">{award.organization}</p>
                  <p className="text-navy-400 text-xs">{award.year}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── BACK TO HOME ── */}
      <div className="mt-8">
        <Link href="/" className="text-primary hover:underline text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
