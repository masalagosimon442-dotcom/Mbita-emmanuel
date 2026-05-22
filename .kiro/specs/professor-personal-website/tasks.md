# Implementation Plan: Professor Personal Website

## Overview

Implement a full-stack academic personal website using Next.js 14 (App Router), TypeScript, PostgreSQL, Prisma ORM, Tailwind CSS, iron-session, bcryptjs, nodemailer, zod, and fast-check. The implementation follows a bottom-up order: project scaffolding → database schema → shared layout → public pages → admin panel → contact form → error pages → SEO → accessibility hardening → property-based tests → integration tests → performance validation.

## Tasks

- [x] 1. Project scaffolding and environment setup
  - Bootstrap a Next.js 14 App Router project with TypeScript and Tailwind CSS (`create-next-app`)
  - Install all required dependencies: `prisma`, `@prisma/client`, `iron-session`, `bcryptjs`, `nodemailer`, `zod`, `fast-check`, `jest`, `@testing-library/react`, `@testing-library/jest-dom`, `jest-axe`, `remark`, `rehype-sanitize`, `@types/bcryptjs`, `@types/nodemailer`
  - Create `.env.example` listing all required variables: `DATABASE_URL`, `SESSION_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `PROFESSOR_EMAIL`
  - Configure `jest.config.ts` with `ts-jest`, `jsdom` environment, and module name mapper for `@/` path alias
  - Configure `tailwind.config.ts` with a custom colour palette that meets WCAG 4.5:1 contrast for body text and 3:1 for large text
  - Add `eslint-plugin-jsx-a11y` to ESLint config
  - Create `lib/prisma.ts` singleton with the global pattern to prevent connection pool exhaustion during hot reloads
  - Create `lib/session.ts` exporting `sessionOptions` for iron-session (cookie name, password from `SESSION_SECRET`, `httpOnly`, `secure`, `sameSite: "lax"`)
  - _Requirements: 7.1, 9.4_


- [x] 2. Database schema and migrations
  - Write `prisma/schema.prisma` defining all models: `Profile`, `Publication`, `ResearchProject`, `Course`, `Student`, `Award`, `BlogPost`, `Event`, `Collaborator`, `Resource`, `GalleryItem`, `AdminUser` with all fields, enums, and relations exactly as specified in the design
  - Run `prisma migrate dev --name init` to generate and apply the initial migration
  - Run `prisma generate` to produce the typed Prisma client
  - Write a `prisma/seed.ts` script that inserts one sample row for each model (including a hashed admin password via `bcryptjs` with cost factor 12) so the app is immediately usable after setup
  - Add `"prisma": { "seed": "ts-node prisma/seed.ts" }` to `package.json`
  - _Requirements: 8.1, 8.2, 15.1_

- [x] 3. Shared layout components
  - [x] 3.1 Implement skip-to-content link
    - Add a visually hidden `<a href="#main-content">Skip to main content</a>` as the first focusable element in the root layout; make it visible on `:focus-visible` using Tailwind
    - _Requirements: 7.1, 7.4_
  - [x] 3.2 Implement Navbar component
    - Create `components/layout/Navbar.tsx` with links to all 12 sections in the specified order: Home, About, Research & Projects, Teaching & Courses, Publications, Students & Supervision, CV & Achievements, Blog / News & Events, Collaborations & Resources, Gallery, Contact, Login / Admin Panel
    - Display a small circular thumbnail of the professor's photo (40×40px, `rounded-full`) beside the site title using Next.js `<Image>` with `alt="{fullName}"` and a placeholder avatar SVG fallback when `photoUrl` is null
    - Use `usePathname()` to apply `aria-current="page"` and a visual highlight class to the active link
    - Render a hamburger button below 768 px that toggles a full-width dropdown; ensure the toggle button has `aria-expanded` and `aria-controls`
    - Style the Login / Admin Panel link as a visually distinct outlined button at the far right of the desktop nav
    - Wrap the nav in `<nav aria-label="Main navigation">`
    - _Requirements: 1.7, 1.10, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  - [ ]* 3.3 Write property test for active navigation link indicator
    - **Property 1: Active navigation link indicator**
    - **Validates: Requirements 2.4**
    - Generate arbitrary valid pathnames with fast-check; render Navbar with each pathname; assert exactly one link has `aria-current="page"` and its `href` matches the pathname
    - Tag: `// Feature: professor-personal-website, Property 1: Active navigation link indicator`
  - [x] 3.4 Implement Footer component
    - Create `components/layout/Footer.tsx` with copyright notice, quick links, and the professor's email
    - Display a small circular thumbnail of the professor's photo (48×48px, `rounded-full`) beside the professor's name and title using Next.js `<Image>` with `alt="{fullName}"` and a placeholder avatar SVG fallback
    - _Requirements: 1.9, 1.10, 2.3_
  - [x] 3.5 Implement root layout
    - Create `app/layout.tsx` wrapping all pages with the skip link, Navbar, `<main id="main-content">`, and Footer
    - Set viewport meta tag; use `rem`/`em` units for font sizes
    - _Requirements: 7.1, 7.2_
  - [x] 3.6 Implement shared UI primitives
    - Create `components/ui/Button.tsx`, `Card.tsx`, `Badge.tsx`, `Modal.tsx`, `Pagination.tsx`, `SearchFilter.tsx`
    - Create `components/ui/ProfessorAvatar.tsx` — a reusable component that accepts `photoUrl`, `alt`, `width`, `height`, and `className` props; renders a Next.js `<Image>` when `photoUrl` is set, or a placeholder SVG avatar when it is null/empty; always applies `rounded-full` for circular display
    - Ensure all interactive elements have visible `focus-visible:ring-2` focus indicators and correct ARIA attributes
    - _Requirements: 1.10, 7.1, 7.3, 7.4_


- [x] 4. Home page
  - Create `app/(public)/page.tsx` as an SSG page
  - Fetch the singleton `Profile` row from PostgreSQL via Prisma at build time
  - Display full name, academic title, institutional affiliation, department, and biographical summary
  - Render the professor's photo as a large hero image using Next.js `<Image>` with `priority` (LCP element), `width={300}`, `height={300}`, and `alt="{fullName} — {title}"`; fall back to a placeholder avatar SVG if `photoUrl` is null
  - Display links to academic profiles (Google Scholar, ORCID, etc.) from `Profile.academicProfiles`
  - Export `generateMetadata()` returning `title`, `description`, `og:title`, `og:description`, `og:image` (professor photo URL), `og:type: "profile"`
  - _Requirements: 1.1, 1.2, 1.5, 1.6, 1.10, 6.4, 9.2, 9.3_

- [x] 5. About page
  - Create `app/(public)/about/page.tsx` as an SSG page
  - Fetch `Profile` and render the full biography (Markdown → HTML via `remark` + `rehype-sanitize`)
  - Display the professor's photo at 200×200px rounded beside the biography text using Next.js `<Image>` with `alt="{fullName} — {title}"`; fall back to placeholder avatar if `photoUrl` is null
  - Export `generateMetadata()` with page-specific title and description
  - _Requirements: 1.3, 1.6, 1.10, 9.2, 9.3_

- [x] 6. Research & Projects section
  - [x] 6.1 Implement ResearchCard component
    - Create `components/sections/ResearchCard.tsx` displaying title, description (truncated), status badge (active/completed), and an optional external link
    - _Requirements: 3.1, 3.4_
  - [x] 6.2 Implement Research list page
    - Create `app/(public)/research/page.tsx` with ISR (`revalidate: 60`)
    - Fetch all `ResearchProject` rows; render a list of `ResearchCard` components
    - Display the professor's research interests as a labeled section (from `Profile.bio` or a dedicated field)
    - Export `generateMetadata()`
    - _Requirements: 3.1, 3.3, 9.2, 9.3_
  - [x] 6.3 Implement Research detail page
    - Create `app/(public)/research/[slug]/page.tsx` with ISR
    - Fetch a single `ResearchProject` by slug; display full description (Markdown), funding sources, collaborators, and timeline
    - Implement `generateStaticParams()` to pre-render all slugs at build time
    - Export `generateMetadata()` with project-specific title and description
    - _Requirements: 3.2, 3.4, 9.2, 9.3_

- [x] 7. Publications section
  - [x] 7.1 Implement PublicationCard component
    - Create `components/sections/PublicationCard.tsx` displaying title, authors, venue, year, type badge, and an optional DOI/URL link
    - _Requirements: 4.2, 4.3_
  - [ ]* 7.2 Write property test for publication card required fields
    - **Property 3: Publication card required fields**
    - **Validates: Requirements 4.2**
    - Generate arbitrary `Publication` objects with fast-check; render `PublicationCard`; assert title, authors, venue, year, and type are all present in the output
    - Tag: `// Feature: professor-personal-website, Property 3: Publication card required fields`
  - [x] 7.3 Implement publication filter and search utilities
    - Create `lib/publications.ts` with `filterByType(publications, type)` and `searchByKeyword(publications, keyword)` pure functions
    - `filterByType` returns only publications whose `type` equals the selected value
    - `searchByKeyword` returns publications whose `title` or any entry in `authors` contains the keyword (case-insensitive)
    - _Requirements: 4.4, 4.5_
  - [ ]* 7.4 Write property test for publication type filter
    - **Property 4: Publication type filter correctness**
    - **Validates: Requirements 4.4**
    - Generate arbitrary publication arrays and type values; assert every result has the selected type and no non-matching publication appears
    - Tag: `// Feature: professor-personal-website, Property 4: Publication type filter correctness`
  - [ ]* 7.5 Write property test for publication keyword search
    - **Property 5: Publication keyword search correctness**
    - **Validates: Requirements 4.5**
    - Generate arbitrary publication arrays and non-empty keyword strings; assert every result matches the keyword in title or authors and no non-matching publication appears
    - Tag: `// Feature: professor-personal-website, Property 5: Publication keyword search correctness`
  - [x] 7.6 Implement Publications list page
    - Create `app/(public)/publications/page.tsx` with ISR (`revalidate: 60`)
    - Fetch all `Publication` rows sorted by `year` descending
    - Render `SearchFilter` and type-filter controls wired to `filterByType` and `searchByKeyword`
    - Render filtered results as `PublicationCard` list
    - Add `schema.org/ScholarlyArticle` JSON-LD structured data for each publication
    - Export `generateMetadata()`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 9.2, 9.3_
  - [ ]* 7.7 Write property test for publications sorted by year descending
    - **Property 2: Publications sorted by year descending**
    - **Validates: Requirements 4.1**
    - Generate random publication arrays with varying years; assert the rendered list is sorted such that each adjacent pair satisfies `earlier.year >= later.year`
    - Tag: `// Feature: professor-personal-website, Property 2: Publications sorted by year descending`


- [x] 8. Teaching & Courses section
  - [x] 8.1 Implement CourseCard component
    - Create `components/sections/CourseCard.tsx` displaying course name, code, academic term, status badge (active/archived), and an optional syllabus/external link
    - _Requirements: 5.1, 5.2, 5.3_
  - [ ]* 8.2 Write property test for course card required fields and status
    - **Property 6: Course card required fields and status**
    - **Validates: Requirements 5.1, 5.2**
    - Generate arbitrary `Course` objects; render `CourseCard`; assert name, code, term, and status indicator are all present
    - Tag: `// Feature: professor-personal-website, Property 6: Course card required fields and status`
  - [x] 8.3 Implement course separation utility
    - Create `lib/courses.ts` with `separateCourses(courses)` returning `{ active, archived }` partitions
    - _Requirements: 5.4_
  - [ ]* 8.4 Write property test for active and archived course separation
    - **Property 7: Active and archived courses are separated**
    - **Validates: Requirements 5.4**
    - Generate mixed course arrays; call `separateCourses`; assert active courses appear only in the active partition and archived courses only in the archived partition with no overlap
    - Tag: `// Feature: professor-personal-website, Property 7: Active and archived courses are separated`
  - [x] 8.5 Implement Teaching list page
    - Create `app/(public)/teaching/page.tsx` with ISR (`revalidate: 60`)
    - Fetch all `Course` rows; use `separateCourses` to split them; render two labeled sections with `CourseCard` lists
    - Export `generateMetadata()`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 9.2, 9.3_

- [x] 9. Students & Supervision section
  - [x] 9.1 Implement StudentCard component
    - Create `components/sections/StudentCard.tsx`
    - For `status === "current"`: display name, degree level, research topic, and optional profile link
    - For `status === "alumni"`: additionally display thesis title, graduation year, and current position
    - _Requirements: 10.1, 10.2, 10.4_
  - [ ]* 9.2 Write property test for student card required fields
    - **Property 13: Student and alumni card required fields**
    - **Validates: Requirements 10.1, 10.2**
    - Generate `Student` objects for both statuses; render `StudentCard`; assert required fields per status are present
    - Tag: `// Feature: professor-personal-website, Property 13: Student and alumni card required fields`
  - [x] 9.3 Implement student separation utility
    - Create `lib/students.ts` with `separateStudents(students)` returning `{ current, alumni }` partitions
    - _Requirements: 10.3_
  - [ ]* 9.4 Write property test for current students and alumni separation
    - **Property 12: Current students and alumni are separated**
    - **Validates: Requirements 10.3**
    - Generate mixed student arrays; call `separateStudents`; assert current students appear only in the current partition and alumni only in the alumni partition
    - Tag: `// Feature: professor-personal-website, Property 12: Current students and alumni are separated`
  - [x] 9.5 Implement Students & Supervision page
    - Create `app/(public)/students/page.tsx` with ISR (`revalidate: 60`)
    - Fetch all `Student` rows; use `separateStudents` to split; render two labeled sections
    - Display "no current students" message when the current partition is empty
    - Export `generateMetadata()`
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 9.2, 9.3_

- [x] 10. CV & Achievements section
  - [x] 10.1 Implement AwardCard component
    - Create `components/sections/AwardCard.tsx` displaying award name, granting organization, year, and optional description
    - _Requirements: 11.1, 11.2, 11.3_
  - [ ]* 10.2 Write property test for award card required fields
    - **Property 14: Award card required fields**
    - **Validates: Requirements 11.1**
    - Generate arbitrary `Award` objects; render `AwardCard`; assert name, organization, and year are all present
    - Tag: `// Feature: professor-personal-website, Property 14: Award card required fields`
  - [x] 10.3 Implement CV page
    - Create `app/(public)/cv/page.tsx` with ISR (`revalidate: 60`)
    - Fetch all `Award` rows; group by `category` (award, grant, fellowship, honor, distinction) and render each group in a labeled section
    - Render a "Download CV" link pointing to `/cv.pdf` with `download` attribute and descriptive filename; set correct MIME type via response headers
    - Export `generateMetadata()`
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 9.2, 9.3_


- [x] 11. Blog / News & Events section
  - [x] 11.1 Implement BlogPostCard component
    - Create `components/sections/BlogPostCard.tsx` displaying title, publication date, and excerpt (≤ 200 characters)
    - _Requirements: 12.1, 12.2_
  - [x] 11.2 Implement blog excerpt validation utility
    - Create `lib/blog.ts` with `validateExcerpt(excerpt: string): string` that truncates to 200 characters if needed
    - _Requirements: 12.2_
  - [ ]* 11.3 Write property test for blog post excerpt length invariant
    - **Property 16: Blog post excerpt length invariant**
    - **Validates: Requirements 12.2**
    - Generate arbitrary blog post objects with fast-check; pass through `validateExcerpt`; assert the resulting excerpt is ≤ 200 characters
    - Tag: `// Feature: professor-personal-website, Property 16: Blog post excerpt length invariant`
  - [x] 11.4 Implement Blog list page
    - Create `app/(public)/blog/page.tsx` with ISR (`revalidate: 60`)
    - Fetch all non-draft `BlogPost` rows sorted by `publishedAt` descending
    - Render `BlogPostCard` list; display "no posts published yet" message when list is empty
    - Export `generateMetadata()`
    - _Requirements: 12.1, 12.2, 12.7, 9.2, 9.3_
  - [ ]* 11.5 Write property test for blog posts sorted by date descending
    - **Property 15: Blog posts sorted by date descending**
    - **Validates: Requirements 12.1**
    - Generate random blog post arrays with varying `publishedAt` dates; assert the rendered list is sorted such that each adjacent pair satisfies `earlier.publishedAt >= later.publishedAt`
    - Tag: `// Feature: professor-personal-website, Property 15: Blog posts sorted by date descending`
  - [x] 11.6 Implement Blog post detail page
    - Create `app/(public)/blog/[slug]/page.tsx` with ISR
    - Fetch a single `BlogPost` by slug; render full Markdown content via `remark` + `rehype-sanitize`
    - Implement `generateStaticParams()` for all published slugs
    - Export `generateMetadata()` with `article:published_time` and `article:author` Open Graph tags
    - _Requirements: 12.3, 9.2, 9.3_
  - [x] 11.7 Implement EventCard component
    - Create `components/sections/EventCard.tsx` displaying event name, date, location, description, and optional external link
    - _Requirements: 12.4, 12.6_
  - [ ]* 11.8 Write property test for event card required fields
    - **Property 17: Event card required fields**
    - **Validates: Requirements 12.4**
    - Generate arbitrary `Event` objects; render `EventCard`; assert name, date, location, and description are all present
    - Tag: `// Feature: professor-personal-website, Property 17: Event card required fields`
  - [x] 11.9 Implement event separation utility
    - Create `lib/events.ts` with `separateEvents(events, now: Date)` returning `{ upcoming, past }` partitions based on `event.date` vs `now`
    - _Requirements: 12.5_
  - [ ]* 11.10 Write property test for upcoming and past event separation
    - **Property 18: Upcoming and past events are separated**
    - **Validates: Requirements 12.5**
    - Generate event arrays and reference timestamps; call `separateEvents`; assert events after the reference appear only in upcoming and events before or equal appear only in past
    - Tag: `// Feature: professor-personal-website, Property 18: Upcoming and past events are separated`
  - [x] 11.11 Implement Events page
    - Create `app/(public)/events/page.tsx` as SSR (no cache)
    - Fetch all `Event` rows; use `separateEvents(events, new Date())` to split; render two labeled sections with `EventCard` lists
    - Export `generateMetadata()`
    - _Requirements: 12.4, 12.5, 12.6, 9.2, 9.3_

- [x] 12. Collaborations & Resources section
  - [x] 12.1 Implement CollaboratorCard component
    - Create `components/sections/CollaboratorCard.tsx` displaying name, institutional affiliation, area of collaboration, and optional profile link
    - _Requirements: 13.1, 13.3_
  - [ ]* 12.2 Write property test for collaborator card required fields
    - **Property 19: Collaborator card required fields**
    - **Validates: Requirements 13.1**
    - Generate arbitrary `Collaborator` objects; render `CollaboratorCard`; assert name, institution, and area are all present
    - Tag: `// Feature: professor-personal-website, Property 19: Collaborator card required fields`
  - [x] 12.3 Implement resource description validation utility
    - Create `lib/resources.ts` with `validateResourceDescription(desc: string): string` that truncates to 150 characters if needed
    - _Requirements: 13.5_
  - [ ]* 12.4 Write property test for resource description length invariant
    - **Property 20: Resource description length invariant**
    - **Validates: Requirements 13.5**
    - Generate arbitrary resource objects; pass through `validateResourceDescription`; assert the resulting description is ≤ 150 characters
    - Tag: `// Feature: professor-personal-website, Property 20: Resource description length invariant`
  - [x] 12.5 Implement Collaborations page
    - Create `app/(public)/collaborations/page.tsx` with ISR (`revalidate: 60`)
    - Fetch all `Collaborator` rows (type `individual` and `institution`) and all `Resource` rows
    - Render collaborators grouped by type; render resources list with title, description, and URL
    - Export `generateMetadata()`
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 9.2, 9.3_


- [x] 13. Gallery section
  - [x] 13.1 Implement GalleryItem and GalleryGrid components
    - Create `components/sections/GalleryItem.tsx` rendering a Next.js `<Image>` with the item's `alt` field and a caption overlay
    - Create `components/sections/GalleryGrid.tsx` rendering items in a responsive CSS grid (single column on mobile, multi-column on desktop)
    - _Requirements: 14.1, 14.2, 14.4, 14.6_
  - [ ]* 13.2 Write property test for gallery item alt text non-empty
    - **Property 21: Gallery item alt text non-empty**
    - **Validates: Requirements 14.4**
    - Generate arbitrary `GalleryItem` objects with non-empty `alt` fields; render the component; assert the `<img>` element's `alt` attribute equals the item's `alt` field
    - Tag: `// Feature: professor-personal-website, Property 21: Gallery item alt text non-empty`
  - [x] 13.3 Implement gallery category filter utility
    - Create `lib/gallery.ts` with `filterByCategory(items, category)` returning only items whose `category` equals the selected label
    - _Requirements: 14.5_
  - [ ]* 13.4 Write property test for gallery category filter correctness
    - **Property 22: Gallery category filter correctness**
    - **Validates: Requirements 14.5**
    - Generate arbitrary gallery item arrays and category labels; call `filterByCategory`; assert every result has the selected category and no non-matching item appears
    - Tag: `// Feature: professor-personal-website, Property 22: Gallery category filter correctness`
  - [x] 13.5 Implement Gallery page with lightbox
    - Create `app/(public)/gallery/page.tsx` with ISR (`revalidate: 60`)
    - Fetch all `GalleryItem` rows; render `GalleryGrid` with category filter controls wired to `filterByCategory`
    - Implement lightbox using `Modal` component: clicking an item opens the full-resolution image in a `role="dialog"` modal with `aria-modal="true"`, `aria-labelledby`, and a close button
    - Export `generateMetadata()`
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 9.2, 9.3_

- [x] 14. Contact section
  - [x] 14.1 Implement contact form validation schema
    - Create `lib/schemas/contact.ts` with a `zod` schema requiring non-empty `name`, valid `email`, and non-empty `message`; export the schema for use on both client and server
    - _Requirements: 6.5, 6.6_
  - [ ]* 14.2 Write property test for contact form validation
    - **Property 9: Contact form validation identifies missing fields**
    - **Validates: Requirements 6.6**
    - Generate form submissions with arbitrary combinations of missing/empty required fields; run through the zod schema; assert each missing field is identified by name in the error object and no email delivery is attempted
    - Tag: `// Feature: professor-personal-website, Property 9: Contact form validation identifies missing fields`
  - [x] 14.3 Implement contact API route
    - Create `app/api/contact/route.ts` (POST handler)
    - Validate request body with the contact zod schema; on failure return 400 with per-field errors
    - On success, send email via `nodemailer` to `PROFESSOR_EMAIL`; on nodemailer failure return 500 with `code: "EMAIL_DELIVERY_FAILED"` and a message directing the visitor to the professor's email
    - Apply rate limiting: 5 submissions per IP per hour (in-memory map or Edge middleware)
    - _Requirements: 6.5, 6.6, 16.4_
  - [x] 14.4 Implement ContactForm component
    - Create `components/forms/ContactForm.tsx` as a client component
    - Each input has an associated `<label>`, `aria-required="true"`, and `aria-describedby` pointing to its error message element
    - On submit, POST to `/api/contact`; display inline validation errors per field; display success or delivery-failure messages
    - _Requirements: 6.5, 6.6, 7.1, 16.4_
  - [x] 14.5 Implement Contact page
    - Create `app/(public)/contact/page.tsx` as SSR
    - Fetch `Profile` to display email, office location, office hours, and academic profile links
    - Display the professor's photo at 150×150px rounded beside the contact details using Next.js `<Image>` with `alt="{fullName} — {title}"`; fall back to placeholder avatar if `photoUrl` is null
    - Render `ContactForm`
    - Export `generateMetadata()`
    - _Requirements: 1.8, 1.10, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 9.2, 9.3_

- [x] 15. Checkpoint — public site complete
  - Ensure all public pages render without errors, all tests pass, and all `generateMetadata()` functions return non-empty title, description, og:title, and og:description
  - Ensure all tests pass, ask the user if questions arise.


- [x] 16. Authentication system
  - [x] 16.1 Implement login API route
    - Create `app/api/auth/login/route.ts` (POST handler)
    - Validate body with zod (`username`, `password`)
    - Fetch `AdminUser` by username; check `lockedUntil > now` → return 423 with lockout message
    - Compare password with `bcrypt.compare`; on failure increment `failedAttempts`; if `failedAttempts >= 5` set `lockedUntil = now + 15 min`; return 401
    - On success reset `failedAttempts` and `lockedUntil`; create iron-session with `{ username, createdAt: Date.now() }`; return 200
    - _Requirements: 15.2, 15.3, 15.4, 15.6_
  - [x] 16.2 Implement logout API route
    - Create `app/api/auth/logout/route.ts` (POST handler)
    - Destroy the iron-session cookie; return 200
    - _Requirements: 15.8_
  - [x] 16.3 Implement auth middleware
    - Create `middleware.ts` matching `/admin/:path*` and `/api/admin/:path*`
    - Read iron-session; if no `username` → redirect to `/login`
    - Check `Date.now() - session.createdAt > 8 * 60 * 60 * 1000`; if stale → clear session and redirect to `/login`
    - _Requirements: 15.5, 15.7_
  - [ ]* 16.4 Write property test for brute-force lockout invariant
    - **Property 23: Brute-force lockout invariant**
    - **Validates: Requirements 15.4**
    - Generate sequences of 5 or more consecutive failed login attempts against the login handler (with mocked Prisma); assert `lockedUntil` is set to at least `now + 15 min` and all subsequent attempts while locked return 423 without password comparison
    - Tag: `// Feature: professor-personal-website, Property 23: Brute-force lockout invariant`
  - [ ]* 16.5 Write property test for session expiry invariant
    - **Property 24: Session expiry invariant**
    - **Validates: Requirements 15.5**
    - Generate session objects with arbitrary `createdAt` values; run through the middleware session-age check; assert sessions with elapsed time > 8 hours are treated as unauthenticated and sessions ≤ 8 hours are treated as valid
    - Tag: `// Feature: professor-personal-website, Property 24: Session expiry invariant`
  - [ ]* 16.6 Write property test for unauthenticated admin redirect
    - **Property 25: Unauthenticated admin redirect**
    - **Validates: Requirements 15.7**
    - Generate arbitrary admin path strings matching `/admin/*`; simulate requests without a valid session cookie through the middleware; assert every response is a redirect to `/login` and no admin content is returned
    - Tag: `// Feature: professor-personal-website, Property 25: Unauthenticated admin redirect`
  - [x] 16.7 Implement Login page
    - Create `app/login/page.tsx` as SSR
    - Render a login form with username and password fields, each with `<label>` and `aria-describedby` for errors
    - POST to `/api/auth/login`; on 200 redirect to `/admin`; on 401 display authentication error; on 423 display lockout message
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

- [x] 17. Admin panel — layout and dashboard
  - Create `app/admin/layout.tsx` wrapping all admin pages with `AdminLayout` (sidebar + header with logout button)
  - Create `app/admin/page.tsx` as the dashboard showing a summary count of each content type fetched from PostgreSQL
  - The logout button POSTs to `/api/auth/logout` then redirects to `/`
  - _Requirements: 15.8, 15.9_

- [x] 18. Admin panel — Profile management
  - Create `app/api/admin/profile/route.ts` (GET + PUT handlers)
    - GET: return the singleton `Profile` row
    - PUT: validate with zod, `prisma.profile.update`, call `revalidatePath('/')` and `revalidatePath('/about')`, return updated record
  - Create `app/admin/profile/page.tsx` with a form pre-populated from the GET response; on submit PUT to the API; show success/error toast
  - _Requirements: 8.1, 8.2, 15.9_

- [x] 19. Admin panel — Research management
  - Create `app/api/admin/research/route.ts` (GET, POST, PUT, DELETE handlers) with zod validation and `revalidatePath('/research')`
  - Create `components/forms/admin/ResearchForm.tsx` for create/edit
  - Create `app/admin/research/page.tsx` listing all projects with edit and delete actions
  - _Requirements: 8.1, 8.2, 15.9_

- [x] 20. Admin panel — Publications management
  - Create `app/api/admin/publications/route.ts` (GET, POST, PUT, DELETE) with zod validation and `revalidatePath('/publications')`
  - Create `components/forms/admin/PublicationForm.tsx`
  - Create `app/admin/publications/page.tsx` listing all publications with edit and delete actions
  - _Requirements: 8.1, 8.2, 15.9_

- [x] 21. Admin panel — Teaching management
  - Create `app/api/admin/teaching/route.ts` (GET, POST, PUT, DELETE) with zod validation and `revalidatePath('/teaching')`
  - Create `components/forms/admin/CourseForm.tsx`
  - Create `app/admin/teaching/page.tsx` listing all courses with edit and delete actions
  - _Requirements: 8.1, 8.2, 15.9_

- [x] 22. Admin panel — Students management
  - Create `app/api/admin/students/route.ts` (GET, POST, PUT, DELETE) with zod validation and `revalidatePath('/students')`
  - Create `components/forms/admin/StudentForm.tsx`
  - Create `app/admin/students/page.tsx` listing all students with edit and delete actions
  - _Requirements: 8.1, 8.2, 15.9_

- [x] 23. Admin panel — CV & Awards management
  - Create `app/api/admin/cv/route.ts` (GET, POST, PUT, DELETE for awards; POST for CV PDF upload)
    - CV upload: validate MIME type is `application/pdf`; write file to `/public/cv.pdf`; call `revalidatePath('/cv')`
  - Create `components/forms/admin/AwardForm.tsx`
  - Create `app/admin/cv/page.tsx` with award CRUD and a CV file upload input
  - _Requirements: 8.1, 8.2, 11.5, 11.6, 15.9_

- [x] 24. Admin panel — Blog management
  - Create `app/api/admin/blog/route.ts` (GET, POST, PUT, DELETE) with zod validation (enforce excerpt ≤ 200 chars via `validateExcerpt`), `revalidatePath('/blog')`, and `revalidatePath('/blog/[slug]')`
  - Create `components/forms/admin/BlogPostForm.tsx` with a Markdown editor textarea
  - Create `app/admin/blog/page.tsx` listing all posts (including drafts) with edit, delete, and publish/unpublish toggle
  - _Requirements: 8.1, 8.2, 12.8, 15.9_

- [x] 25. Admin panel — Events management
  - Create `app/api/admin/events/route.ts` (GET, POST, PUT, DELETE) with zod validation and `revalidatePath('/events')`
  - Create `components/forms/admin/EventForm.tsx`
  - Create `app/admin/events/page.tsx` listing all events with edit and delete actions
  - _Requirements: 8.1, 8.2, 15.9_

- [x] 26. Admin panel — Collaborations management
  - Create `app/api/admin/collaborations/route.ts` (GET, POST, PUT, DELETE for both `Collaborator` and `Resource`) with zod validation (enforce resource description ≤ 150 chars via `validateResourceDescription`) and `revalidatePath('/collaborations')`
  - Create `components/forms/admin/CollaboratorForm.tsx` and `ResourceForm.tsx`
  - Create `app/admin/collaborations/page.tsx` with separate tabs/sections for collaborators and resources
  - _Requirements: 8.1, 8.2, 15.9_

- [x] 27. Admin panel — Gallery management
  - Create `app/api/admin/gallery/route.ts` (GET, POST, PUT, DELETE) with zod validation and `revalidatePath('/gallery')`
  - Create `components/forms/admin/GalleryItemForm.tsx`
  - Create `app/admin/gallery/page.tsx` listing all gallery items with edit and delete actions
  - _Requirements: 8.1, 8.2, 15.9_

- [x] 28. Checkpoint — admin panel complete
  - Ensure all admin CRUD routes are protected by middleware, all zod schemas enforce invariants, all `revalidatePath` calls are in place, and all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 28.1 Admin panel — Contact message inbox
  - Update `app/api/contact/route.ts` to also save every submission as a `ContactMessage` row in PostgreSQL (regardless of email delivery outcome)
  - Create `app/api/admin/messages/route.ts` (GET all messages, PATCH to mark read, DELETE to remove)
  - Create `app/admin/messages/page.tsx` displaying all contact messages with sender name, email, date, read/unread status, and message body
  - Add mark-as-read and delete actions with confirmation dialog
  - _Requirements: 15.17, 15.18_

- [x] 28.2 Admin panel — Site settings
  - Add `SiteSettings` model to Prisma schema (singleton row: siteTitle, tagline, footerText, contactEmail, maintenanceMode, maintenanceMsg, socialLinks JSON, hiddenSections JSON)
  - Run `prisma migrate dev --name add_site_settings` and seed a default `SiteSettings` row
  - Create `app/api/admin/settings/route.ts` (GET + PUT, auth-gated, zod validation, `revalidatePath('/')`)
  - Create `app/admin/settings/page.tsx` with sections for:
    - Site title and tagline
    - Footer text and copyright
    - Contact email (overrides `PROFESSOR_EMAIL` env var for form delivery)
    - Social/academic profile links (add/edit/remove)
    - Navigation section visibility toggles (hide/show each of the 12 sections)
    - Maintenance mode toggle with custom message input
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.6, 17.8_

- [x] 28.3 Admin panel — Maintenance mode middleware
  - Update `middleware.ts` to check `SiteSettings.maintenanceMode` from PostgreSQL on every public request
  - WHEN maintenance mode is active, redirect all public routes (except `/login` and `/admin/*`) to a maintenance page returning HTTP 503
  - Create `app/maintenance/page.tsx` displaying the custom maintenance message from `SiteSettings`
  - _Requirements: 17.6, 17.7_

- [x] 28.4 Admin panel — Navigation visibility
  - Update `Navbar.tsx` to read `SiteSettings.hiddenSections` and omit hidden section links from the public navigation
  - Update public page middleware to return 404 for any section whose key appears in `hiddenSections`
  - _Requirements: 17.4, 17.5_

- [x] 28.5 Admin panel — Activity log
  - Add `ActivityLog` model to Prisma schema (id, action, section, itemId, itemTitle, performedBy, performedAt)
  - Run `prisma migrate dev --name add_activity_log`
  - Create `lib/activityLog.ts` with `logAction(action, section, itemId, itemTitle, performedBy)` helper that writes a row to `ActivityLog`
  - Call `logAction` in every admin API route after a successful create, update, delete, or publish/unpublish operation
  - Update `app/admin/page.tsx` (dashboard) to display the 20 most recent `ActivityLog` entries alongside content counts
  - _Requirements: 15.10, 15.14_

- [x] 28.6 Admin panel — Change password
  - Create `app/api/admin/account/route.ts` (PUT handler, auth-gated)
    - Validate body with zod: `{ currentPassword, newPassword }` (newPassword min 12 chars)
    - Verify `currentPassword` against stored hash; on failure return 401
    - Hash `newPassword` with bcrypt cost 12; update `AdminUser.passwordHash`; return 200
  - Create `app/admin/account/page.tsx` with a change-password form
  - _Requirements: 15.11_

- [x] 28.7 Admin panel — Publish/draft toggle for all content
  - Add a `published` boolean field (default `true`) to `ResearchProject`, `Course`, `Student`, `Award`, `Collaborator`, `Resource`, `GalleryItem` Prisma models
  - Run `prisma migrate dev --name add_published_flag`
  - Update all public-facing Prisma queries to filter `WHERE published = true`
  - Update all admin list pages to show a publish/unpublish toggle button next to each item
  - Update all admin API routes to handle `PATCH /{id}/toggle-publish` and call `logAction` + `revalidatePath`
  - Add confirmation dialog before unpublishing any item
  - _Requirements: 15.12, 15.16_

- [x] 28.8 Admin panel — Profile photo and CV upload from panel
  - Update `app/api/admin/profile/route.ts` to accept `multipart/form-data` for photo upload; validate MIME type is `image/jpeg`, `image/png`, or `image/webp`; save to `/public/images/profile.jpg`; call `revalidatePath('/')`, `revalidatePath('/about')`, and `revalidatePath('/contact')`
  - Update `app/admin/profile/page.tsx` to include a photo upload input showing the current photo preview at 150×150px with a "Change Photo" button; display the current photo with alt text
  - Ensure `app/api/admin/cv/route.ts` already handles PDF upload (Task 23); confirm it calls `revalidatePath('/cv')`
  - _Requirements: 15.13_


- [x] 29. Error pages
  - Create `app/not-found.tsx` rendering a custom 404 page with the site Navbar, Footer, a clear "Page not found" heading, and a link back to the homepage
  - Create `app/error.tsx` (Next.js error boundary) rendering a custom 500 page without stack traces; log the error server-side
  - _Requirements: 16.1, 16.2, 16.3_

- [x] 30. SEO — sitemap and robots.txt
  - Create `app/sitemap.ts` exporting a `sitemap()` function that returns all public URLs (static pages + dynamic research slugs + blog slugs) with `lastModified` timestamps
  - Create `app/robots.ts` exporting a `robots()` function that disallows `/admin` and `/api` for all crawlers
  - _Requirements: 9.1, 9.2_

- [x] 31. Page metadata completeness
  - Audit every public page to confirm `generateMetadata()` returns a non-empty `title`, `description`, `og:title`, and `og:description`
  - Add any missing metadata exports
  - _Requirements: 9.2, 9.3_
  - [ ]* 31.1 Write property test for page metadata completeness
    - **Property 11: Page metadata completeness**
    - **Validates: Requirements 9.2, 9.3**
    - For each public page module, call `generateMetadata()` with representative params; assert the returned object has non-empty `title`, `description`, `openGraph.title`, and `openGraph.description`
    - Tag: `// Feature: professor-personal-website, Property 11: Page metadata completeness`

- [x] 32. Conditional external link rendering
  - Audit all card components (`CourseCard`, `PublicationCard`, `EventCard`, `StudentCard`, `CollaboratorCard`) to ensure external links render if and only if the URL field is present and non-empty
  - _Requirements: 4.3, 5.3, 10.4, 12.6_
  - [ ]* 32.1 Write property test for conditional external link rendering
    - **Property 8: Conditional external link rendering**
    - **Validates: Requirements 4.3, 5.3, 10.4, 12.6**
    - Generate content items with fast-check using both present and absent URL fields; render each card component; assert a link element is present iff the URL field is non-empty
    - Tag: `// Feature: professor-personal-website, Property 8: Conditional external link rendering`

- [x] 33. Content round-trip integrity
  - [ ]* 33.1 Write property test for content round-trip integrity
    - **Property 10: Content round-trip integrity**
    - **Validates: Requirements 8.2, 12.8**
    - Generate arbitrary content objects for each supported type (Publication, ResearchProject, Course, Student, Award, Event, Collaborator, Resource, GalleryItem, BlogPost) using fast-check; write each to a test PostgreSQL database via the admin API (mocked Prisma); read back via Prisma; assert deep equality ignoring `createdAt` and `updatedAt`
    - Tag: `// Feature: professor-personal-website, Property 10: Content round-trip integrity`

- [x] 34. Accessibility hardening
  - [x] 34.1 Add jest-axe tests to all page components
    - Write a jest-axe test for each public page component (Home, About, Research, Teaching, Publications, Students, CV, Blog list, Blog detail, Events, Collaborations, Gallery, Contact, Login, 404, 500) asserting zero automated WCAG violations
    - _Requirements: 7.1_
  - [x] 34.2 Audit heading hierarchy
    - Verify each page has exactly one `<h1>` followed by logically nested `<h2>` and `<h3>` headings; fix any violations
    - _Requirements: 7.1_
  - [x] 34.3 Audit form labels and ARIA attributes
    - Verify every form input (ContactForm, all admin forms, LoginPage) has an associated `<label>`, `aria-required="true"`, and `aria-describedby` pointing to its error element; fix any gaps
    - _Requirements: 7.1, 7.4_
  - [x] 34.4 Audit focus indicators
    - Verify `focus-visible:ring-2` is applied to all interactive elements (links, buttons, inputs, modal close buttons, gallery items); ensure browser default outlines are not suppressed
    - _Requirements: 7.4_
  - [x] 34.5 Audit image alt text
    - Verify every `<Image>` has a non-empty `alt` prop; decorative images use `alt=""` and `role="presentation"`
    - _Requirements: 7.3_

- [x] 35. Integration tests
  - [x] 35.1 Write contact form integration test
    - Test the full contact form submission flow: POST to `/api/contact` with valid data → assert nodemailer is called with correct recipient and message body (use Ethereal Email or a nodemailer mock)
    - _Requirements: 6.5_
  - [x] 35.2 Write admin login flow integration test
    - Test: POST valid credentials to `/api/auth/login` → assert 200 and session cookie set; then GET `/admin` → assert 200 (not redirect)
    - Test: POST invalid credentials → assert 401; after 5 failures → assert 423 lockout
    - _Requirements: 15.2, 15.3, 15.4_
  - [x] 35.3 Write admin CRUD integration test
    - Test: POST a new publication via `/api/admin/publications` → assert 200 and record returned; GET publications → assert new record present; DELETE → assert record removed
    - _Requirements: 8.2, 15.9_
  - [x] 35.4 Write ISR revalidation integration test
    - Test: update a publication via admin API → call `revalidatePath('/publications')` → fetch the public publications page → assert updated content appears
    - _Requirements: 8.2_
  - [x] 35.5 Write unauthenticated redirect integration test
    - Test: GET `/admin` without session cookie → assert redirect to `/login`; GET `/api/admin/publications` without session → assert 401 or redirect
    - _Requirements: 15.7_

- [x] 36. Performance validation
  - Configure Lighthouse CI (`lighthouserc.js`) with `assert.preset: "lighthouse:recommended"` and a minimum performance score of 90 on desktop
  - Add a `package.json` script `"lighthouse": "lhci autorun"` for CI use
  - Verify the homepage profile photo uses `<Image priority>` for LCP optimisation
  - Verify all public pages use SSG or ISR (not uncached SSR) where specified in the design
  - _Requirements: 9.1, 1.5_

- [x] 37. Final checkpoint — all tests pass
  - Run the full Jest test suite and confirm all unit, property-based, and integration tests pass
  - Run Lighthouse CI and confirm performance score ≥ 90 on desktop
  - Verify admin panel controls every section end-to-end: create, edit, delete, publish/unpublish, photo upload, CV upload, message inbox, settings, maintenance mode, activity log, change password
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP; they cover property-based tests and integration tests
- Each task references specific requirements for traceability
- Checkpoints at tasks 15, 28, and 37 ensure incremental validation
- All 25 correctness properties from the design document are covered by property test sub-tasks (Properties 1–25)
- Admin API routes must always call `revalidatePath` after writes so public ISR pages reflect changes within 60 seconds
- Never commit `.env` to source control; use `.env.example` as the template
- The `AdminUser` and `SiteSettings` singleton rows must be seeded via `prisma/seed.ts` before first use
- Contact messages are always saved to PostgreSQL even if email delivery fails — admin can read them in the inbox
- The `published` flag on all content models means the admin can hide any item from the public site without deleting it
- Maintenance mode blocks all public routes (HTTP 503) while keeping `/admin/*` and `/login` accessible
