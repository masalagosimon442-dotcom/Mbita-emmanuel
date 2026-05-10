hey# Design Document: Professor Personal Website

## Overview

The professor personal website is a full-stack web application that serves as a professional academic presence. It combines a statically-rendered public-facing site with a server-side admin panel for content management. The architecture prioritises fast page loads, strong SEO, accessibility compliance, and a secure content management workflow that requires no source-code changes.

### Key Design Goals

- **Public site**: Fast, accessible, SEO-optimised pages for all 12 navigation sections.
- **Admin panel**: Secure, session-protected CRUD interface for all content types.
- **Content storage**: MySQL database accessed via Prisma ORM — structured, relational, easy to query and back up, compatible with free hosting tiers.
- **Security**: HTTPS-only, bcrypt-hashed credentials, brute-force lockout, short-lived sessions.
- **Accessibility**: WCAG 2.1 Level AA throughout.

### Technology Stack

| Layer | Choice | Rationale |
|---|---|---|
| Runtime | Node.js 20 LTS | Widely supported, large ecosystem, good performance |
| Framework | Next.js 14 (App Router) | SSR/SSG hybrid, built-in routing, image optimisation, excellent SEO support |
| Styling | Tailwind CSS | Utility-first, responsive design, easy to enforce contrast ratios |
| Database | MySQL 8 | Widely available on free/shared hosting, relational, mature |
| ORM | Prisma | Type-safe queries, auto-generated client, easy migrations, works with MySQL |
| Authentication | Custom session with `iron-session` | Lightweight, secure, no third-party auth service required |
| Password hashing | `bcryptjs` | Industry-standard, slow hash to resist brute force |
| Email delivery | `nodemailer` (SMTP) | Flexible, works with any SMTP provider |
| Form validation | `zod` | Schema-based, shared between client and server |
| Image handling | Next.js `<Image>` component | Automatic optimisation, lazy loading, responsive sizes |
| Testing | Jest + React Testing Library + `fast-check` (PBT) | Standard ecosystem, property-based testing support |
| Deployment target | Railway, PlanetScale, or any MySQL-compatible host | Free MySQL tiers available |

---

## Architecture

### High-Level Architecture

```mermaid
graph TD
    subgraph Browser
        V[Visitor]
        A[Admin User]
    end

    subgraph Next.js Application
        PR[Public Routes<br/>SSG / SSR pages]
        AR[Admin Routes<br/>/admin/*]
        API[API Routes<br/>/api/*]
        MW[Middleware<br/>Auth Guard]
    end

    subgraph Content Layer
        DB[(MySQL Database)]
        CV[CV PDF<br/>/public/cv.pdf]
        IMG[Images<br/>/public/images/]
    end

    subgraph External Services
        SMTP[SMTP Server<br/>Email Delivery]
    end

    V -->|HTTP GET| PR
    A -->|HTTP GET/POST| AR
    AR --> MW
    MW -->|Authenticated| AR
    MW -->|Unauthenticated| PR
    PR --> DB
    API --> DB
    API --> SMTP
    AR --> API
```

### Request Flow

**Public page request:**
1. Browser requests a public URL.
2. Next.js serves a statically generated (SSG) or server-rendered (SSR) page.
3. Page fetches content from MySQL via Prisma at build time (SSG) or request time (SSR).
4. HTML is returned with full content for SEO crawlers.

**Admin panel request:**
1. Browser requests `/admin/*`.
2. Next.js middleware checks for a valid `iron-session` cookie.
3. If unauthenticated → redirect to `/login`.
4. If authenticated → render admin page, which calls `/api/admin/*` endpoints for CRUD operations against MySQL.

**Contact form submission:**
1. Browser POSTs to `/api/contact`.
2. Server validates fields with `zod`.
3. On success → `nodemailer` sends email to professor's address.
4. On failure → returns structured error response.

### Rendering Strategy

| Section | Strategy | Reason |
|---|---|---|
| Home, About | SSG (revalidate on deploy) | Rarely changes, maximum performance |
| Publications, Research, Teaching, Students, CV, Collaborations, Gallery | SSG with ISR (revalidate: 60s) | Changes infrequently, near-instant updates |
| Blog posts (list + detail) | SSG with ISR | New posts appear within 60 seconds |
| Events | SSR | Upcoming/past split requires current time |
| Contact | SSR | Form handling |
| Admin panel | SSR (no cache) | Always fresh, auth-gated |

---

## Components and Interfaces

### Page Structure

```
app/
├── (public)/
│   ├── page.tsx                    # Home
│   ├── about/page.tsx
│   ├── research/
│   │   ├── page.tsx                # Research list
│   │   └── [slug]/page.tsx         # Research detail
│   ├── teaching/page.tsx
│   ├── publications/page.tsx
│   ├── students/page.tsx
│   ├── cv/page.tsx
│   ├── blog/
│   │   ├── page.tsx                # Blog list
│   │   └── [slug]/page.tsx         # Blog post detail
│   ├── events/page.tsx
│   ├── collaborations/page.tsx
│   ├── gallery/page.tsx
│   └── contact/page.tsx
├── login/page.tsx
├── admin/
│   ├── layout.tsx                  # Auth guard wrapper
│   ├── page.tsx                    # Dashboard
│   ├── profile/page.tsx
│   ├── research/page.tsx
│   ├── teaching/page.tsx
│   ├── publications/page.tsx
│   ├── students/page.tsx
│   ├── cv/page.tsx
│   ├── blog/page.tsx
│   ├── events/page.tsx
│   ├── collaborations/page.tsx
│   └── gallery/page.tsx
├── api/
│   ├── contact/route.ts
│   ├── auth/
│   │   ├── login/route.ts
│   │   └── logout/route.ts
│   └── admin/
│       ├── profile/route.ts
│       ├── research/route.ts
│       ├── publications/route.ts
│       ├── teaching/route.ts
│       ├── students/route.ts
│       ├── cv/route.ts
│       ├── blog/route.ts
│       ├── events/route.ts
│       ├── collaborations/route.ts
│       └── gallery/route.ts
└── not-found.tsx                   # Custom 404
```

### Shared UI Components

```
components/
├── layout/
│   ├── Navbar.tsx          # Responsive navigation with active-link indicator
│   ├── Footer.tsx
│   └── AdminLayout.tsx     # Admin sidebar + header
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Badge.tsx           # Status labels (active/archived/upcoming/past)
│   ├── Modal.tsx           # Gallery lightbox, confirmation dialogs
│   ├── Pagination.tsx
│   └── SearchFilter.tsx    # Publications keyword + type filter
├── sections/
│   ├── PublicationCard.tsx
│   ├── ResearchCard.tsx
│   ├── CourseCard.tsx
│   ├── StudentCard.tsx
│   ├── BlogPostCard.tsx
│   ├── EventCard.tsx
│   ├── CollaboratorCard.tsx
│   ├── GalleryGrid.tsx
│   └── GalleryItem.tsx
└── forms/
    ├── ContactForm.tsx
    └── admin/
        ├── PublicationForm.tsx
        ├── ResearchForm.tsx
        ├── CourseForm.tsx
        ├── StudentForm.tsx
        ├── BlogPostForm.tsx
        ├── EventForm.tsx
        ├── CollaboratorForm.tsx
        └── GalleryItemForm.tsx
```

### Navigation Component

The `Navbar` component reads the current pathname via `usePathname()` and applies an `aria-current="page"` attribute plus a visual highlight class to the matching link. On viewports below 768px it renders a hamburger button that toggles a full-width dropdown menu. The Login / Admin Panel link is rendered with a distinct visual style (outlined button) and positioned at the far right of the desktop nav.

A small circular thumbnail of the professor's photo (`Profile.photoUrl`) is displayed in the Navbar beside the site title on every page, providing consistent visual identity. The image uses Next.js `<Image>` with fixed `width={40}` and `height={40}`, `className="rounded-full"`, and a non-empty `alt` equal to the professor's full name.

### Footer Component

The `Footer` component displays a small circular thumbnail of the professor's photo alongside the professor's name, title, and institution. This reinforces the personal brand on every page. The image uses the same `Profile.photoUrl` with appropriate `alt` text.

### Photo Usage Across Pages

| Page | Photo usage | Size / treatment |
|---|---|---|
| Home | Hero image — large, prominent, `priority` flag for LCP | 300×300px, rounded or square |
| About | Alongside full biography | 200×200px, rounded |
| Contact | Beside contact details | 150×150px, rounded |
| Navbar (all pages) | Small thumbnail in header | 40×40px, circular |
| Footer (all pages) | Small thumbnail beside name | 48×48px, circular |

All photo instances use Next.js `<Image>` with `sizes` prop, descriptive `alt` text (`"{fullName} — {title}"`), and fall back to a placeholder avatar SVG if `photoUrl` is null or empty.

---

## Data Models

All content is stored in a MySQL database accessed via Prisma ORM. The Prisma schema below defines all tables. Admin credentials are stored in the `AdminUser` table (never in source control).

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Profile {
  id               Int      @id @default(1)  // singleton row
  fullName         String
  title            String
  department       String
  institution      String
  email            String
  officeLocation   String
  officeHours      String
  bio              String   @db.Text         // Markdown-formatted
  photoUrl         String
  academicProfiles Json                      // [{label, url}]
  updatedAt        DateTime @updatedAt
}

model Publication {
  id        String   @id @default(uuid())
  title     String
  authors   Json                             // string[]
  venue     String
  year      Int
  type      PublicationType
  doi       String?
  url       String?
  abstract  String?  @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum PublicationType {
  journal
  conference
  book
  book_chapter
  technical_report
  other
}

model ResearchProject {
  id             String        @id @default(uuid())
  slug           String        @unique
  title          String
  description    String        @db.Text      // Markdown
  status         ProjectStatus
  startYear      Int
  endYear        Int?
  fundingSources Json?                       // string[]
  collaborators  Json?                       // string[]
  externalUrl    String?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}

enum ProjectStatus {
  active
  completed
}

model Course {
  id          String       @id @default(uuid())
  name        String
  code        String
  term        String
  status      CourseStatus
  syllabusUrl String?
  externalUrl String?
  description String?      @db.Text
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

enum CourseStatus {
  active
  archived
}

model Student {
  id              String        @id @default(uuid())
  name            String
  degreeLevel     DegreeLevel
  researchTopic   String
  status          StudentStatus
  thesisTitle     String?
  graduationYear  Int?
  currentPosition String?
  profileUrl      String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

enum DegreeLevel {
  PhD
  Masters
}

enum StudentStatus {
  current
  alumni
}

model Award {
  id            String       @id @default(uuid())
  name          String
  organization  String
  year          Int
  category      AwardCategory
  amount        String?
  fundingPeriod String?
  description   String?      @db.Text
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}

enum AwardCategory {
  award
  grant
  fellowship
  honor
  distinction
}

model BlogPost {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  publishedAt DateTime
  excerpt     String   @db.VarChar(200)
  content     String   @db.LongText         // Markdown body
  tags        Json?                          // string[]
  draft       Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Event {
  id          String   @id @default(uuid())
  name        String
  date        DateTime
  location    String
  description String   @db.Text
  externalUrl String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Collaborator {
  id          String           @id @default(uuid())
  name        String
  institution String
  area        String
  profileUrl  String?
  type        CollaboratorType
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
}

enum CollaboratorType {
  individual
  institution
}

model Resource {
  id          String   @id @default(uuid())
  title       String
  description String   @db.VarChar(150)
  url         String
  category    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model GalleryItem {
  id        String   @id @default(uuid())
  imageUrl  String
  alt       String
  caption   String
  category  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model AdminUser {
  id             Int      @id @default(1)   // singleton row
  username       String   @unique
  passwordHash   String                     // bcrypt, cost factor 12
  failedAttempts Int      @default(0)
  lockedUntil    DateTime?
  updatedAt      DateTime @updatedAt
}

model SiteSettings {
  id               Int      @id @default(1)  // singleton row
  siteTitle        String
  tagline          String?
  footerText       String
  contactEmail     String
  maintenanceMode  Boolean  @default(false)
  maintenanceMsg   String?
  socialLinks      Json                      // [{label, url}]
  hiddenSections   Json                      // string[] of section keys
  updatedAt        DateTime @updatedAt
}

model ContactMessage {
  id          String   @id @default(uuid())
  name        String
  email       String
  message     String   @db.Text
  read        Boolean  @default(false)
  receivedAt  DateTime @default(now())
}

model ActivityLog {
  id          String   @id @default(uuid())
  action      String                        // e.g. "CREATE", "UPDATE", "DELETE", "PUBLISH"
  section     String                        // e.g. "publications", "blog"
  itemId      String?
  itemTitle   String?
  performedBy String
  performedAt DateTime @default(now())
}
```

### TypeScript Interfaces (derived from Prisma types)

Prisma auto-generates TypeScript types from the schema. The application uses `Prisma.PublicationGetPayload`, `Prisma.StudentGetPayload`, etc. directly — no separate interface definitions needed.

### Database Connection

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ['error'] });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

This singleton pattern prevents connection pool exhaustion during Next.js hot reloads in development.

---

## Content Management Approach

### MySQL-Backed CMS

All content is stored in MySQL and accessed via Prisma. The admin panel performs CRUD operations through Next.js API routes. On each write, the API route:

1. Validates the incoming payload with a `zod` schema.
2. Executes the appropriate Prisma query (`create`, `update`, or `delete`).
3. Calls Next.js on-demand ISR revalidation (`revalidatePath`) to invalidate the relevant cached page.
4. Returns a structured JSON response to the admin UI.

Content updates appear on the public site within seconds without a full rebuild.

### Admin Panel Workflow

```mermaid
sequenceDiagram
    participant Admin
    participant Browser
    participant NextAPI as Next.js API
    participant Prisma as Prisma ORM
    participant DB as MySQL Database
    participant Cache as Next.js Cache

    Admin->>Browser: Fill in form, click Save
    Browser->>NextAPI: POST /api/admin/{section}
    NextAPI->>NextAPI: Validate session cookie
    NextAPI->>NextAPI: Validate payload (zod)
    NextAPI->>Prisma: prisma.model.upsert / create / delete
    Prisma->>DB: SQL query
    DB-->>Prisma: Result
    Prisma-->>NextAPI: Updated record
    NextAPI->>Cache: revalidatePath('/{section}')
    NextAPI-->>Browser: 200 OK + updated record
    Browser-->>Admin: Show success toast
```

### CV Upload

The CV PDF is stored at `/public/cv.pdf` (served as a static file). The admin panel provides a file upload form that POSTs to `/api/admin/cv`. The API route validates the MIME type (`application/pdf`), writes the file to `/public/cv.pdf`, and returns success. The public CV page always links to `/cv.pdf`.

### Environment Configuration

```env
# .env (never committed to source control)
DATABASE_URL="mysql://user:password@host:3306/professor_website"
SESSION_SECRET="32-character-minimum-random-string"
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="user@example.com"
SMTP_PASS="smtp-password"
PROFESSOR_EMAIL="professor@university.edu"
```

### Free MySQL Hosting Options

| Provider | Free Tier | Notes |
|---|---|---|
| PlanetScale | 5GB storage, 1B row reads/month | MySQL-compatible, serverless driver available |
| Railway | $5 credit/month | Full MySQL, persistent, easy setup |
| Aiven | 1 service free | MySQL 8, 1GB storage |
| Clever Cloud | 256MB MySQL | Good for low-traffic sites |

---

## Routing Structure

| Path | Type | Description |
|---|---|---|
| `/` | Public SSG | Homepage with profile summary |
| `/about` | Public SSG | Full biographical page |
| `/research` | Public SSG/ISR | Research projects list |
| `/research/[slug]` | Public SSG/ISR | Research project detail |
| `/teaching` | Public SSG/ISR | Courses list |
| `/publications` | Public SSG/ISR | Publications with filter/search |
| `/students` | Public SSG/ISR | Current students + alumni |
| `/cv` | Public SSG/ISR | Awards, grants, CV download |
| `/blog` | Public SSG/ISR | Blog post list |
| `/blog/[slug]` | Public SSG/ISR | Blog post detail |
| `/events` | Public SSR | Events (upcoming/past split) |
| `/collaborations` | Public SSG/ISR | Collaborators + resources |
| `/gallery` | Public SSG/ISR | Photo gallery with filter |
| `/contact` | Public SSR | Contact form |
| `/login` | Public SSR | Admin login page |
| `/admin` | Admin SSR | Dashboard with counts + recent activity log |
| `/admin/profile` | Admin SSR | Edit profile & about, upload photo |
| `/admin/research` | Admin SSR | Research projects CRUD |
| `/admin/publications` | Admin SSR | Publications CRUD |
| `/admin/teaching` | Admin SSR | Courses CRUD |
| `/admin/students` | Admin SSR | Students & alumni CRUD |
| `/admin/cv` | Admin SSR | Awards CRUD + CV PDF upload |
| `/admin/blog` | Admin SSR | Blog posts CRUD + publish/draft toggle |
| `/admin/events` | Admin SSR | Events CRUD |
| `/admin/collaborations` | Admin SSR | Collaborators & resources CRUD |
| `/admin/gallery` | Admin SSR | Gallery items CRUD + image upload |
| `/admin/messages` | Admin SSR | Contact message inbox (read/delete) |
| `/admin/settings` | Admin SSR | Site-wide settings, maintenance mode, nav visibility |
| `/admin/account` | Admin SSR | Change admin password |
| `/api/contact` | API | Contact form submission (stores to DB + sends email) |
| `/api/auth/login` | API | Credential validation + session creation |
| `/api/auth/logout` | API | Session invalidation |
| `/api/admin/profile` | API | GET + PUT profile (auth-gated) |
| `/api/admin/research` | API | CRUD research projects (auth-gated) |
| `/api/admin/publications` | API | CRUD publications (auth-gated) |
| `/api/admin/teaching` | API | CRUD courses (auth-gated) |
| `/api/admin/students` | API | CRUD students (auth-gated) |
| `/api/admin/cv` | API | CRUD awards + CV upload (auth-gated) |
| `/api/admin/blog` | API | CRUD blog posts + publish toggle (auth-gated) |
| `/api/admin/events` | API | CRUD events (auth-gated) |
| `/api/admin/collaborations` | API | CRUD collaborators + resources (auth-gated) |
| `/api/admin/gallery` | API | CRUD gallery items + image upload (auth-gated) |
| `/api/admin/messages` | API | GET + PATCH (mark read) + DELETE messages (auth-gated) |
| `/api/admin/settings` | API | GET + PUT site settings (auth-gated) |
| `/api/admin/account` | API | PUT change password (auth-gated) |

---

## Security Design

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant LoginPage
    participant AuthAPI as /api/auth/login
    participant DB as MySQL (AdminUser)
    participant Session as iron-session

    User->>LoginPage: Submit username + password
    LoginPage->>AuthAPI: POST {username, password}
    AuthAPI->>DB: prisma.adminUser.findUnique({username})
    alt Account locked (lockedUntil > now)
        AuthAPI-->>LoginPage: 423 Locked + lockout message
    else Not locked
        AuthAPI->>AuthAPI: bcrypt.compare(password, passwordHash)
        alt Invalid credentials
            AuthAPI->>DB: increment failedAttempts
            alt failedAttempts >= 5
                AuthAPI->>DB: set lockedUntil = now + 15min
            end
            AuthAPI-->>LoginPage: 401 Unauthorized
        else Valid credentials
            AuthAPI->>DB: reset failedAttempts = 0, lockedUntil = null
            AuthAPI->>Session: Create session {username, createdAt}
            AuthAPI-->>LoginPage: 200 OK + Set-Cookie
            LoginPage->>User: Redirect to /admin
        end
    end
```

### Session Management

- Sessions use `iron-session` with an AES-256-GCM encrypted, HMAC-signed cookie.
- Cookie flags: `HttpOnly`, `Secure`, `SameSite=Lax`.
- Session payload: `{ username: string, createdAt: number }`.
- Middleware checks `Date.now() - createdAt > 8 * 60 * 60 * 1000` (8 hours) and invalidates stale sessions.
- On logout, the session cookie is cleared server-side.

### Brute-Force Protection

- Failed attempt counter and lockout timestamp stored in the `AdminUser` table in MySQL.
- After 5 consecutive failures: `lockedUntil = Date.now() + 15 * 60 * 1000`.
- Every login attempt checks `lockedUntil` before comparing passwords.
- Successful login resets `failedAttempts` to 0 and clears `lockedUntil`.
- Lockout message does not reveal whether the username or password was wrong.

### Route Protection

Next.js middleware (`middleware.ts`) runs on every request matching `/admin/:path*` and `/api/admin/:path*`:

```typescript
// middleware.ts (pseudocode)
export async function middleware(request: NextRequest) {
  const session = await getIronSession(request, response, sessionOptions);
  if (!session.username) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}
```

### Input Validation and Injection Prevention

- All API route inputs validated with `zod` schemas before processing.
- All database queries use Prisma's parameterized query builder — no raw SQL string interpolation, preventing SQL injection.
- Markdown content rendered with `remark` + `rehype-sanitize` to strip dangerous HTML.
- File upload (CV) validates MIME type and restricts to PDF only.
- Contact form rate-limited to 5 submissions per IP per hour (in-memory counter, or via Vercel Edge middleware).

### HTTPS

The application is deployed behind HTTPS. In development, Next.js runs on HTTP; production deployments enforce HTTPS at the hosting layer. The `Secure` cookie flag ensures session cookies are never sent over plain HTTP.

---

## Performance and SEO Approach

### Performance

- **Static generation**: Most pages are SSG, served from CDN edge nodes with zero server compute.
- **ISR**: Content-heavy pages revalidate every 60 seconds, balancing freshness and performance.
- **Image optimisation**: All images use Next.js `<Image>` with `sizes` and `priority` attributes. The professor's profile photo on the homepage uses `priority` to avoid LCP delay.
- **Font loading**: System font stack or a single variable font loaded with `font-display: swap`.
- **Code splitting**: Next.js App Router automatically splits JS per route.
- **No client-side data fetching on public pages**: All data is fetched at build/request time on the server.

### SEO

- Each page exports a `generateMetadata()` function returning `title`, `description`, and Open Graph tags.
- The homepage includes `og:title`, `og:description`, `og:image` (professor photo), and `og:type: profile`.
- Blog post pages include `article:published_time` and `article:author` Open Graph tags.
- A `sitemap.xml` is generated at build time listing all public URLs.
- A `robots.txt` disallows `/admin` and `/api`.
- Semantic HTML: `<main>`, `<nav>`, `<article>`, `<section>`, `<header>`, `<footer>` used throughout.
- Publication pages include `schema.org/ScholarlyArticle` JSON-LD structured data.

---

## Accessibility Implementation

### WCAG 2.1 Level AA Compliance

- **Colour contrast**: Tailwind theme configured with a palette that meets 4.5:1 for body text and 3:1 for large text. Contrast checked with `eslint-plugin-jsx-a11y` and manual audit.
- **Keyboard navigation**: All interactive elements (links, buttons, form inputs, modal close buttons, gallery items) are reachable and operable via Tab/Shift-Tab/Enter/Space. Focus order follows DOM order.
- **Visible focus indicators**: Tailwind `focus-visible:ring-2` applied globally; browser default outlines not suppressed.
- **Alternative text**: Every `<Image>` has a non-empty `alt` prop. Decorative images use `alt=""` and `role="presentation"`. Gallery items use the `alt` field from the data model.
- **ARIA**: Navigation uses `<nav aria-label="Main navigation">`. Active link has `aria-current="page"`. Modal dialogs use `role="dialog"`, `aria-modal="true"`, `aria-labelledby`. Form errors use `aria-describedby` linking the input to its error message.
- **Responsive layout**: Viewport meta tag set; no fixed pixel font sizes; rem/em units used for text.
- **Skip link**: A visually hidden "Skip to main content" link is the first focusable element on every page, becoming visible on focus.
- **Form labels**: Every form input has an associated `<label>` element. Required fields marked with `aria-required="true"`.
- **Heading hierarchy**: Each page has a single `<h1>` followed by logically nested `<h2>` and `<h3>` headings.

---

## Error Handling

### Public-Facing Errors

- **404**: `app/not-found.tsx` renders a custom page with the site navigation, a clear "Page not found" message, and a link to the homepage.
- **500**: `app/error.tsx` (Next.js error boundary) renders a custom page without stack traces. The error is logged server-side.
- Both error pages share the same `Navbar` and `Footer` components as the rest of the site.

### API Error Responses

All API routes return structured JSON errors:

```typescript
interface ApiError {
  error: string;       // human-readable message
  code: string;        // machine-readable code, e.g. "VALIDATION_ERROR"
  fields?: Record<string, string>;  // per-field errors for forms
}
```

### Contact Form Failure

If `nodemailer` throws, the API returns `{ error: "Message delivery failed. Please try again or email us directly at {email}.", code: "EMAIL_DELIVERY_FAILED" }`. The client displays this message inline in the form. Note: the contact message is always saved to the `ContactMessage` table in MySQL regardless of email delivery success, so the Admin_User can still read it in the message inbox.

### Admin Write Failure

If a file write fails, the API returns a 500 with `code: "WRITE_FAILED"`. The admin UI shows a toast notification and does not navigate away, preserving the user's unsaved form data.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Active navigation link indicator

*For any* valid page pathname, when the Navbar is rendered with that pathname as the current route, exactly one navigation link SHALL have `aria-current="page"` set, and it SHALL be the link whose href matches the current pathname.

**Validates: Requirements 2.4**

### Property 2: Publications sorted by year descending

*For any* non-empty array of publications, the list rendered on the publications page SHALL be ordered such that for every adjacent pair of publications, the earlier publication in the list has a year greater than or equal to the year of the later publication.

**Validates: Requirements 4.1**

### Property 3: Publication card required fields

*For any* Publication object, the rendered PublicationCard SHALL display the title, all authors, the venue, the year, and the publication type.

**Validates: Requirements 4.2**

### Property 4: Publication type filter correctness

*For any* array of publications and any selected type value, every publication returned by the type filter SHALL have a `type` field equal to the selected value, and no publication with a different type SHALL appear in the filtered results.

**Validates: Requirements 4.4**

### Property 5: Publication keyword search correctness

*For any* array of publications and any non-empty keyword string, every publication returned by the keyword search SHALL have a `title` or at least one entry in `authors` containing the keyword (case-insensitive), and no publication that does not match SHALL appear in the results.

**Validates: Requirements 4.5**

### Property 6: Course card required fields and status

*For any* Course object, the rendered CourseCard SHALL display the course name, course code, academic term, and a status indicator reflecting whether the course is active or archived.

**Validates: Requirements 5.1, 5.2**

### Property 7: Active and archived courses are separated

*For any* array of courses containing a mix of active and archived courses, the teaching page SHALL render active courses exclusively in the active section and archived courses exclusively in the archived section, with no course appearing in both sections.

**Validates: Requirements 5.4**

### Property 8: Conditional external link rendering

*For any* content item (Course, Publication, Event, Student, Collaborator) that has an optional external URL field, the rendered component SHALL display a link to that URL if and only if the URL field is present and non-empty.

**Validates: Requirements 4.3, 5.3, 10.4, 12.6**

### Property 9: Contact form validation identifies missing fields

*For any* contact form submission in which one or more of the required fields (name, email, message) are absent or empty, the validation function SHALL return an error object that identifies each missing field by name, and no email delivery SHALL be attempted.

**Validates: Requirements 6.6**

### Property 10: Content round-trip integrity

*For any* content object of any supported type (Publication, ResearchProject, Course, Student, Award, Event, Collaborator, Resource, GalleryItem, BlogPost) written to MySQL via the admin API, reading the same record back via Prisma SHALL produce an object that is deeply equal to the one that was written (accounting for database-generated fields such as `createdAt` and `updatedAt`).

**Validates: Requirements 8.2, 12.8**

### Property 11: Page metadata completeness

*For any* public page in the application, the `generateMetadata()` function SHALL return a non-empty `title`, a non-empty `description`, and Open Graph tags including at minimum `og:title` and `og:description`.

**Validates: Requirements 9.2, 9.3**

### Property 12: Current students and alumni are separated

*For any* array of students containing a mix of current and alumni students, the students page SHALL render current students exclusively in the current students section and alumni exclusively in the alumni section, with no student appearing in both sections.

**Validates: Requirements 10.3**

### Property 13: Student and alumni card required fields

*For any* Student object with status `"current"`, the rendered card SHALL display the student's name, degree level, and research topic. For any Student object with status `"alumni"`, the rendered card SHALL additionally display the thesis title and graduation year.

**Validates: Requirements 10.1, 10.2**

### Property 14: Award card required fields

*For any* Award object, the rendered AwardCard SHALL display the award name, the granting organization, and the year received.

**Validates: Requirements 11.1**

### Property 15: Blog posts sorted by date descending

*For any* non-empty array of blog posts, the list rendered on the blog page SHALL be ordered such that for every adjacent pair of posts, the earlier post in the list has a `publishedAt` date greater than or equal to the `publishedAt` date of the later post.

**Validates: Requirements 12.1**

### Property 16: Blog post excerpt length invariant

*For any* blog post object, after passing through the validation or creation pipeline, the `excerpt` field SHALL contain no more than 200 characters.

**Validates: Requirements 12.2**

### Property 17: Event card required fields

*For any* Event object, the rendered EventCard SHALL display the event name, date, location, and description.

**Validates: Requirements 12.4**

### Property 18: Upcoming and past events are separated

*For any* array of events and any reference timestamp representing "now", every event whose `date` is after the reference timestamp SHALL appear exclusively in the upcoming events section, and every event whose `date` is before or equal to the reference timestamp SHALL appear exclusively in the past events section.

**Validates: Requirements 12.5**

### Property 19: Collaborator card required fields

*For any* Collaborator object, the rendered CollaboratorCard SHALL display the collaborator's name, institutional affiliation, and area of collaboration.

**Validates: Requirements 13.1**

### Property 20: Resource description length invariant

*For any* resource object, after passing through the validation or creation pipeline, the `description` field SHALL contain no more than 150 characters.

**Validates: Requirements 13.5**

### Property 21: Gallery item alt text non-empty

*For any* GalleryItem object, the rendered gallery image element SHALL have a non-empty `alt` attribute equal to the item's `alt` field.

**Validates: Requirements 14.4**

### Property 22: Gallery category filter correctness

*For any* array of gallery items and any selected category label, every gallery item returned by the category filter SHALL have a `category` field equal to the selected label, and no gallery item with a different category SHALL appear in the filtered results.

**Validates: Requirements 14.5**

### Property 23: Brute-force lockout invariant

*For any* sequence of 5 or more consecutive failed login attempts, the authentication system SHALL set `lockedUntil` to a timestamp at least 15 minutes after the time of the 5th failure, and all subsequent login attempts where the current time is before `lockedUntil` SHALL be rejected without comparing the password.

**Validates: Requirements 15.4**

### Property 24: Session expiry invariant

*For any* admin session object, if the difference between the current time and `createdAt` exceeds 8 hours (28,800,000 milliseconds), the middleware SHALL treat the session as unauthenticated and SHALL NOT grant access to any admin resource.

**Validates: Requirements 15.5**

### Property 25: Unauthenticated admin redirect

*For any* HTTP request to a URL path matching `/admin/*` that does not carry a valid, non-expired session cookie, the middleware SHALL respond with a redirect to `/login` and SHALL NOT render or return any admin page content.

**Validates: Requirements 15.7**

---

## Testing Strategy

### Dual Testing Approach

The testing strategy combines example-based unit/integration tests with property-based tests (PBT) for logic-heavy components.

**Property-Based Testing Library**: `fast-check` (TypeScript-native, integrates with Jest).

**PBT Configuration**: Each property test runs a minimum of 100 iterations (`numRuns: 100`).

**Tag format**: Each property test is tagged with a comment:
`// Feature: professor-personal-website, Property {N}: {property_text}`

### Unit Tests (Jest + React Testing Library)

- **Component tests**: Navbar active-link highlighting, Gallery filter UI, Publications filter/search UI, ContactForm validation display, BlogPostCard excerpt truncation.
- **Utility tests**: Date formatting helpers, slug generation, Markdown rendering pipeline.
- **API route tests**: Contact form handler (mock nodemailer), auth login handler (mock file system), admin CRUD handlers (mock file system).

### Property-Based Tests (fast-check)

| Property | Test Description |
|---|---|
| P1: Active nav link indicator | Generate arbitrary valid pathnames; render Navbar; assert exactly one link has aria-current="page" matching the pathname |
| P2: Publications sorted by year desc | Generate random publication arrays with varying years; assert rendered list is sorted descending |
| P3: Publication card required fields | Generate random Publication objects; render PublicationCard; assert title, authors, venue, year, type are present |
| P4: Publication type filter | Generate random publication arrays + type values; assert filter returns only matching types |
| P5: Publication keyword search | Generate random publication arrays + keywords; assert search returns only matching titles/authors |
| P6: Course card required fields and status | Generate random Course objects; render CourseCard; assert name, code, term, status are present |
| P7: Active/archived course separation | Generate mixed course arrays; assert active and archived courses appear in correct sections only |
| P8: Conditional external link rendering | Generate content items with/without URL fields; assert link appears iff URL is present |
| P9: Contact form validation | Generate form submissions with arbitrary missing fields; assert each missing field is identified in the error |
| P10: Content round-trip integrity | Generate arbitrary content objects; write to JSON, parse back, assert deep equality |
| P11: Page metadata completeness | For each page, assert generateMetadata() returns non-empty title, description, og:title, og:description |
| P12: Current/alumni student separation | Generate mixed student arrays; assert current and alumni appear in correct sections only |
| P13: Student card required fields | Generate Student objects with both statuses; assert required fields are present per status |
| P14: Award card required fields | Generate random Award objects; render AwardCard; assert name, organization, year are present |
| P15: Blog posts sorted by date desc | Generate random blog post arrays with varying dates; assert rendered list is sorted descending |
| P16: Blog excerpt length invariant | Generate arbitrary blog post objects; assert excerpt ≤ 200 chars after validation |
| P17: Event card required fields | Generate random Event objects; render EventCard; assert name, date, location, description are present |
| P18: Upcoming/past event separation | Generate event arrays + reference timestamps; assert events are correctly categorized |
| P19: Collaborator card required fields | Generate random Collaborator objects; render CollaboratorCard; assert name, institution, area are present |
| P20: Resource description length | Generate arbitrary resource objects; assert description ≤ 150 chars after validation |
| P21: Gallery item alt text non-empty | Generate random GalleryItem objects; render component; assert img alt equals item's alt field |
| P22: Gallery category filter | Generate random gallery item arrays + category values; assert filter returns only matching categories |
| P23: Brute-force lockout invariant | Generate sequences of 5+ failed attempts; assert lockout triggers and lockedUntil ≥ now + 15min |
| P24: Session expiry invariant | Generate session objects with varying createdAt; assert session valid iff elapsed ≤ 8 hours |
| P25: Unauthenticated admin redirect | Generate arbitrary admin paths without session; assert middleware always redirects to /login |

### Integration Tests

- End-to-end contact form submission with a real SMTP test server (Ethereal Email).
- Admin login flow: valid credentials → session cookie → access admin page.
- Admin CRUD: create a publication via API → read the JSON file → verify content.
- ISR revalidation: update content via admin API → fetch public page → verify updated content appears.

### Accessibility Tests

- `jest-axe` runs on every page component to catch automated WCAG violations.
- Manual keyboard navigation audit for Navbar, Gallery lightbox, and Contact form.
- Colour contrast verified with Tailwind theme audit and browser DevTools.

### Performance Tests

- Lighthouse CI runs on every pull request, enforcing a performance score ≥ 90 on desktop.
- Core Web Vitals (LCP, CLS, FID) monitored via Vercel Analytics or similar.
