"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { LogOut, Play } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/sessions": "Sessions",
  "/dashboard/alerts": "Alerts",
  "/dashboard/users": "Users",
  "/dashboard/settings": "Settings",
  "/dashboard/investigation": "Investigation",
};

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const barRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(barRef.current, {
        y: -24,
        opacity: 0,
        duration: 0.55,
        ease: "expo.out",
        delay: 0.15,
      });
    });

    gsap.to(btnRef.current, {
      scale: 1.014,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!titleRef.current) return;
    gsap.from(titleRef.current, {
      y: 8,
      opacity: 0,
      duration: 0.35,
      ease: "power3.out",
    });
  }, [pathname]);

  function handlePipeline() {
    gsap
      .timeline()
      .to(btnRef.current, { scale: 0.94, duration: 0.1, ease: "power2.in" })
      .to(btnRef.current, {
        scale: 1,
        duration: 0.45,
        ease: "elastic.out(1,0.5)",
      });
  }

  function handleLogout() {
    gsap.to(barRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.3,
      ease: "power3.in",
      onComplete: () => router.push("/"),
    });
  }

  const now = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header
      ref={barRef}
      className="sticky top-0 z-20 flex items-center gap-4 px-6 h-14.5 shrink-0"
      style={{
        background: "rgba(7,7,15,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--color-border-subtle)",
      }}
    >
      <h1
        ref={titleRef}
        className="text-[16px] font-semibold tracking-[-0.02em] mr-auto"
        style={{ color: "var(--color-text-primary)" }}
      >
        {title}
      </h1>

      <span
        className="hidden md:block text-[11.5px] font-mono"
        style={{ color: "var(--color-text-muted)" }}
        suppressHydrationWarning={true}
      >
        {now}
      </span>

      <button
        ref={btnRef}
        onClick={handlePipeline}
        className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-[7px] text-[13px] font-medium text-white"
        style={{
          background: "var(--color-indigo)",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
        }}
        onMouseEnter={(e) =>
          gsap.to(e.currentTarget, {
            background: "var(--color-indigo-bright)",
            duration: 0.2,
          })
        }
        onMouseLeave={(e) =>
          gsap.to(e.currentTarget, {
            background: "var(--color-indigo)",
            duration: 0.25,
          })
        }
      >
        <Play className="w-3.5 h-3.5" />
        Run Pipeline
      </button>

      <button
        onClick={handleLogout}
        className="flex items-center justify-center w-8 h-8 rounded-[7px]"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--color-text-muted)",
        }}
        aria-label="Logout"
        onMouseEnter={(e) =>
          gsap.to(e.currentTarget, {
            background: "var(--color-crimson-dim)",
            color: "var(--color-crimson-bright)",
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
        <LogOut className="w-4 h-4" />
      </button>
    </header>
  );
}
