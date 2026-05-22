"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfessorAvatar from "@/components/ui/ProfessorAvatar";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface NavbarProfile {
  fullName: string;
  title: string;
  photoUrl?: string | null;
}

interface NavbarProps {
  profile?: NavbarProfile | null;
  hiddenSections?: string[];
}

// ── NAV STRUCTURE ──────────────────────────────────────────────────────────
const standaloneLinks = [
  { href: "/", label: "Home", key: "home" },
  { href: "/about", label: "About", key: "about" },
];

const dropdownGroups = [
  {
    label: "Academic",
    key: "academic",
    icon: "🎓",
    items: [
      { href: "/research", label: "Research & Projects", key: "research", icon: "🔬", desc: "Current and past research" },
      { href: "/publications", label: "Publications", key: "publications", icon: "📄", desc: "Papers, books & articles" },
      { href: "/cv", label: "CV & Achievements", key: "cv", icon: "🏆", desc: "Awards, grants & honours" },
      { href: "/collaborations", label: "Collaborations & Resources", key: "collaborations", icon: "🤝", desc: "Partners & resources" },
    ],
  },
  {
    label: "Teaching",
    key: "teaching-group",
    icon: "📚",
    items: [
      { href: "/teaching", label: "Teaching & Courses", key: "teaching", icon: "🎓", desc: "Active & archived courses" },
      { href: "/students", label: "Students & Supervision", key: "students", icon: "👩‍🎓", desc: "Current students & alumni" },
    ],
  },
  {
    label: "Media",
    key: "media",
    icon: "📸",
    items: [
      { href: "/blog", label: "Blog / News & Events", key: "blog", icon: "✍️", desc: "Latest posts & news" },
      { href: "/events", label: "Events", key: "events", icon: "📅", desc: "Upcoming & past events" },
      { href: "/gallery", label: "Gallery", key: "gallery", icon: "🖼️", desc: "Photos & media" },
    ],
  },
];

const contactLink = { href: "/contact", label: "Contact", key: "contact" };

// ── DROPDOWN COMPONENT ─────────────────────────────────────────────────────
interface DropdownProps {
  label: string;
  icon: string;
  items: { href: string; label: string; key: string; icon: string; desc: string }[];
  isGroupActive: boolean;
  hiddenSections: string[];
  onClose: () => void;
}

function DropdownMenu({ label, icon, items, isGroupActive, hiddenSections, onClose }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  const visibleItems = items.filter((item) => !hiddenSections.includes(item.key));
  if (visibleItems.length === 0) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-haspopup="true"
        className={[
          "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          isGroupActive
            ? "bg-primary-light dark:bg-navy-800 text-primary dark:text-navy-100 font-semibold"
            : "text-navy-700 dark:text-gray-200 hover:bg-navy-50 dark:hover:bg-navy-800 hover:text-navy-900 dark:hover:text-white",
        ].join(" ")}
      >
        <span aria-hidden="true" className="text-base">{icon}</span>
        {label}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-navy-800 border border-border dark:border-navy-700 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="py-1">
            {visibleItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => { setOpen(false); onClose(); }}
                  className={[
                    "flex items-start gap-3 px-4 py-3 hover:bg-navy-50 dark:hover:bg-navy-700 transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    active ? "bg-primary-light dark:bg-navy-700" : "",
                  ].join(" ")}
                >
                  <span className="text-lg mt-0.5 flex-shrink-0" aria-hidden="true">{item.icon}</span>
                  <div>
                    <p className={`text-sm font-medium ${active ? "text-primary dark:text-navy-100" : "text-navy-900 dark:text-gray-100"}`}>
                      {item.label}
                    </p>
                    <p className="text-xs text-navy-400 dark:text-navy-300 mt-0.5">{item.desc}</p>
                  </div>
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" aria-hidden="true" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN NAVBAR ────────────────────────────────────────────────────────────
export default function Navbar({ profile, hiddenSections = [] }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isGroupActive = (items: { href: string; key: string }[]) =>
    items.some((item) => isActive(item.href));

  const visibleStandalone = standaloneLinks.filter((l) => !hiddenSections.includes(l.key));

  return (
    <nav aria-label="Main navigation" className="bg-white dark:bg-navy-900 border-b border-border dark:border-navy-800 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── BRAND (left on desktop, center on mobile) ── */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative group">
              <button
                onClick={() => window.location.href = '/login'}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
                aria-label="Admin access"
                title="Admin Panel"
              >
                <ProfessorAvatar
                  photoUrl={profile?.photoUrl}
                  alt={profile?.fullName ?? "Professor"}
                  width={40}
                  height={40}
                  className="flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-primary/50 rounded-full transition-all"
                />
              </button>
            </div>
            <Link
              href="/"
              className="text-navy-900 dark:text-gray-100 font-semibold text-base hover:text-primary dark:hover:text-navy-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded leading-tight"
            >
              <span className="block">{profile?.fullName ?? "Professor"}</span>
              {profile?.title && (
                <span className="block text-xs font-normal text-navy-500 dark:text-navy-300 truncate max-w-[180px]">
                  {profile.title}
                </span>
              )}
            </Link>

            {/* Hamburger right next to title on mobile */}
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((p) => !p)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                className="p-2 rounded-md text-navy-700 dark:text-gray-200 hover:bg-navy-100 dark:hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* ── DESKTOP NAV ── */}
          <div className="hidden lg:flex items-center gap-0.5">
            {/* Standalone links */}
            {visibleStandalone.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={[
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isActive(link.href)
                    ? "bg-primary-light dark:bg-navy-800 text-primary dark:text-navy-100 font-semibold"
                    : "text-navy-700 dark:text-gray-200 hover:bg-navy-50 dark:hover:bg-navy-800 hover:text-navy-900 dark:hover:text-white",
                ].join(" ")}
              >
                {link.label}
              </Link>
            ))}

            {/* Dropdown groups */}
            {dropdownGroups.map((group) => (
              <DropdownMenu
                key={group.key}
                label={group.label}
                icon={group.icon}
                items={group.items}
                isGroupActive={isGroupActive(group.items)}
                hiddenSections={hiddenSections}
                onClose={() => setMobileMenuOpen(false)}
              />
            ))}

            {/* Contact */}
            {!hiddenSections.includes(contactLink.key) && (
              <Link
                href={contactLink.href}
                aria-current={isActive(contactLink.href) ? "page" : undefined}
                className={[
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isActive(contactLink.href)
                    ? "bg-primary-light dark:bg-navy-800 text-primary dark:text-navy-100 font-semibold"
                    : "text-navy-700 dark:text-gray-200 hover:bg-navy-50 dark:hover:bg-navy-800 hover:text-navy-900 dark:hover:text-white",
                ].join(" ")}
              >
                {contactLink.label}
              </Link>
            )}

            {/* Divider */}
            <div className="w-px h-5 bg-border dark:bg-navy-700 mx-1" aria-hidden="true" />

            {/* Theme */}
            <ThemeToggle />
          </div>

          {/* ── MOBILE EXTRAS ── */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden border-t border-border dark:border-navy-800 bg-white dark:bg-navy-900">
          <div className="px-4 py-3 space-y-1">

            {/* Standalone links */}
            {visibleStandalone.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={[
                  "block px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-primary-light dark:bg-navy-800 text-primary dark:text-navy-100 font-semibold"
                    : "text-navy-700 dark:text-gray-200 hover:bg-navy-50 dark:hover:bg-navy-800",
                ].join(" ")}
              >
                {link.label}
              </Link>
            ))}

            {/* Dropdown groups as accordions */}
            {dropdownGroups.map((group) => {
              const visibleItems = group.items.filter((i) => !hiddenSections.includes(i.key));
              if (visibleItems.length === 0) return null;
              const groupActive = isGroupActive(group.items);
              const isOpen = openMobileGroup === group.key;

              return (
                <div key={group.key}>
                  <button
                    onClick={() => setOpenMobileGroup(isOpen ? null : group.key)}
                    aria-expanded={isOpen}
                    className={[
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                      groupActive ? "text-primary dark:text-navy-200" : "text-navy-700 dark:text-gray-200 hover:bg-navy-50 dark:hover:bg-navy-800",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-2">
                      <span aria-hidden="true">{group.icon}</span>
                      {group.label}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary-light dark:border-navy-700 pl-3">
                      {visibleItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => { setMobileMenuOpen(false); setOpenMobileGroup(null); }}
                          className={[
                            "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                            isActive(item.href)
                              ? "bg-primary-light dark:bg-navy-800 text-primary dark:text-navy-100 font-semibold"
                              : "text-navy-600 dark:text-gray-300 hover:bg-navy-50 dark:hover:bg-navy-800 hover:text-navy-900 dark:hover:text-white",
                          ].join(" ")}
                        >
                          <span aria-hidden="true">{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Contact */}
            {!hiddenSections.includes(contactLink.key) && (
              <Link
                href={contactLink.href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isActive(contactLink.href) ? "page" : undefined}
                className={[
                  "block px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive(contactLink.href)
                    ? "bg-primary-light dark:bg-navy-800 text-primary dark:text-navy-100 font-semibold"
                    : "text-navy-700 dark:text-gray-200 hover:bg-navy-50 dark:hover:bg-navy-800",
                ].join(" ")}
              >
                {contactLink.label}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
