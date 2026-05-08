import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/activityLog";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";

const settingsSchema = z.object({
  siteTitle: z.string().optional().default(""),
  tagline: z.string().optional(),
  footerText: z.string().optional(),
  contactEmail: z.string().email("Valid email is required").optional().or(z.literal("")),
  maintenanceMode: z.boolean().optional(),
  maintenanceMsg: z.string().optional(),
  socialLinks: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
  hiddenSections: z.array(z.string()).optional(),
  heroVideoUrl: z.string().optional(),
  heroImageUrl: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroCTAText: z.string().optional(),
  heroCTALink: z.string().optional(),
  showAnnouncements: z.boolean().optional(),
  showStats: z.boolean().optional(),
  showNewsSlider: z.boolean().optional(),
  showUpcomingEvents: z.boolean().optional(),
  showPublications: z.boolean().optional(),
  showTestimonials: z.boolean().optional(),
  showResearchHighlights: z.boolean().optional(),
  showAchievements: z.boolean().optional(),
  showQuickLinks: z.boolean().optional(),
});

async function getUsername(request: NextRequest): Promise<string> {
  const res = new NextResponse();
  const session = await getIronSession<SessionData>(request, res, sessionOptions);
  return session.username ?? "admin";
}

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      return NextResponse.json(
        { error: "Site settings not found.", code: "NOT_FOUND" },
        { status: 404 }
      );
    }
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed to fetch settings.", code: "DB_ERROR" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const performedBy = await getUsername(request);

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON.", code: "INVALID_JSON" }, { status: 400 });
  }

  const result = settingsSchema.safeParse(body);
  if (!result.success) {
    const fields: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path.join(".") || "unknown";
      fields[field] = issue.message;
    }
    console.error("Settings validation failed:", JSON.stringify(fields, null, 2));
    return NextResponse.json({ error: "Validation failed.", code: "VALIDATION_ERROR", fields }, { status: 400 });
  }

  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: {
        ...result.data,
        socialLinks: result.data.socialLinks ?? [],
        hiddenSections: result.data.hiddenSections ?? [],
        maintenanceMode: result.data.maintenanceMode ?? false,
      },
      create: {
        id: 1,
        siteTitle: result.data.siteTitle,
        tagline: result.data.tagline,
        footerText: result.data.footerText ?? "",
        contactEmail: result.data.contactEmail ?? "",
        socialLinks: result.data.socialLinks ?? [],
        hiddenSections: result.data.hiddenSections ?? [],
        maintenanceMode: result.data.maintenanceMode ?? false,
        heroVideoUrl: result.data.heroVideoUrl,
        heroImageUrl: result.data.heroImageUrl,
        heroTitle: result.data.heroTitle,
        heroSubtitle: result.data.heroSubtitle,
        heroCTAText: result.data.heroCTAText,
        heroCTALink: result.data.heroCTALink,
        showAnnouncements: result.data.showAnnouncements ?? true,
        showStats: result.data.showStats ?? true,
        showNewsSlider: result.data.showNewsSlider ?? true,
        showUpcomingEvents: result.data.showUpcomingEvents ?? true,
        showPublications: result.data.showPublications ?? true,
        showTestimonials: result.data.showTestimonials ?? true,
        showResearchHighlights: result.data.showResearchHighlights ?? true,
        showAchievements: result.data.showAchievements ?? true,
        showQuickLinks: result.data.showQuickLinks ?? true,
      },
    });

    revalidatePath("/");
    await logAction("UPDATE", "settings", "1", "Site Settings", performedBy);

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed to update settings.", code: "DB_ERROR" }, { status: 500 });
  }
}
