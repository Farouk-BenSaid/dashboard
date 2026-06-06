"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import {
  ArrowLeft,
  CircleAlert,
  LayoutGrid,
  SearchIcon,
  Users,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: <LayoutGrid className="w-4.5 h-4.5" />,
  },
  {
    label: "Investigation",
    href: "/dashboard/investigation",
    icon: <SearchIcon className="w-4.5 h-4.5" />,
  },
  {
    label: "Alerts",
    href: "/dashboard/alerts",
    icon: <CircleAlert className="w-4.5 h-4.5" />,
    badge: 1,
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: <Users className="w-4.5 h-4.5" />,
  },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<HTMLUListElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function check() {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setCollapsed(w >= 768 && w < 1024);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const ctx = gsap.context(() => {
      gsap.from(logoRef.current, {
        scale: 0.4,
        opacity: 0,
        duration: 0.55,
        ease: "back.out(2.2)",
        delay: 0.1,
      });
      const items = navItemsRef.current?.querySelectorAll("li");
      if (items) {
        gsap.from(items, {
          x: -18,
          opacity: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.out",
          delay: 0.25,
        });
      }
    }, sidebarRef);
    return () => ctx.revert();
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    if (mobileOpen) {
      gsap.set(overlayRef.current, { display: "block" });
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25 },
      );
      gsap.fromTo(
        sidebarRef.current,
        { x: -240 },
        { x: 0, duration: 0.38, ease: "expo.out" },
      );
      const items = navItemsRef.current?.querySelectorAll("li");
      if (items) {
        gsap.from(items, {
          x: -16,
          opacity: 0,
          duration: 0.4,
          stagger: 0.055,
          ease: "power3.out",
          delay: 0.1,
        });
      }
    } else {
      gsap.to(sidebarRef.current, {
        x: -240,
        duration: 0.3,
        ease: "power3.in",
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.25,
        onComplete: () => gsap.set(overlayRef.current, { display: "none" }),
      });
    }
  }, [mobileOpen, isMobile]);

  function toggleCollapse() {
    const next = !collapsed;
    setCollapsed(next);
    gsap.to(sidebarRef.current, {
      width: next ? 64 : 220,
      duration: 0.35,
      ease: "power3.inOut",
    });
  }

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = e.currentTarget;
    gsap
      .timeline()
      .to(el, { scale: 0.96, duration: 0.08 })
      .to(el, { scale: 1, duration: 0.35, ease: "elastic.out(1,0.5)" });
    if (isMobile) onMobileClose();
  }

  const sidebarWidth = isMobile ? 220 : collapsed ? 64 : 220;

  return (
    <>
      <div
        ref={overlayRef}
        onClick={onMobileClose}
        className="fixed inset-0 z-30 hidden"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }}
      />

      <aside
        ref={sidebarRef}
        className="fixed top-0 left-0 h-full z-40 flex flex-col"
        style={{
          width: sidebarWidth,
          background: "var(--color-surface)",
          borderRight: "1px solid var(--color-border-subtle)",
          transform: isMobile ? "translateX(-240px)" : "none",
          transition: isMobile ? "none" : undefined,
        }}
      >
        <div
          ref={logoRef}
          className="flex items-center gap-3 px-4 py-5 shrink-0"
          style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
        >
          <span
            className="shrink-0 flex items-center justify-center w-9 h-9 rounded-[9px] font-mono text-xs font-medium tracking-wider"
            style={{
              background: "var(--color-indigo-dim)",
              border: "1px solid var(--color-indigo-mid)",
              color: "var(--color-indigo-bright)",
            }}
          >
            SOC
          </span>
          {!collapsed && (
            <span
              className="text-[14px] font-semibold tracking-[-0.02em] whitespace-nowrap overflow-hidden"
              style={{ color: "var(--color-text-primary)" }}
            >
              UEBA SOC Dashboard
            </span>
          )}
        </div>

        {/* ── Nav items ── */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          <ul ref={navItemsRef} className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleNavClick}
                    className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 group"
                    style={{
                      background: active
                        ? "var(--color-indigo-dim)"
                        : "transparent",
                      color: active
                        ? "var(--color-indigo-bright)"
                        : "var(--color-text-muted)",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        gsap.to(e.currentTarget, {
                          background: "var(--color-elevated)",
                          color: "var(--color-text-secondary)",
                          duration: 0.18,
                        });
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        gsap.to(e.currentTarget, {
                          background: "transparent",
                          color: "var(--color-text-muted)",
                          duration: 0.2,
                        });
                      }
                    }}
                  >
                    {active && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-5 rounded-r-full"
                        style={{ background: "var(--color-indigo)" }}
                      />
                    )}

                    <span className="shrink-0">{item.icon}</span>

                    {!collapsed && (
                      <span className="text-[13.5px] font-medium whitespace-nowrap">
                        {item.label}
                      </span>
                    )}

                    {item.badge && !collapsed && (
                      <span
                        className="ml-auto flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-semibold"
                        style={{
                          background: "var(--color-crimson-dim)",
                          color: "var(--color-crimson-bright)",
                          border: "1px solid var(--color-crimson-mid)",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          className="py-3 px-2 shrink-0"
          style={{ borderTop: "1px solid var(--color-border-subtle)" }}
        >
          {!isMobile && (
            <button
              onClick={toggleCollapse}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg mt-0.5"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-text-muted)",
              }}
              onMouseEnter={(e) =>
                gsap.to(e.currentTarget, {
                  background: "var(--color-elevated)",
                  color: "var(--color-text-secondary)",
                  duration: 0.18,
                })
              }
              onMouseLeave={(e) =>
                gsap.to(e.currentTarget, {
                  background: "transparent",
                  color: "var(--color-text-muted)",
                  duration: 0.2,
                })
              }
            >
              <span className="shrink-0">
                <ArrowLeft className="w-4 h-4" />
              </span>
              {!collapsed && (
                <span className="text-[13.5px] font-medium">Collapse</span>
              )}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
