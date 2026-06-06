"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { SearchIcon, X } from "lucide-react";
import { Session, SESSIONS, Status, STATUS_CONFIG } from "@/data";

type Tab = "all" | Status;

const TAG_CONFIG: Record<string, { bg: string; border: string; text: string }> =
  {
    "SIEM+ML": {
      bg: "var(--color-indigo-dim)",
      border: "var(--color-indigo-mid)",
      text: "var(--color-indigo-bright)",
    },
    GRU: { bg: "#1e1040", border: "#4c3899", text: "#b39dff" },
    HDBSCAN: { bg: "#012a24", border: "#0a6655", text: "#34d9b9" },
    "ML ONLY": {
      bg: "var(--color-overlay)",
      border: "var(--color-border-dim)",
      text: "var(--color-text-muted)",
    },
  };

function riskPill(score: number) {
  if (score >= 75)
    return {
      bg: "var(--color-crimson-dim)",
      border: "var(--color-crimson-mid)",
      text: "var(--color-crimson-bright)",
    };
  if (score >= 45)
    return {
      bg: "var(--color-amber-dim)",
      border: "var(--color-amber-mid)",
      text: "var(--color-amber-bright)",
    };
  return {
    bg: "var(--color-emerald-dim)",
    border: "var(--color-emerald-mid)",
    text: "var(--color-emerald)",
  };
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TagChip({ tag }: { tag: string }) {
  const cfg = TAG_CONFIG[tag] ?? TAG_CONFIG["ML ONLY"];
  return (
    <span
      className="inline-flex px-2 py-0.5 rounded-[5px] text-[10.5px] font-medium"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.text,
      }}
    >
      {tag}
    </span>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="status-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.text,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: cfg.dot }}
      />
      {cfg.label}
    </span>
  );
}

function Drawer({
  session,
  onClose,
  onStatusChange,
}: {
  session: Session;
  onClose: () => void;
  onStatusChange: (id: number, status: Status) => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rp = riskPill(session.risk);

  useEffect(() => {
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25 },
    );
    gsap.fromTo(
      drawerRef.current,
      { x: 440 },
      { x: 0, duration: 0.42, ease: "expo.out" },
    );
    setTimeout(() => {
      const items = contentRef.current?.querySelectorAll(".d-item");
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { y: 14, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.055,
            ease: "power3.out",
          },
        );
      }
    }, 50);
  }, [session.id]);

  function close() {
    gsap.to(drawerRef.current, { x: 440, duration: 0.3, ease: "power3.in" });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.25,
      onComplete: onClose,
    });
  }

  function handleAction(status: Status, btn: HTMLButtonElement) {
    gsap
      .timeline()
      .to(btn, { scale: 0.93, duration: 0.09, ease: "power2.in" })
      .to(btn, { scale: 1, duration: 0.45, ease: "elastic.out(1, 0.5)" });
    onStatusChange(session.id, status);
    setTimeout(close, 320);
  }

  return (
    <>
      <div
        ref={overlayRef}
        onClick={close}
        className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      />
      <aside
        ref={drawerRef}
        className="fixed top-0 right-0 h-full z-50 flex flex-col overflow-hidden"
        style={{
          width: "min(480px, 100vw)",
          background: "var(--color-surface)",
          borderLeft: "1px solid var(--color-border-dim)",
        }}
      >
        <div
          className="flex items-center gap-3 px-6 py-4 shrink-0"
          style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
        >
          <button
            onClick={close}
            className="flex items-center justify-center w-8 h-8 rounded-[7px] shrink-0"
            style={{
              background: "var(--color-elevated)",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-muted)",
            }}
            onMouseEnter={(e) =>
              gsap.to(e.currentTarget, {
                background: "var(--color-overlay)",
                color: "var(--color-text-primary)",
                duration: 0.15,
              })
            }
            onMouseLeave={(e) =>
              gsap.to(e.currentTarget, {
                background: "var(--color-elevated)",
                color: "var(--color-text-muted)",
                duration: 0.18,
              })
            }
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h2
              className="text-[15px] font-semibold tracking-[-0.02em]"
              style={{ color: "var(--color-text-primary)" }}
            >
              Session #{session.id}
            </h2>
            <p
              className="text-[11.5px] font-mono"
              style={{ color: "var(--color-text-muted)" }}
            >
              {session.user} @ {session.host}
            </p>
          </div>
          <StatusBadge status={session.status} />
        </div>

        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
        >
          <div className="d-item grid grid-cols-2 gap-3">
            <div
              className="rounded-[10px] px-4 py-3 flex flex-col gap-1"
              style={{
                background: "var(--color-elevated)",
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              <span
                className="text-[10.5px] font-medium uppercase tracking-[.06em]"
                style={{ color: "var(--color-text-muted)" }}
              >
                Risk Score
              </span>
              <span
                className="text-[26px] font-semibold font-mono tracking-tight leading-none"
                style={{ color: rp.text }}
              >
                {session.risk.toFixed(2)}
              </span>
            </div>
            <div
              className="rounded-[10px] px-4 py-3 flex flex-col gap-2"
              style={{
                background: "var(--color-elevated)",
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              <span
                className="text-[10.5px] font-medium uppercase tracking-[.06em]"
                style={{ color: "var(--color-text-muted)" }}
              >
                Duration
              </span>
              <span
                className="text-[15px] font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {session.duration}
              </span>
              <span
                className="text-[11px]"
                style={{ color: "var(--color-text-muted)" }}
              >
                {session.eventCount} events
              </span>
            </div>
          </div>

          <div className="d-item flex flex-wrap gap-1.5">
            {session.tags.map((t) => (
              <TagChip key={t} tag={t} />
            ))}
          </div>

          <div
            className="d-item rounded-[10px] p-4"
            style={{
              background: "var(--color-elevated)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            <h3
              className="text-[12px] font-semibold uppercase tracking-[.06em] mb-4"
              style={{ color: "var(--color-text-muted)" }}
            >
              Timeline
            </h3>
            <div className="relative pl-5">
              <div
                className="absolute left-1.75 top-0 bottom-0 w-px"
                style={{ background: "var(--color-border-dim)" }}
              />
              {[
                { label: "Session start", val: fmt(session.start) },
                {
                  label: `${session.eventCount} behavior tokens`,
                  val: "observed",
                },
                { label: "Session end", val: fmt(session.end) },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative flex items-start gap-3 mb-4 last:mb-0"
                >
                  <div
                    className="absolute -left-5 mt-1 w-3 h-3 rounded-full shrink-0"
                    style={{
                      background: "var(--color-indigo)",
                      border: "2px solid var(--color-surface)",
                    }}
                  />
                  <div>
                    <p
                      className="text-[12.5px] font-medium"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="text-[11px] font-mono"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {item.val}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="d-item">
            <h3
              className="text-[12px] font-semibold uppercase tracking-[.06em] mb-2.5"
              style={{ color: "var(--color-text-muted)" }}
            >
              Token Sequence
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {session.tokens.map((t, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-[5px] text-[10px] font-mono font-medium"
                  style={{
                    background: t.startsWith("PROC")
                      ? "#1e1040"
                      : t.startsWith("NET")
                        ? "#012a24"
                        : "var(--color-elevated)",
                    border: `1px solid ${t.startsWith("PROC") ? "#4c3899" : t.startsWith("NET") ? "#0a6655" : "var(--color-border-dim)"}`,
                    color: t.startsWith("PROC")
                      ? "#b39dff"
                      : t.startsWith("NET")
                        ? "#34d9b9"
                        : "var(--color-text-muted)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div
            className="d-item rounded-[10px] p-4"
            style={{
              background: "var(--color-elevated)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            <h3
              className="text-[12px] font-semibold uppercase tracking-[.06em] mb-3"
              style={{ color: "var(--color-text-muted)" }}
            >
              ML Scores
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {[
                {
                  label: "GRU Reconstruction Error",
                  val: session.gru.error.toFixed(4),
                  alert: session.gru.error > session.gru.threshold,
                },
                {
                  label: "GRU Threshold",
                  val: session.gru.threshold.toFixed(4),
                  alert: false,
                },
                {
                  label: "HDBSCAN Outlier Score",
                  val: session.hdbscan.score.toFixed(4),
                  alert: session.hdbscan.score > 0.5,
                },
                {
                  label: "GRU Anomaly",
                  val: session.gru.error > session.gru.threshold ? "Yes" : "No",
                  alert: session.gru.error > session.gru.threshold,
                },
              ].map((row) => (
                <div key={row.label} className="flex flex-col gap-0.5">
                  <span
                    className="text-[10.5px]"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {row.label}
                  </span>
                  <span
                    className="text-[13px] font-semibold font-mono"
                    style={{
                      color: row.alert
                        ? "var(--color-crimson-bright)"
                        : "var(--color-text-primary)",
                    }}
                  >
                    {row.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {session.siem && (
            <div
              className="d-item rounded-[10px] p-4"
              style={{
                background: "var(--color-elevated)",
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              <h3
                className="text-[12px] font-semibold uppercase tracking-[.06em] mb-2"
                style={{ color: "var(--color-text-muted)" }}
              >
                SIEM Rule
              </h3>
              <p
                className="text-[13px] font-medium"
                style={{ color: "var(--color-amber-bright)" }}
              >
                {session.siem}
              </p>
            </div>
          )}

          <div
            className="d-item rounded-[10px] p-4"
            style={{
              background: "var(--color-base)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            <h3
              className="text-[12px] font-semibold uppercase tracking-[.06em] mb-2"
              style={{ color: "var(--color-text-muted)" }}
            >
              Final Decision
            </h3>
            <p
              className="text-[12.5px] font-mono leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {session.reason}
            </p>
          </div>

          {session.analystNote && (
            <div
              className="d-item rounded-[10px] p-4"
              style={{
                background: "linear-gradient(135deg, #1a1a35 0%, #0f0f1e 100%)",
                border: "1px solid var(--color-indigo-mid)",
                borderLeft: "3px solid var(--color-indigo)",
              }}
            >
              <h3
                className="text-[12px] font-semibold uppercase tracking-[.06em] mb-2"
                style={{ color: "var(--color-indigo-bright)" }}
              >
                Analyst Note
              </h3>
              <p
                className="text-[12.5px] leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {session.analystNote}
              </p>
            </div>
          )}
        </div>

        <div
          className="flex items-center gap-2.5 px-6 py-4 shrink-0"
          style={{ borderTop: "1px solid var(--color-border-subtle)" }}
        >
          {(["escalated", "reviewed", "dismissed"] as Status[]).map((s) => {
            const cfg = STATUS_CONFIG[s];
            const isCurrent = session.status === s;
            return (
              <button
                key={s}
                disabled={isCurrent}
                onClick={(e) => handleAction(s, e.currentTarget)}
                className="flex-1 py-2 rounded-[7px] text-[12.5px] font-medium transition-opacity"
                style={{
                  background: isCurrent ? cfg.bg : "transparent",
                  border: `1px solid ${isCurrent ? cfg.border : "var(--color-border-dim)"}`,
                  color: isCurrent ? cfg.text : "var(--color-text-muted)",
                  cursor: isCurrent ? "not-allowed" : "pointer",
                  opacity: isCurrent ? 0.7 : 1,
                  fontFamily: "var(--font-sans)",
                }}
                onMouseEnter={(e) =>
                  !isCurrent &&
                  gsap.to(e.currentTarget, {
                    background: cfg.bg,
                    borderColor: cfg.border,
                    color: cfg.text,
                    duration: 0.18,
                  })
                }
                onMouseLeave={(e) =>
                  !isCurrent &&
                  gsap.to(e.currentTarget, {
                    background: "transparent",
                    borderColor: "var(--color-border-dim)",
                    color: "var(--color-text-muted)",
                    duration: 0.2,
                  })
                }
              >
                {cfg.label}
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}

const Main = () => {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [sessions, setSessions] = useState<Session[]>(SESSIONS);
  const [drawerSession, setDrawerSession] = useState<Session | null>(null);

  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const tabIndRef = useRef<HTMLSpanElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(headerRef.current, { y: -20, opacity: 0, duration: 0.5 }, 0);
      tl.from(
        statsRef.current?.querySelectorAll(".stat-box") ?? [],
        {
          scale: 0.85,
          opacity: 0,
          duration: 0.45,
          stagger: 0.07,
          ease: "back.out(1.6)",
        },
        0.15,
      );
      tl.from(tabsRef.current, { y: 10, opacity: 0, duration: 0.4 }, 0.3);
      tl.from(
        gridRef.current?.querySelectorAll(".session-card") ?? [],
        {
          y: 20,
          opacity: 0,
          duration: 0.45,
          stagger: 0.055,
        },
        0.45,
      );
      tl.from(
        ".status-badge",
        {
          scale: 0.5,
          opacity: 0,
          duration: 0.35,
          stagger: 0.04,
          ease: "back.out(2)",
        },
        0.65,
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const filtered = sessions.filter((s) => {
    const matchTab = activeTab === "all" || s.status === activeTab;
    const matchSearch =
      !search ||
      [s.user, s.host, String(s.id)].some((v) =>
        v.toLowerCase().includes(search.toLowerCase()),
      );
    return matchTab && matchSearch;
  });
  function switchTab(tab: Tab) {
    setActiveTab(tab);
    const tabs: Tab[] = ["all", "escalated", "reviewed", "dismissed"];
    const idx = tabs.indexOf(tab);
    gsap.to(tabIndRef.current, {
      x: idx * 100 + "%",
      duration: 0.3,
      ease: "power3.inOut",
    });
    setTimeout(() => {
      const cards = gridRef.current?.querySelectorAll(".session-card");
      if (cards) {
        gsap.from(cards, {
          y: 14,
          opacity: 0,
          duration: 0.35,
          stagger: 0.05,
          ease: "power3.out",
        });
      }
    }, 10);
  }

  const handleStatusChange = useCallback((id: number, status: Status) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s)),
    );
    setDrawerSession((prev) => (prev?.id === id ? { ...prev, status } : prev));
  }, []);

  const counts = {
    all: sessions.length,
    escalated: sessions.filter((s) => s.status === "escalated").length,
    reviewed: sessions.filter((s) => s.status === "reviewed").length,
    dismissed: sessions.filter((s) => s.status === "dismissed").length,
  };

  return (
    <>
      <div ref={pageRef} className="p-6 md:p-8 max-w-350 mx-auto space-y-6">
        <div
          ref={headerRef}
          className="flex flex-col sm:flex-row sm:items-center gap-4"
        >
          <div className="flex-1">
            <h1
              className="text-[22px] font-semibold tracking-[-0.03em] mb-1"
              style={{ color: "var(--color-text-primary)" }}
            >
              Investigation
            </h1>
            <p
              className="text-[13px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              Reviewed, escalated, and dismissed sessions from the analyst
              pipeline.
            </p>
          </div>
          <div
            className="relative flex items-center"
            style={{ width: "min(280px, 100%)" }}
          >
            <span
              className="absolute left-3 pointer-events-none z-10"
              style={{ color: "var(--color-text-muted)" }}
            >
              <SearchIcon className="w-3.5 h-3.5" />
            </span>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search sessions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-lg text-[13px] outline-none"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-dim)",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-sans)",
                transition: "border-color .15s, box-shadow .15s",
              }}
              onFocus={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1.007,
                  duration: 0.2,
                  ease: "power2.out",
                });
                e.currentTarget.style.borderColor = "var(--color-indigo)";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px var(--color-indigo-glow)";
              }}
              onBlur={(e) => {
                gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
                e.currentTarget.style.borderColor = "var(--color-border-dim)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(
            [
              {
                label: "Total",
                key: "all",
                color: "var(--color-text-primary)",
                dim: "var(--color-surface)",
              },
              {
                label: "Escalated",
                key: "escalated",
                color: "var(--color-crimson-bright)",
                dim: "var(--color-crimson-dim)",
              },
              {
                label: "Reviewed",
                key: "reviewed",
                color: "var(--color-emerald)",
                dim: "var(--color-emerald-dim)",
              },
              {
                label: "Dismissed",
                key: "dismissed",
                color: "var(--color-text-muted)",
                dim: "var(--color-elevated)",
              },
            ] as const
          ).map((box) => (
            <div
              key={box.key}
              className="stat-box rounded-xl px-5 py-4 cursor-pointer"
              style={{
                background:
                  activeTab === box.key ? box.dim : "var(--color-surface)",
                border: `1px solid ${activeTab === box.key ? "var(--color-border-dim)" : "var(--color-border-subtle)"}`,
                transition: "background .2s, border-color .2s",
              }}
              onClick={() => switchTab(box.key as Tab)}
              onMouseEnter={(e) =>
                gsap.to(e.currentTarget, { y: -2, duration: 0.18 })
              }
              onMouseLeave={(e) =>
                gsap.to(e.currentTarget, { y: 0, duration: 0.18 })
              }
            >
              <div
                className="text-[11px] font-medium uppercase tracking-[.06em] mb-1.5"
                style={{ color: "var(--color-text-muted)" }}
              >
                {box.label}
              </div>
              <div
                className="text-[28px] font-semibold tracking-tight leading-none"
                style={{ color: box.color }}
              >
                {counts[box.key]}
              </div>
            </div>
          ))}
        </div>

        <div
          ref={tabsRef}
          className="flex items-center gap-1 p-1 rounded-[10px] w-fit"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          {(["all", "escalated", "reviewed", "dismissed"] as Tab[]).map(
            (tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => switchTab(tab)}
                  className="relative px-4 py-1.5 rounded-[7px] text-[13px] font-medium capitalize transition-colors duration-150"
                  style={{
                    background: active
                      ? "var(--color-elevated)"
                      : "transparent",
                    color: active
                      ? "var(--color-text-primary)"
                      : "var(--color-text-muted)",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    boxShadow: active ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
                  }}
                  onMouseEnter={(e) =>
                    !active &&
                    gsap.to(e.currentTarget, {
                      color: "var(--color-text-secondary)",
                      duration: 0.15,
                    })
                  }
                  onMouseLeave={(e) =>
                    !active &&
                    gsap.to(e.currentTarget, {
                      color: "var(--color-text-muted)",
                      duration: 0.18,
                    })
                  }
                >
                  {tab === "all"
                    ? "All"
                    : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span
                    className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                    style={{
                      background: active
                        ? "var(--color-indigo-dim)"
                        : "rgba(255,255,255,0.06)",
                      color: active
                        ? "var(--color-indigo-bright)"
                        : "var(--color-text-muted)",
                    }}
                  >
                    {counts[tab]}
                  </span>
                </button>
              );
            },
          )}
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {filtered.length === 0 ? (
            <div
              className="col-span-3 flex flex-col items-center justify-center py-20 rounded-[14px]"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              <SearchIcon
                className="w-10 h-10 mb-3"
                style={{ color: "var(--color-text-muted)" }}
              />
              <p
                className="text-[14px]"
                style={{ color: "var(--color-text-muted)" }}
              >
                No sessions match your filter.
              </p>
            </div>
          ) : (
            filtered.map((s) => {
              const rp = riskPill(s.risk);
              return (
                <div
                  key={s.id}
                  className="session-card rounded-[14px] p-5 flex flex-col gap-3 cursor-pointer"
                  style={{
                    background: "var(--color-surface)",
                    border:
                      s.status === "escalated"
                        ? "1px solid var(--color-crimson-mid)"
                        : "1px solid var(--color-border-subtle)",
                    borderLeft:
                      s.status === "escalated"
                        ? "3px solid var(--color-crimson)"
                        : s.status === "reviewed"
                          ? "3px solid var(--color-emerald)"
                          : "3px solid var(--color-text-muted)",
                    transition: "border-color .15s",
                  }}
                  onClick={() => setDrawerSession(s)}
                  onMouseEnter={(e) =>
                    gsap.to(e.currentTarget, {
                      y: -3,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                      duration: 0.2,
                    })
                  }
                  onMouseLeave={(e) =>
                    gsap.to(e.currentTarget, {
                      y: 0,
                      boxShadow: "none",
                      duration: 0.2,
                    })
                  }
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="font-mono text-[13px] font-medium"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          #{s.id}
                        </span>
                        <span
                          className="text-[13px] font-semibold"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {s.user}
                        </span>
                      </div>
                      <p
                        className="text-[11px] font-mono"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {s.host}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span
                        className="inline-flex px-2.5 py-1 rounded-md font-mono text-[13px] font-semibold"
                        style={{
                          background: rp.bg,
                          border: `1px solid ${rp.border}`,
                          color: rp.text,
                        }}
                      >
                        {s.risk.toFixed(2)}
                      </span>
                      <StatusBadge status={s.status} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <TagChip key={t} tag={t} />
                    ))}
                  </div>

                  <p
                    className="text-[12px] leading-relaxed line-clamp-2"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {s.reason}
                  </p>

                  <div
                    className="flex items-center justify-between pt-2.5 mt-auto"
                    style={{
                      borderTop: "1px solid var(--color-border-subtle)",
                    }}
                  >
                    <span
                      className="text-[11px]"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {fmt(s.start)} · {s.duration}
                    </span>
                    <span
                      className="text-[12px] font-medium"
                      style={{ color: "var(--color-indigo-bright)" }}
                      onMouseEnter={(e) =>
                        gsap.to(e.currentTarget, { x: 2, duration: 0.15 })
                      }
                      onMouseLeave={(e) =>
                        gsap.to(e.currentTarget, { x: 0, duration: 0.15 })
                      }
                    >
                      View details →
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {drawerSession && (
        <Drawer
          session={drawerSession}
          onClose={() => setDrawerSession(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
};

export default Main;
