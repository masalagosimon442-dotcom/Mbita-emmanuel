/**
 * Unit tests for the Professor Personal Website
 * Verifies core components and configurations are correct
 */

describe("Project Configuration", () => {
  test("package.json has correct scripts", () => {
    const pkg = require("../package.json");
    expect(pkg.scripts.build).toBe("next build");
    expect(pkg.scripts.start).toContain("next start");
    expect(pkg.scripts.dev).toContain("next dev");
  });

  test("package.json has required dependencies", () => {
    const pkg = require("../package.json");
    expect(pkg.dependencies["next"]).toBeDefined();
    expect(pkg.dependencies["react"]).toBeDefined();
    expect(pkg.dependencies["react-dom"]).toBeDefined();
    expect(pkg.dependencies["@prisma/client"]).toBeDefined();
    expect(pkg.dependencies["prisma"]).toBeDefined();
    expect(pkg.dependencies["bcryptjs"]).toBeDefined();
    expect(pkg.dependencies["iron-session"]).toBeDefined();
    expect(pkg.dependencies["zod"]).toBeDefined();
  });

  test("package.json does NOT have mysql2 (switched to PostgreSQL)", () => {
    const pkg = require("../package.json");
    expect(pkg.dependencies["mysql2"]).toBeUndefined();
  });

  test("next.config.mjs settings are correct for production", () => {
    // Verify the config file exists and has correct structure
    const fs = require("fs");
    const config = fs.readFileSync("next.config.mjs", "utf-8");
    expect(config).toContain("ignoreDuringBuilds: true");
    expect(config).toContain("ignoreBuildErrors: true");
    expect(config).toContain('"openai"');
    expect(config).not.toContain('output: "standalone"');
  });
});

describe("Prisma Schema", () => {
  test("uses PostgreSQL provider", () => {
    const fs = require("fs");
    const schema = fs.readFileSync("prisma/schema.prisma", "utf-8");
    expect(schema).toContain('provider = "postgresql"');
    expect(schema).not.toContain('provider = "mysql"');
  });

  test("has no MySQL-specific annotations", () => {
    const fs = require("fs");
    const schema = fs.readFileSync("prisma/schema.prisma", "utf-8");
    expect(schema).not.toContain("@db.Text");
    expect(schema).not.toContain("@db.LongText");
    expect(schema).not.toContain("@db.VarChar");
  });

  test("has all required models", () => {
    const fs = require("fs");
    const schema = fs.readFileSync("prisma/schema.prisma", "utf-8");
    const requiredModels = [
      "Profile", "Publication", "ResearchProject", "Course",
      "Student", "Award", "BlogPost", "Event", "Collaborator",
      "GalleryItem", "AdminUser", "SiteSettings", "ContactMessage",
      "Testimonial", "Announcement", "TeamMember",
    ];
    requiredModels.forEach((model) => {
      expect(schema).toContain(`model ${model}`);
    });
  });

  test("has no migration files (using db push)", () => {
    const fs = require("fs");
    expect(fs.existsSync("prisma/migrations")).toBe(false);
  });
});

describe("Admin Layout Navigation", () => {
  test("sidebar has all required navigation groups", () => {
    const fs = require("fs");
    const layout = fs.readFileSync("components/layout/AdminLayout.tsx", "utf-8");
    expect(layout).toContain("/admin/home");
    expect(layout).toContain("/admin/about");
    expect(layout).toContain("/admin/profile");
    expect(layout).toContain("/admin/research");
    expect(layout).toContain("/admin/publications");
    expect(layout).toContain("/admin/teaching");
    expect(layout).toContain("/admin/students");
    expect(layout).toContain("/admin/blog");
    expect(layout).toContain("/admin/events");
    expect(layout).toContain("/admin/gallery");
    expect(layout).toContain("/admin/settings");
    expect(layout).toContain("/admin/messages");
    expect(layout).toContain("/admin/collaborations");
    expect(layout).toContain("/admin/team");
  });

  test("sidebar has logout functionality", () => {
    const fs = require("fs");
    const layout = fs.readFileSync("components/layout/AdminLayout.tsx", "utf-8");
    expect(layout).toContain("handleLogout");
    expect(layout).toContain("/api/auth/logout");
  });

  test("sidebar has link to public site", () => {
    const fs = require("fs");
    const layout = fs.readFileSync("components/layout/AdminLayout.tsx", "utf-8");
    expect(layout).toContain("View Public Site");
  });
});

describe("Public Pages Structure", () => {
  test("home page exists and imports required components", () => {
    const fs = require("fs");
    const page = fs.readFileSync("app/(public)/page.tsx", "utf-8");
    expect(page).toContain("HomePage");
    expect(page).toContain("ProfessorAvatar");
    expect(page).toContain("StatsCounter");
    expect(page).toContain("NewsSlider");
    expect(page).toContain("HomeSearch");
  });

  test("home page has academic profile links with icons", () => {
    const fs = require("fs");
    const page = fs.readFileSync("app/(public)/page.tsx", "utf-8");
    expect(page).toContain("isScholar");
    expect(page).toContain("isOrcid");
    expect(page).toContain("isResearchGate");
    expect(page).toContain("isLinkedIn");
    expect(page).toContain("isGitHub");
  });

  test("contact page exists with FAQ support", () => {
    const fs = require("fs");
    const page = fs.readFileSync("app/(public)/contact/page.tsx", "utf-8");
    expect(page).toContain("ContactForm");
    expect(page).toContain("FAQAccordion");
    expect(page).toContain("AppointmentForm");
  });

  test("about page exists", () => {
    const fs = require("fs");
    expect(fs.existsSync("app/(public)/about/page.tsx")).toBe(true);
  });
});

describe("Admin Pages", () => {
  test("admin home page has section visibility toggles", () => {
    const fs = require("fs");
    const page = fs.readFileSync("app/admin/home/page.tsx", "utf-8");
    expect(page).toContain("showAnnouncements");
    expect(page).toContain("showStats");
    expect(page).toContain("showPublications");
    expect(page).toContain("showTestimonials");
    expect(page).toContain("SECTION_TOGGLES");
  });

  test("admin about page has save functionality", () => {
    const fs = require("fs");
    const page = fs.readFileSync("app/admin/about/page.tsx", "utf-8");
    expect(page).toContain("handleSave");
    expect(page).toContain("/api/admin/profile");
    expect(page).toContain("Save Changes");
  });

  test("admin home page has save functionality", () => {
    const fs = require("fs");
    const page = fs.readFileSync("app/admin/home/page.tsx", "utf-8");
    expect(page).toContain("handleSave");
    expect(page).toContain("/api/admin/settings");
    expect(page).toContain("Save Changes");
  });
});
