import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  totpToken: z.string().optional(), // MFA token (6 digits)
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body.", code: "INVALID_JSON" }, { status: 400 });
  }

  const result = loginSchema.safeParse(body);
  if (!result.success) {
    const fields: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string;
      if (field) fields[field] = issue.message;
    }
    return NextResponse.json({ error: "Validation failed.", code: "VALIDATION_ERROR", fields }, { status: 400 });
  }

  const { username, password, totpToken } = result.data;

  let adminUser;
  try {
    adminUser = await prisma.adminUser.findUnique({ where: { username } });
  } catch {
    return NextResponse.json({ error: "Internal server error.", code: "DB_ERROR" }, { status: 500 });
  }

  if (!adminUser) {
    return NextResponse.json({ error: "Invalid credentials.", code: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  // Check lockout
  if (adminUser.lockedUntil && adminUser.lockedUntil > new Date()) {
    const minutesLeft = Math.ceil((adminUser.lockedUntil.getTime() - Date.now()) / 60000);
    return NextResponse.json({
      error: `Account is temporarily locked. Please try again in ${minutesLeft} minute(s).`,
      code: "ACCOUNT_LOCKED",
    }, { status: 423 });
  }

  // Compare password
  const passwordMatch = await bcrypt.compare(password, adminUser.passwordHash);

  if (!passwordMatch) {
    const newFailedAttempts = adminUser.failedAttempts + 1;
    const shouldLock = newFailedAttempts >= 5;
    await prisma.adminUser.update({
      where: { id: adminUser.id },
      data: {
        failedAttempts: newFailedAttempts,
        lockedUntil: shouldLock ? new Date(Date.now() + 15 * 60 * 1000) : null,
      },
    });
    if (shouldLock) {
      return NextResponse.json({ error: "Too many failed attempts. Account locked for 15 minutes.", code: "ACCOUNT_LOCKED" }, { status: 423 });
    }
    return NextResponse.json({ error: "Invalid credentials.", code: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  // ── MFA CHECK ──
  if (adminUser.totpEnabled && adminUser.totpSecret) {
    if (!totpToken) {
      // Password correct but MFA required — tell client to show MFA input
      return NextResponse.json({ error: "MFA token required.", code: "MFA_REQUIRED" }, { status: 200 });
    }

    // Verify TOTP token
    const { verify: verifyOtp } = await import("otplib");
    const otpResult = await verifyOtp({ token: totpToken, secret: adminUser.totpSecret });
    if (!otpResult.valid) {
      return NextResponse.json({ error: "Invalid MFA code. Please try again.", code: "INVALID_MFA" }, { status: 401 });
    }
  }

  // On success reset failed attempts and create session
  await prisma.adminUser.update({
    where: { id: adminUser.id },
    data: { failedAttempts: 0, lockedUntil: null },
  });

  // Log successful login
  try {
    await prisma.securityLog.create({
      data: {
        event: "login_success",
        username: adminUser.username,
        ipAddress: request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown",
        details: "Successful login",
      },
    });
  } catch { /* non-fatal */ }

  const response = NextResponse.json({ message: "Login successful." }, { status: 200 });
  const session = await getIronSession<SessionData>(request, response, sessionOptions);
  session.username = adminUser.username;
  session.createdAt = Date.now();
  await session.save();

  return response;
}
