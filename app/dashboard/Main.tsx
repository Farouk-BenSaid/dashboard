"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";
import { RISK_BARS, SEVERITY_DATA, STATS } from "@/data";

function barColor(score: number) {
  if (score >= 75) return "var(--color-crimson)";
  if (score >= 45) return "var(--color-amber)";
  return "var(--color-emerald)";
}

function buildDonutPaths(
  data: typeof SEVERITY_DATA,
  cx: number,
  cy: number,
  r: number,
  thickness: number,
) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const gap = 0.028;
  let angle = -Math.PI / 2;
  return data.map((seg) => {
    const slice = (seg.count / total) * Math.PI * 2 - gap;
    const startAngle = angle + gap / 2;
    const endAngle = startAngle + slice;
    angle += (seg.count / total) * Math.PI * 2;
    const x1 = cx + r * Math.cos(startAngle),
      y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle),
      y2 = cy + r * Math.sin(endAngle);
    const ri = r - thickness;
    const x3 = cx + ri * Math.cos(endAngle),
      y3 = cy + ri * Math.sin(endAngle);
    const x4 = cx + ri * Math.cos(startAngle),
      y4 = cy + ri * Math.sin(startAngle);
    const largeArc = slice > Math.PI ? 1 : 0;
    const midAngle = startAngle + slice / 2;
    return {
      ...seg,
      path: `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${ri} ${ri} 0 ${largeArc} 0 ${x4} ${y4} Z`,
      midAngle,
      midX: cx + (r - thickness / 2) * Math.cos(midAngle),
      midY: cy + (r - thickness / 2) * Math.sin(midAngle),
      pct: Math.round((seg.count / total) * 100),
    };
  });
}

function SeverityDonut() {
  const svgRef = useRef<SVGSVGElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [hovered, setHovered] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const total = SEVERITY_DATA.reduce((s, d) => s + d.count, 0);

  const SIZE = 220,
    CX = 110,
    CY = 110,
    R = 90,
    THICKNESS = 42;
  const segments = buildDonutPaths(SEVERITY_DATA, CX, CY, R, THICKNESS);

  useEffect(() => {
    if (!svgRef.current || !cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.75 },
    );
    gsap.fromTo(
      svgRef.current.querySelectorAll(".donut-seg"),
      { opacity: 0, scale: 0.72, transformOrigin: `${CX}px ${CY}px` },
      {
        opacity: 1,
        scale: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: "back.out(1.5)",
        delay: 0.95,
      },
    );
  }, []);

  useEffect(() => {
    SEVERITY_DATA.forEach((seg) => {
      const el = panelRefs.current[seg.label];
      if (!el) return;
      if (expanded === seg.label) {
        gsap.to(el, {
          maxHeight: 300,
          opacity: 1,
          duration: 0.4,
          ease: "power3.out",
        });
        const chips = el.querySelectorAll(".session-chip");
        gsap.fromTo(
          chips,
          { y: 8, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.3,
            stagger: 0.055,
            ease: "back.out(1.8)",
            delay: 0.1,
          },
        );
      } else {
        gsap.to(el, {
          maxHeight: 0,
          opacity: 0,
          duration: 0.32,
          ease: "power2.in",
        });
      }
    });
  }, [expanded]);

  const activeCount = hovered
    ? (SEVERITY_DATA.find((d) => d.label === hovered)?.count ?? total)
    : total;
  const activeColor = hovered
    ? (SEVERITY_DATA.find((d) => d.label === hovered)?.color ??
      "var(--color-text-primary)")
    : "var(--color-text-primary)";

  const handleRowClick = (label: string) => {
    setExpanded((prev) => (prev === label ? null : label));
  };

  return (
    <div
      ref={cardRef}
      className="rounded-2xl p-5 flex flex-col sm:flex-row gap-6 items-start sm:items-center"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border-subtle)",
      }}
    >
      <div className="flex flex-col items-start gap-3 shrink-0 w-full sm:w-auto">
        <div>
          <h2
            className="text-[13.5px] font-semibold tracking-[-0.01em]"
            style={{ color: "var(--color-text-primary)" }}
          >
            Severity Distribution
          </h2>
          <p
            className="text-[11.5px] mt-0.5"
            style={{ color: "var(--color-text-muted)" }}
          >
            Across all 15 analyzed sessions
          </p>
        </div>

        <div
          className="self-center sm:self-start relative"
          style={{ width: SIZE, height: SIZE }}
        >
          <svg
            ref={svgRef}
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            style={{ overflow: "visible" }}
          >
            <defs>
              {segments.map((seg) => (
                <filter
                  key={`gf-${seg.label}`}
                  id={`gf-${seg.label}`}
                  x="-40%"
                  y="-40%"
                  width="180%"
                  height="180%"
                >
                  <feGaussianBlur stdDeviation="5" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
            </defs>

            {segments.map((seg) => {
              const isH = hovered === seg.label;
              const isE = expanded === seg.label;
              return (
                <path
                  suppressHydrationWarning={true}
                  key={seg.label}
                  className="donut-seg"
                  d={seg.path}
                  fill={seg.color}
                  opacity={hovered && !isH ? 0.3 : isE ? 1 : 0.9}
                  filter={isH || isE ? `url(#gf-${seg.label})` : undefined}
                  style={{
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                    transform:
                      isH || isE
                        ? `translate(${Math.cos(seg.midAngle) * 5}px,${Math.sin(seg.midAngle) * 5}px)`
                        : "none",
                  }}
                  onMouseEnter={() => setHovered(seg.label)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleRowClick(seg.label)}
                />
              );
            })}

            <text
              x={CX}
              y={CY - 9}
              textAnchor="middle"
              fontSize="28"
              fontWeight="650"
              fill={activeColor}
              style={{ transition: "fill 0.2s" }}
            >
              {activeCount}
            </text>
            <text
              x={CX}
              y={CY + 13}
              textAnchor="middle"
              fontSize="10.5"
              fill="var(--color-text-muted)"
            >
              {hovered ?? "sessions"}
            </text>
          </svg>
        </div>
      </div>

      <div
        className="hidden sm:block self-stretch w-px"
        style={{ background: "var(--color-border-subtle)" }}
      />
      <div
        className="block sm:hidden w-full h-px"
        style={{ background: "var(--color-border-subtle)" }}
      />

      <div className="flex flex-col gap-1 w-full">
        {segments.map((seg) => {
          const isH = hovered === seg.label;
          const isE = expanded === seg.label;
          return (
            <div key={seg.label} className="flex flex-col">
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-2.5 cursor-pointer select-none"
                style={{
                  background:
                    isH || isE ? "var(--color-elevated)" : "transparent",
                  border: isE
                    ? `1px solid ${seg.color}55`
                    : isH
                      ? `1px solid ${seg.color}33`
                      : "1px solid transparent",
                  borderBottomLeftRadius: isE ? 0 : undefined,
                  borderBottomRightRadius: isE ? 0 : undefined,
                  transition: "background 0.18s, border-color 0.18s",
                }}
                onMouseEnter={() => setHovered(seg.label)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleRowClick(seg.label)}
              >
                <span
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{
                    background: seg.color,
                    boxShadow: isH || isE ? `0 0 10px ${seg.color}` : "none",
                    transition: "box-shadow 0.2s",
                  }}
                />

                <span
                  className="text-[12.5px] font-medium w-16 shrink-0"
                  style={{
                    color:
                      isH || isE
                        ? "var(--color-text-primary)"
                        : "var(--color-text-secondary)",
                  }}
                >
                  {seg.label}
                </span>

                <div
                  className="flex-1 h-1.5 rounded-full overflow-hidden"
                  style={{ background: "var(--color-elevated)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${seg.pct}%`,
                      background: seg.color,
                      opacity: isH || isE ? 1 : 0.65,
                      boxShadow: isH || isE ? `0 0 8px ${seg.color}` : "none",
                      transition:
                        "opacity 0.2s, box-shadow 0.2s, width 0.6s ease",
                    }}
                  />
                </div>

                <span
                  className="text-[12.5px] font-mono font-semibold w-5 text-right shrink-0"
                  style={{ color: seg.color }}
                >
                  {seg.count}
                </span>

                <span
                  className="text-[11px] w-9 text-right shrink-0"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {seg.pct}%
                </span>

                <ChevronDown
                  className="w-3.5 h-3.5 shrink-0 ml-1"
                  style={{
                    color: isE ? seg.color : "var(--color-text-muted)",
                    transform: isE ? "rotate(180deg)" : "rotate(0deg)",
                    transition:
                      "transform 0.3s cubic-bezier(.4,0,.2,1), color 0.2s",
                  }}
                />
              </div>

              <div
                ref={(el) => {
                  panelRefs.current[seg.label] = el;
                }}
                style={{
                  maxHeight: 0,
                  opacity: 0,
                  overflow: "hidden",
                  borderLeft: `2px solid ${seg.color}55`,
                  borderRight: `1px solid ${seg.color}33`,
                  borderBottom: `1px solid ${seg.color}33`,
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                  background: "var(--color-elevated)",
                }}
              >
                <div className="px-4 py-3">
                  <p
                    className="text-[10.5px] font-medium uppercase tracking-wider mb-2.5"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {seg.label} sessions
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {seg.sessions.map((s) => (
                      <div
                        key={s.id}
                        className="session-chip flex items-center justify-between rounded-lg px-3 py-2"
                        style={{
                          background: "var(--color-surface)",
                          border: `1px solid ${seg.color}33`,
                        }}
                      >
                        <span
                          className="text-[12px] font-mono font-semibold"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {s.id}
                        </span>
                        <span
                          className="text-[11px] font-mono font-semibold"
                          style={{ color: seg.color }}
                        >
                          {s.score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div
          className="flex items-center justify-between mt-1 pt-3 text-[11.5px]"
          style={{
            borderTop: "1px solid var(--color-border-subtle)",
            color: "var(--color-text-muted)",
          }}
        >
          <span>Total sessions analyzed</span>
          <span
            className="font-semibold font-mono"
            style={{ color: "var(--color-text-primary)" }}
          >
            {total}
          </span>
        </div>
      </div>
    </div>
  );
}

const Main = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(
        statsRef.current?.querySelectorAll(".stat-card") ?? [],
        { y: 22, opacity: 0, duration: 0.55, stagger: 0.07 },
        0.05,
      );
      tl.from(barsRef.current, { y: 18, opacity: 0, duration: 0.5 }, 0.35);
      const bars = barsRef.current?.querySelectorAll(".risk-bar");
      if (bars)
        gsap.from(bars, {
          scaleY: 0,
          duration: 0.65,
          stagger: 0.035,
          ease: "power3.out",
          transformOrigin: "bottom",
          delay: 0.5,
        });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="p-6 md:p-8 max-w-350 mx-auto space-y-5">
      <div
        ref={statsRef}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
      >
        {STATS.map((s) => {
          const valueColor =
            s.color === "amber"
              ? "var(--color-amber-bright)"
              : s.color === "indigo"
                ? "var(--color-indigo-bright)"
                : s.color === "crimson"
                  ? "var(--color-crimson-bright)"
                  : "var(--color-text-primary)";
          const iconColor =
            s.color === "amber"
              ? "var(--color-amber-bright)"
              : s.color === "indigo"
                ? "var(--color-indigo-bright)"
                : s.color === "crimson"
                  ? "var(--color-crimson-bright)"
                  : "var(--color-text-muted)";

          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="stat-card rounded-2xl px-5 py-4 flex flex-col gap-2"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[10.5px] font-medium tracking-wider uppercase"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {s.label}
                </span>
                <span style={{ color: iconColor }}>
                  <Icon className="w-4 h-4" />
                </span>
              </div>
              <span
                className="text-[28px] font-semibold tracking-[-0.04em] leading-none"
                style={{ color: valueColor }}
              >
                {s.value}
              </span>
              <span
                className="text-[11px]"
                style={{ color: "var(--color-text-muted)" }}
              >
                {s.sub}
              </span>
            </div>
          );
        })}
      </div>

      <div
        ref={barsRef}
        className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4"
      >
        <div
          className="rounded-2xl p-5 pb-4"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-[13.5px] font-semibold tracking-[-0.01em]"
              style={{ color: "var(--color-text-primary)" }}
            >
              Risk Distribution
            </h2>
            <div
              className="flex items-center gap-3 text-[11px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: "var(--color-crimson)" }}
                />
                High ≥75
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: "var(--color-amber)" }}
                />
                Mid ≥45
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: "var(--color-emerald)" }}
                />
                Low
              </span>
            </div>
          </div>
          <div className="flex items-end gap-1.25 h-44 overflow-x-auto pb-2">
            {RISK_BARS.map((bar) => (
              <div
                key={bar.id}
                className="flex flex-col items-center gap-1.5 shrink-0"
                style={{ minWidth: 30 }}
              >
                <span
                  className="text-[9px] font-mono"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {bar.score}
                </span>
                <div
                  className="risk-bar w-full rounded-t-sm"
                  style={{
                    height: `${Math.max(bar.score * 1.4, 4)}px`,
                    background: barColor(bar.score),
                    opacity: 0.9,
                    minWidth: 24,
                    boxShadow:
                      bar.score >= 75
                        ? `0 0 8px ${barColor(bar.score)}55`
                        : "none",
                  }}
                />
                <span
                  className="text-[9px] font-mono"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {bar.id}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <h2
            className="text-[13.5px] font-semibold tracking-[-0.01em]"
            style={{ color: "var(--color-text-primary)" }}
          >
            Correlation Status
          </h2>
          {[
            {
              label: "SIEM + ML",
              sub: "Correlated alerts",
              count: 1,
              ck: "crimson",
              icon: (
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                    stroke="var(--color-crimson-bright)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              ),
            },
            {
              label: "ML Only",
              sub: "Model-only detections",
              count: 6,
              ck: "indigo",
              icon: (
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="var(--color-indigo-bright)"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3"
                    stroke="var(--color-indigo-bright)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              ),
            },
            {
              label: "Clean",
              sub: "No detections",
              count: 8,
              ck: "emerald",
              icon: (
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="var(--color-emerald)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
            },
          ].map((row) => (
            <div
              key={row.label}
              className="rounded-xl px-4 py-3 flex items-center justify-between"
              style={{
                background: "var(--color-elevated)",
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: `var(--color-${row.ck}-dim)`,
                    border: `1px solid var(--color-${row.ck}-mid)`,
                  }}
                >
                  {row.icon}
                </span>
                <div>
                  <p
                    className="text-[12.5px] font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {row.label}
                  </p>
                  <p
                    className="text-[11px]"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {row.sub}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className="text-[15px] font-semibold"
                  style={{
                    color: `var(--color-${row.ck}${row.ck === "emerald" ? "" : "-bright"})`,
                  }}
                >
                  {row.count}
                </p>
                {row.ck !== "emerald" ? (
                  <button
                    className="text-[11px] px-2.5 py-0.5 rounded-md mt-0.5"
                    style={{
                      background: `var(--color-${row.ck}-dim)`,
                      color: `var(--color-${row.ck}-bright)`,
                      border: `1px solid var(--color-${row.ck}-mid)`,
                      cursor: "pointer",
                    }}
                  >
                    Review
                  </button>
                ) : (
                  <span
                    className="text-[11px] px-2.5 py-0.5 rounded-md mt-0.5 inline-block"
                    style={{
                      background: "var(--color-emerald-dim)",
                      color: "var(--color-emerald)",
                      border: "1px solid var(--color-emerald-mid)",
                    }}
                  >
                    Clear
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <SeverityDonut />
    </div>
  );
};

export default Main;
