"use client";

import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(220);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 768) setSidebarWidth(0); /* mobile: no space reserved */
      else if (w < 1024) setSidebarWidth(64); /* tablet: icon-only */
      else setSidebarWidth(sidebarCollapsed ? 64 : 220);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [sidebarCollapsed]);

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "var(--color-base)" }}
    >
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        className="flex flex-col flex-1 min-w-0 transition-[margin] duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <Topbar
          onMobileMenuOpen={() => setMobileOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
        />

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
