import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Mbita Deogratias",
    template: "%s | Mbita Deogratias",
  },
  description: "Academic personal website",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

// Root layout — ONLY wraps with html/body.
// Navbar/Footer are added by child layouts:
//   - app/(public)/layout.tsx  → public pages
//   - app/admin/layout.tsx     → admin pages (has its own AdminLayout)
//   - app/login/page.tsx       → standalone login page
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
