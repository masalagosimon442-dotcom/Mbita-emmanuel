# Requirements Document

## Introduction

A personal website for a professor that serves as a professional online presence. The site presents the professor's academic identity, research work, publications, teaching activities, student supervision, achievements, blog posts, events, collaborations, and a photo gallery to students, collaborators, and the broader academic community. The site is publicly accessible for visitors and includes a secure admin panel that allows the professor or a designated administrator to manage all content without modifying source code.

## Glossary

- **Website**: The professor's personal academic website as a whole.
- **Visitor**: Any person accessing the Website via a web browser.
- **Professor**: The academic professional whose information is presented on the Website.
- **Administrator**: The person (typically the Professor) responsible for managing and updating Website content.
- **Publication**: A peer-reviewed paper, book, book chapter, conference proceeding, or technical report authored or co-authored by the Professor.
- **Research_Project**: A funded or ongoing research initiative led or participated in by the Professor.
- **Course**: An academic course taught by the Professor at their institution.
- **CV**: The Professor's curriculum vitae document.
- **Navigation**: The set of links allowing Visitors to move between sections of the Website.
- **Student**: A PhD or Master's student currently supervised or previously supervised by the Professor.
- **Alumni**: A former Student who has completed their degree under the Professor's supervision.
- **Award**: A formal recognition, honor, or grant received by the Professor.
- **Blog_Post**: A written entry published by the Professor or Administrator on the Website's blog.
- **Event**: A scheduled or past academic activity such as a talk, workshop, or conference appearance.
- **Collaborator**: An individual researcher or institution with whom the Professor has an active or past research partnership.
- **Gallery_Item**: A photograph or image associated with the Professor's academic activities.
- **Admin_User**: An authenticated Administrator with permission to manage Website content through the admin panel.
- **Site_Settings**: Global configuration values (site title, footer text, social links, contact email, maintenance mode) managed by the Admin_User and applied site-wide.
- **Contact_Message**: A message submitted by a Visitor via the contact form and stored in the database for review by the Admin_User.
- **Activity_Log**: A record of admin actions (create, update, delete, publish/unpublish) with timestamps stored for audit purposes.

---

## Requirements

### Requirement 1: Professional Profile and About Section

**User Story:** As a Visitor, I want to view the Professor's professional profile, so that I can quickly understand their academic identity and expertise.

#### Acceptance Criteria

1. THE Website SHALL display the Professor's full name, academic title, and institutional affiliation on the homepage.
2. THE Website SHALL display a professional photograph of the Professor on the homepage as the primary hero image.
3. THE Website SHALL display a biographical summary describing the Professor's research interests and academic background.
4. THE Website SHALL display the Professor's current position and department.
5. WHEN a Visitor loads the homepage, THE Website SHALL render all profile information within 3 seconds on a standard broadband connection.
6. THE Website SHALL display the Professor's photograph on the About page alongside the full biography.
7. THE Website SHALL display a smaller thumbnail of the Professor's photograph in the site navigation bar or header area so it is visible on every page.
8. THE Website SHALL display the Professor's photograph on the Contact page alongside the contact information.
9. THE Website SHALL display the Professor's photograph in the footer area as a consistent visual identity element.
10. WHERE the Professor's photograph is displayed, it SHALL always include a descriptive non-empty alt text attribute.

---

### Requirement 2: Navigation and Site Structure

**User Story:** As a Visitor, I want to navigate between sections of the website easily, so that I can find the information I need without confusion.

#### Acceptance Criteria

1. THE Navigation SHALL provide links to all major sections in the following order: Home, About, Research & Projects, Teaching & Courses, Publications, Students & Supervision, CV & Achievements, Blog / News & Events, Collaborations & Resources, Gallery, Contact, and Login / Admin Panel.
2. WHEN a Visitor selects a Navigation link, THE Website SHALL display the corresponding section or page.
3. THE Website SHALL display the Navigation consistently on every page.
4. WHILE a Visitor is viewing a section, THE Navigation SHALL visually indicate the currently active section.
5. WHERE the Website is accessed on a mobile device, THE Navigation SHALL collapse into a responsive menu that remains fully functional.
6. THE Navigation SHALL display the Login / Admin Panel link in a visually distinct position to differentiate it from public-facing sections.

---

### Requirement 3: Research Section

**User Story:** As a Visitor, I want to learn about the Professor's research projects and interests, so that I can evaluate potential collaboration or understand their academic focus.

#### Acceptance Criteria

1. THE Website SHALL display a list of Research_Projects with a title, description, and current status (active or completed) for each.
2. WHEN a Visitor selects a Research_Project, THE Website SHALL display detailed information including funding sources, collaborators, and project timeline where available.
3. THE Website SHALL display the Professor's research interests as a clearly labeled list or summary.
4. WHERE external project pages or lab websites exist, THE Website SHALL provide links to those resources.

---

### Requirement 4: Publications Section

**User Story:** As a Visitor, I want to browse the Professor's publications, so that I can find and access their academic work.

#### Acceptance Criteria

1. THE Website SHALL display a list of Publications sorted by year in descending order by default.
2. EACH Publication entry SHALL include the title, authors, venue (journal or conference name), year, and publication type.
3. WHERE a Publication has a publicly accessible URL or DOI, THE Website SHALL display a link to the full text.
4. WHEN a Visitor filters Publications by type (e.g., journal, conference, book chapter), THE Website SHALL display only Publications matching the selected type.
5. WHEN a Visitor searches Publications by keyword, THE Website SHALL display only Publications whose title or authors contain the keyword.

---

### Requirement 5: Teaching Section

**User Story:** As a Visitor, I want to see the courses the Professor teaches, so that I can understand their teaching responsibilities and access course-related information.

#### Acceptance Criteria

1. THE Website SHALL display a list of Courses taught by the Professor, including course name, course code, and academic term.
2. EACH Course entry SHALL indicate whether the course is currently active or archived.
3. WHERE a Course has an external course page or syllabus, THE Website SHALL provide a link to that resource.
4. THE Website SHALL separate currently active Courses from archived Courses in the display.

---

### Requirement 6: Contact Section

**User Story:** As a Visitor, I want to find the Professor's contact information, so that I can reach out for academic or professional inquiries.

#### Acceptance Criteria

1. THE Website SHALL display the Professor's institutional email address.
2. THE Website SHALL display the Professor's office location including building and room number.
3. THE Website SHALL display the Professor's office hours or a note indicating how to schedule a meeting.
4. WHERE the Professor maintains professional academic profiles (e.g., Google Scholar, ORCID, LinkedIn, ResearchGate), THE Website SHALL display links to those profiles.
5. IF a Visitor submits a contact form with a name, email address, and message, THEN THE Website SHALL deliver the message to the Professor's email address.
6. IF a Visitor submits a contact form with a missing required field, THEN THE Website SHALL display a descriptive validation error identifying the missing field.

---

### Requirement 7: Accessibility and Responsiveness

**User Story:** As a Visitor using any device or assistive technology, I want the website to be accessible and readable, so that I can access all content regardless of my device or ability.

#### Acceptance Criteria

1. THE Website SHALL conform to WCAG 2.1 Level AA accessibility guidelines.
2. THE Website SHALL render correctly on viewport widths from 320px to 2560px.
3. THE Website SHALL provide descriptive alternative text for all non-decorative images.
4. WHEN a Visitor navigates the Website using only a keyboard, THE Website SHALL provide visible focus indicators on all interactive elements.
5. THE Website SHALL maintain a color contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.

---

### Requirement 8: Content Management

**User Story:** As an Administrator, I want to update website content without modifying source code, so that I can keep the site current without developer assistance.

#### Acceptance Criteria

1. THE Website SHALL store content for all sections — including profile information, publications, courses, research projects, students, alumni, awards, blog posts, events, collaborators, resources, and gallery items — in structured data files or a content management interface separate from the presentation layer.
2. WHEN an Administrator updates a content file or uses the admin panel to modify content, THE Website SHALL reflect the updated content upon the next page load or build.
3. THE Website SHALL support content in a human-readable format (e.g., Markdown or JSON) to allow direct file editing without specialized tools.

---

### Requirement 9: Performance and SEO

**User Story:** As a Visitor, I want the website to load quickly and be discoverable via search engines, so that I can access it efficiently and find it through academic searches.

#### Acceptance Criteria

1. THE Website SHALL achieve a Lighthouse performance score of 90 or above on desktop.
2. THE Website SHALL include descriptive page titles and meta descriptions for each page.
3. THE Website SHALL include structured metadata (e.g., Open Graph tags) to support link previews when shared on social platforms.
4. THE Website SHALL be served over HTTPS.

---

### Requirement 10: Students & Supervision Section

**User Story:** As a Visitor, I want to see the students the Professor supervises or has supervised, so that I can understand their mentorship activities and connect with the research community.

#### Acceptance Criteria

1. THE Website SHALL display a list of current Students under the Professor's supervision, including each Student's name, degree level (PhD or Master's), and research topic.
2. THE Website SHALL display a separate list of Alumni, including each alumnus's name, degree level, thesis title, graduation year, and current position where available.
3. WHEN a Visitor views the Students & Supervision section, THE Website SHALL clearly separate current Students from Alumni.
4. WHERE a Student or alumnus has a personal or institutional profile page, THE Website SHALL provide a link to that page.
5. IF no current Students are listed, THEN THE Website SHALL display a message indicating that no current students are listed at this time.

---

### Requirement 11: CV & Achievements Section

**User Story:** As a Visitor, I want to view the Professor's awards, honors, and grants, and download their CV, so that I can assess their academic standing and accomplishments.

#### Acceptance Criteria

1. THE Website SHALL display a list of Awards received by the Professor, including the award name, granting organization, and year received.
2. THE Website SHALL display a list of grants and fellowships, including the grant title, funding agency, amount where publicly available, and period of funding.
3. THE Website SHALL display a list of honors and distinctions separate from Awards.
4. THE Website SHALL provide a downloadable link to the Professor's CV in PDF format.
5. WHEN a Visitor downloads the CV, THE Website SHALL serve the file with the correct MIME type (application/pdf) and a descriptive filename.
6. WHEN the CV file is updated by the Administrator, THE Website SHALL serve the updated version on the next page load.

---

### Requirement 12: Blog / News & Events Section

**User Story:** As a Visitor, I want to read the Professor's blog posts and stay informed about news and events, so that I can follow their academic activities and announcements.

#### Acceptance Criteria

1. THE Website SHALL display a list of Blog_Posts sorted by publication date in descending order.
2. EACH Blog_Post entry in the list SHALL include the title, publication date, and a short excerpt of no more than 200 characters.
3. WHEN a Visitor selects a Blog_Post, THE Website SHALL display the full content of that Blog_Post.
4. THE Website SHALL display a list of Events, each including the event name, date, location, and a brief description.
5. THE Website SHALL separate upcoming Events from past Events in the display.
6. WHERE an Event has an external registration or information page, THE Website SHALL provide a link to that page.
7. IF no Blog_Posts exist, THEN THE Website SHALL display a message indicating that no posts have been published yet.
8. WHEN an Admin_User creates or edits a Blog_Post via the admin panel, THE Website SHALL publish or update the post upon saving.

---

### Requirement 13: Collaborations & Resources Section

**User Story:** As a Visitor, I want to learn about the Professor's collaborators and access useful academic resources, so that I can understand their professional network and find relevant materials.

#### Acceptance Criteria

1. THE Website SHALL display a list of Collaborators, including each Collaborator's name, institutional affiliation, and area of collaboration.
2. THE Website SHALL display a list of partner institutions with which the Professor has active or past research partnerships.
3. WHERE a Collaborator has a personal or institutional profile page, THE Website SHALL provide a link to that page.
4. THE Website SHALL display a curated list of useful resources or links (e.g., datasets, tools, reading lists) relevant to the Professor's research areas.
5. EACH resource entry SHALL include a title, a brief description of no more than 150 characters, and a URL.
6. IF a resource URL is no longer accessible, THE Website SHALL not display a broken link indicator; the Administrator is responsible for maintaining link validity.

---

### Requirement 14: Gallery Section

**User Story:** As a Visitor, I want to view photos from the Professor's academic activities, so that I can get a visual sense of their lab, events, and professional engagements.

#### Acceptance Criteria

1. THE Website SHALL display a grid or masonry layout of Gallery_Items.
2. EACH Gallery_Item SHALL include a descriptive caption and an associated event or category label (e.g., Lab, Conference, Workshop).
3. WHEN a Visitor selects a Gallery_Item, THE Website SHALL display the image at full resolution in an overlay or dedicated view.
4. THE Website SHALL provide descriptive alternative text for every Gallery_Item image.
5. THE Website SHALL allow Gallery_Items to be filtered by category label.
6. WHERE the Website is accessed on a mobile device, THE Gallery SHALL display in a single-column layout that maintains image aspect ratios.

---

### Requirement 15: Login / Admin Panel

**User Story:** As an Administrator, I want to log in to a secure admin panel that gives me full control over every aspect of the website, so that I can manage all content, settings, and site behaviour without touching source code.

#### Acceptance Criteria

1. THE Website SHALL provide a login page accessible via the Login / Admin Panel navigation link.
2. WHEN an Admin_User submits valid credentials, THE Website SHALL grant access to the admin panel and redirect the Admin_User to the content management dashboard.
3. IF an Admin_User submits invalid credentials, THEN THE Website SHALL display a descriptive authentication error and deny access.
4. IF an Admin_User submits invalid credentials 5 or more consecutive times, THEN THE Website SHALL temporarily lock the account for a minimum of 15 minutes and display a lockout message.
5. WHILE an Admin_User is authenticated, THE Website SHALL maintain the session for no longer than 8 hours of inactivity before requiring re-authentication.
6. THE Website SHALL transmit all authentication credentials exclusively over HTTPS.
7. IF an unauthenticated Visitor attempts to access an admin panel URL directly, THEN THE Website SHALL redirect the Visitor to the login page.
8. WHEN an Admin_User logs out, THE Website SHALL invalidate the session and redirect the Admin_User to the public homepage.
9. THE Admin_Panel SHALL provide full create, update, and delete control over every content section of the Website without modifying source code: Profile & About, Research & Projects, Teaching & Courses, Publications, Students & Supervision, CV & Achievements, Blog / News & Events, Collaborations & Resources, Gallery, and Contact information.
10. THE Admin_Panel SHALL provide a dashboard overview displaying the total count of records for each content type and a list of the most recently updated items across all sections.
11. THE Admin_Panel SHALL allow the Admin_User to change their own admin password from within the panel.
12. THE Admin_Panel SHALL allow the Admin_User to control the visibility of any content item by toggling it between published and draft/hidden states, so that content can be prepared before going live.
13. THE Admin_Panel SHALL allow the Admin_User to upload and replace the professor's profile photo and CV PDF directly from the panel without accessing the file system.
14. THE Admin_Panel SHALL display a log of recent admin actions (create, update, delete, publish/unpublish) with timestamps, so the Admin_User can review what was changed and when.
15. THE Admin_Panel SHALL allow the Admin_User to manage site-wide settings including the website title, footer text, social media links, and contact email displayed on the public site.
16. WHEN an Admin_User performs a destructive action (delete or unpublish), THE Admin_Panel SHALL display a confirmation dialog before executing the action.
17. THE Admin_Panel SHALL provide a message inbox displaying all contact form submissions received from Visitors, so the Admin_User can review them without checking email.
18. THE Admin_Panel SHALL allow the Admin_User to mark contact form messages as read or delete them from the inbox.

---

### Requirement 17: Admin Site Settings

**User Story:** As an Administrator, I want to control global site settings from the admin panel, so that I can customise the website's appearance and behaviour without developer assistance.

#### Acceptance Criteria

1. THE Admin_Panel SHALL allow the Admin_User to update the site title and tagline displayed in the browser tab and homepage header.
2. THE Admin_Panel SHALL allow the Admin_User to update the footer text and copyright notice.
3. THE Admin_Panel SHALL allow the Admin_User to add, edit, or remove social media and academic profile links (e.g., Google Scholar, ORCID, LinkedIn, ResearchGate, Twitter/X) displayed site-wide.
4. THE Admin_Panel SHALL allow the Admin_User to toggle individual navigation sections on or off, so that sections not yet ready can be hidden from public visitors.
5. WHEN an Admin_User toggles a navigation section off, THE Website SHALL hide that section's link from the public Navigation and return a 404 for direct URL access.
6. THE Admin_Panel SHALL allow the Admin_User to set a site-wide maintenance mode message that replaces all public pages with a "under maintenance" notice while the admin panel remains accessible.
7. WHEN maintenance mode is active, THE Website SHALL display the maintenance message to all Visitors and return HTTP 503 for all public routes.
8. THE Admin_Panel SHALL allow the Admin_User to update the contact email address to which contact form submissions are delivered.

---

### Requirement 16: Error Handling and Resilience

**User Story:** As a Visitor, I want to see a helpful page when something goes wrong, so that I am not left with a broken or confusing experience.

#### Acceptance Criteria

1. WHEN a Visitor navigates to a URL that does not exist on the Website, THE Website SHALL display a custom 404 page with a clear message and a link back to the homepage.
2. WHEN a server-side error occurs, THE Website SHALL display a custom error page that does not expose technical details or stack traces to the Visitor.
3. THE custom 404 and error pages SHALL maintain the same Navigation and visual style as the rest of the Website.
4. WHEN the contact form fails to deliver a message due to a server error, THE Website SHALL display an error message instructing the Visitor to try again or use the displayed email address directly.
