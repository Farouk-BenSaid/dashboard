"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { STATS_USERS, USERS } from "@/data";
import { ArrowRightIcon } from "lucide-react";

function riskMeta(score: number) {
  if (score >= 75)
    return {
      bg: "var(--color-crimson-dim)",
      border: "var(--color-crimson-mid)",
      text: "var(--color-crimson-bright)",
      bar: "var(--color-crimson)",
    };
  if (score >= 45)
    return {
      bg: "var(--color-amber-dim)",
      border: "var(--color-amber-mid)",
      text: "var(--color-amber-bright)",
      bar: "var(--color-amber)",
    };
  if (score >= 15)
    return {
      bg: "var(--color-indigo-dim)",
      border: "var(--color-indigo-mid)",
      text: "var(--color-indigo-bright)",
      bar: "var(--color-indigo)",
    };
  return {
    bg: "var(--color-emerald-dim)",
    border: "var(--color-emerald-mid)",
    text: "var(--color-emerald)",
    bar: "var(--color-emerald)",
  };
}

function statusMeta(s: string) {
  if (s === "active") return { dot: "#22c55e", text: "Active" };
  if (s === "idle") return { dot: "#f59e0b", text: "Idle" };
  return { dot: "#6b7280", text: "Offline" };
}

function alertMeta(a: string) {
  if (a === "SIEM+ML")
    return {
      bg: "var(--color-crimson-dim)",
      border: "var(--color-crimson-mid)",
      text: "var(--color-crimson-bright)",
    };
  if (a === "SIEM")
    return {
      bg: "var(--color-amber-dim)",
      border: "var(--color-amber-mid)",
      text: "var(--color-amber-bright)",
    };
  if (a === "ML ONLY")
    return {
      bg: "var(--color-indigo-dim)",
      border: "var(--color-indigo-mid)",
      text: "var(--color-indigo-bright)",
    };
  return {
    bg: "var(--color-emerald-dim)",
    border: "var(--color-emerald-mid)",
    text: "var(--color-emerald)",
  };
}

function trendIcon(t: string) {
  if (t === "up") return { icon: "↑", color: "var(--color-crimson-bright)" };
  if (t === "down") return { icon: "↓", color: "var(--color-emerald)" };
  return { icon: "→", color: "var(--color-text-muted)" };
}

function fmtRelative(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const W = 72,
    H = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / (max - min || 1)) * H;
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");
  const area = `${pts[0]} ${pts.join(" ")} ${W},${H} 0,${H} Z`;

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient
          id={`sg-${color.replace(/[^a-z0-9]/gi, "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <polygon
        points={area}
        fill={`url(#sg-${color.replace(/[^a-z0-9]/gi, "")})`}
      />
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last dot */}
      <circle
        cx={W}
        cy={H - ((data[data.length - 1] - min) / (max - min || 1)) * H}
        r="2.5"
        fill={color}
      />
    </svg>
  );
}

function RiskBar({ score, delay }: { score: number; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const m = riskMeta(score);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { width: "0%" },
      { width: `${score}%`, duration: 0.9, ease: "power3.out", delay },
    );
  }, [score, delay]);

  return (
    <div
      className="h-1 rounded-full overflow-hidden w-full"
      style={{ background: "var(--color-elevated)" }}
    >
      <div
        ref={ref}
        className="h-full rounded-full"
        style={{
          background: m.bar,
          boxShadow: score >= 75 ? `0 0 6px ${m.bar}88` : "none",
        }}
      />
    </div>
  );
}

function UserCard({ user, index }: { user: (typeof USERS)[0]; index: number }) {
  const rm = riskMeta(user.riskScore);
  const sm = statusMeta(user.status);
  const am = alertMeta(user.topAlert);
  const tr = trendIcon(user.riskTrend);

  return (
    <Link
      href={`/dashboard/users/${user.id}`}
      className="user-card block rounded-2xl p-5 group"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border-subtle)",
        textDecoration: "none",
        transition: "border-color 0.2s, background 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${rm.bar}55`;
        e.currentTarget.style.background = `${rm.bar}06`;
        gsap.to(e.currentTarget, { y: -2, duration: 0.2, ease: "power2.out" });
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border-subtle)";
        e.currentTarget.style.background = "var(--color-surface)";
        gsap.to(e.currentTarget, { y: 0, duration: 0.22, ease: "power2.out" });
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-bold"
              style={{
                background: user.avatarColor + "22",
                border: `1px solid ${user.avatarColor}44`,
                color: user.avatarColor,
              }}
            >
              {user.avatar}
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
              style={{
                background: sm.dot,
                borderColor: "var(--color-surface)",
              }}
            />
          </div>
          <div>
            <p
              className="text-[13px] font-semibold leading-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              {user.displayName}
            </p>
            <p
              className="text-[11px] mt-0.5"
              style={{ color: "var(--color-text-muted)" }}
            >
              {user.role}
            </p>
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0"
          style={{
            background: am.bg,
            border: `1px solid ${am.border}`,
            color: am.text,
          }}
        >
          {user.topAlert}
        </span>
      </div>

      <div className="flex items-end justify-between gap-3 mb-3">
        <div>
          <p
            className="text-[10px] font-medium tracking-wider uppercase mb-1"
            style={{ color: "var(--color-text-muted)" }}
          >
            Risk Score
          </p>
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-[28px] font-bold tracking-tight leading-none"
              style={{ color: rm.text }}
            >
              {user.riskScore}
            </span>
            <span
              className="text-[12px] font-semibold"
              style={{ color: tr.color }}
            >
              {tr.icon}
            </span>
          </div>
        </div>
        <Sparkline data={user.weeklyRisk} color={rm.bar} />
      </div>

      <RiskBar score={user.riskScore} delay={0.2 + index * 0.06} />

      <div
        className="flex items-center gap-4 mt-4 pt-4"
        style={{ borderTop: "1px solid var(--color-border-subtle)" }}
      >
        <div className="flex flex-col">
          <span
            className="text-[10px] tracking-wider uppercase"
            style={{ color: "var(--color-text-muted)" }}
          >
            Sessions
          </span>
          <span
            className="text-[13px] font-semibold font-mono"
            style={{ color: "var(--color-text-primary)" }}
          >
            {user.sessions}
          </span>
        </div>
        <div className="flex flex-col">
          <span
            className="text-[10px] tracking-wider uppercase"
            style={{ color: "var(--color-text-muted)" }}
          >
            Flagged
          </span>
          <span
            className="text-[13px] font-semibold font-mono"
            style={{
              color:
                user.flagged > 0
                  ? "var(--color-amber-bright)"
                  : "var(--color-text-primary)",
            }}
          >
            {user.flagged}
          </span>
        </div>
        <div className="flex flex-col flex-1">
          <span
            className="text-[10px] tracking-wider uppercase"
            style={{ color: "var(--color-text-muted)" }}
          >
            Last Active
          </span>
          <span
            className="text-[11.5px] font-mono"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {fmtRelative(user.lastActive)}
          </span>
        </div>
        <svg
          width="14"
          height="14"
          fill="none"
          viewBox="0 0 24 24"
          style={{
            color: "var(--color-text-muted)",
            transition: "color 0.15s, transform 0.15s",
          }}
          className="group-hover:text-indigo-400 shrink-0"
        >
          <path
            d="M5 12h14M12 5l7 7-7 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
}

function UserRow({ user, index }: { user: (typeof USERS)[0]; index: number }) {
  const rm = riskMeta(user.riskScore);
  const sm = statusMeta(user.status);
  const am = alertMeta(user.topAlert);
  const tr = trendIcon(user.riskTrend);

  return (
    <tr
      className="table-row group"
      style={{
        borderLeft:
          user.riskScore >= 75
            ? "2px solid var(--color-crimson)"
            : "2px solid transparent",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--color-elevated)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background =
          index % 2 === 0 ? "transparent" : "rgba(255,255,255,0.012)")
      }
    >
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold"
              style={{
                background: user.avatarColor + "22",
                border: `1px solid ${user.avatarColor}44`,
                color: user.avatarColor,
              }}
            >
              {user.avatar}
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-[1.5px]"
              style={{
                background: sm.dot,
                borderColor: "var(--color-surface)",
              }}
            />
          </div>
          <div>
            <p
              className="text-[13px] font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              {user.displayName}
            </p>
            <p
              className="text-[10.5px] font-mono"
              style={{ color: "var(--color-text-muted)" }}
            >
              {user.id}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-3.5">
        <p
          className="text-[12px]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {user.department}
        </p>
        <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
          {user.role}
        </p>
      </td>

      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span
            className="risk-pill inline-flex items-center px-2.5 py-1 rounded-lg text-[12px] font-semibold font-mono"
            style={{
              background: rm.bg,
              border: `1px solid ${rm.border}`,
              color: rm.text,
            }}
          >
            {user.riskScore}
          </span>
          <span
            className="text-[11px] font-semibold"
            style={{ color: tr.color }}
          >
            {tr.icon}
          </span>
        </div>
      </td>

      <td className="px-5 py-3.5">
        <Sparkline data={user.weeklyRisk} color={rm.bar} />
      </td>

      <td className="px-5 py-3.5">
        <p
          className="text-[13px] font-mono font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          {user.sessions}
        </p>
        <p
          className="text-[11px]"
          style={{
            color:
              user.flagged > 0
                ? "var(--color-amber-bright)"
                : "var(--color-text-muted)",
          }}
        >
          {user.flagged} flagged
        </p>
      </td>

      <td className="px-5 py-3.5">
        <span
          className="inline-flex px-2 py-0.5 rounded-[5px] text-[10.5px] font-medium"
          style={{
            background: am.bg,
            border: `1px solid ${am.border}`,
            color: am.text,
          }}
        >
          {user.topAlert}
        </span>
      </td>

      <td className="px-5 py-3.5">
        <p
          className="text-[12px] font-mono"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {fmtRelative(user.lastActive)}
        </p>
      </td>

      <td className="px-5 py-3.5">
        <Link
          href={`/dashboard/users/${user.id}`}
          className="inline-flex items-center gap-1 text-[12px] font-medium px-3 py-1.5 rounded-lg"
          style={{
            background: "var(--color-indigo-dim)",
            border: "1px solid var(--color-indigo-mid)",
            color: "var(--color-indigo-bright)",
            textDecoration: "none",
          }}
          onMouseEnter={(e) =>
            gsap.to(e.currentTarget, { x: 2, duration: 0.15 })
          }
          onMouseLeave={(e) =>
            gsap.to(e.currentTarget, { x: 0, duration: 0.18 })
          }
        >
          Profile
          <ArrowRightIcon className="w-3 h-3" />
        </Link>
      </td>
    </tr>
  );
}

const Main = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [view, setView] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "high" | "flagged" | "clean">(
    "all",
  );
  const [sort, setSort] = useState<"risk" | "name" | "sessions">("risk");

  const filtered = USERS.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      u.displayName.toLowerCase().includes(q) ||
      u.id.includes(q) ||
      u.department.toLowerCase().includes(q);
    const matchFilter =
      filter === "all"
        ? true
        : filter === "high"
          ? u.riskScore >= 75
          : filter === "flagged"
            ? u.flagged > 0
            : filter === "clean"
              ? u.flagged === 0
              : true;
    return matchSearch && matchFilter;
  }).sort((a, b) =>
    sort === "risk"
      ? b.riskScore - a.riskScore
      : sort === "name"
        ? a.displayName.localeCompare(b.displayName)
        : sort === "sessions"
          ? b.sessions - a.sessions
          : 0,
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(
        statsRef.current?.querySelectorAll(".stat-card") ?? [],
        { y: 20, opacity: 0, duration: 0.5, stagger: 0.07 },
        0.05,
      );
      tl.from(".toolbar-row", { y: 14, opacity: 0, duration: 0.4 }, 0.35);
      tl.from(
        contentRef.current?.querySelectorAll(".user-card, .table-row") ?? [],
        { y: 20, opacity: 0, duration: 0.45, stagger: 0.06 },
        0.45,
      );
      tl.from(
        contentRef.current?.querySelectorAll(".risk-pill") ?? [],
        {
          scale: 0.5,
          opacity: 0,
          duration: 0.35,
          stagger: 0.04,
          ease: "back.out(2)",
        },
        0.6,
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  function switchView(v: "grid" | "table") {
    setView(v);
    setTimeout(() => {
      if (!contentRef.current) return;
      const els = contentRef.current.querySelectorAll(".user-card, .table-row");
      gsap.fromTo(
        els,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, stagger: 0.05, ease: "power2.out" },
      );
    }, 20);
  }

  return (
    <div ref={pageRef} className="p-6 md:p-8 max-w-350 mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-1">
        <div>
          <p
            className="text-[11px] font-medium tracking-widest uppercase mb-1"
            style={{ color: "var(--color-text-muted)" }}
          >
            Identity Analytics
          </p>
          <h1
            className="text-[26px] font-semibold tracking-[-0.03em] leading-none"
            style={{ color: "var(--color-text-primary)" }}
          >
            Users
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] px-3 py-1.5 rounded-lg"
            style={{
              background: "var(--color-elevated)",
              color: "var(--color-text-muted)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            Last sync: today 21:18
          </span>
          <button
            className="px-4 py-2 rounded-lg text-[12.5px] font-semibold"
            style={{
              background: "var(--color-indigo)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Export
          </button>
        </div>
      </div>

      <div
        ref={statsRef}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
      >
        {STATS_USERS.map((s) => {
          const valueColor =
            s.color === "amber"
              ? "var(--color-amber-bright)"
              : s.color === "indigo"
                ? "var(--color-indigo-bright)"
                : s.color === "crimson"
                  ? "var(--color-crimson-bright)"
                  : s.color === "emerald"
                    ? "var(--color-emerald)"
                    : "var(--color-text-primary)";
          return (
            <div
              key={s.label}
              className="stat-card rounded-2xl px-5 py-4 flex flex-col gap-2"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              <span
                className="text-[10.5px] font-medium tracking-wider uppercase"
                style={{ color: "var(--color-text-muted)" }}
              >
                {s.label}
              </span>
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

      <div className="toolbar-row flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <svg
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--color-text-muted)" }}
            >
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M21 21l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users…"
              className="pl-8 pr-3 py-2 rounded-lg text-[12.5px] outline-none w-48"
              style={{
                background: "var(--color-elevated)",
                border: "1px solid var(--color-border-subtle)",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-sans)",
              }}
            />
          </div>

          <div
            className="flex items-center gap-1 rounded-lg p-1"
            style={{
              background: "var(--color-elevated)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            {(
              [
                ["all", "All"],
                ["high", "High Risk"],
                ["flagged", "Flagged"],
                ["clean", "Clean"],
              ] as [typeof filter, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="px-3 py-1 rounded-md text-[11.5px] font-medium"
                style={{
                  background:
                    filter === key ? "var(--color-surface)" : "transparent",
                  color:
                    filter === key
                      ? "var(--color-text-primary)"
                      : "var(--color-text-muted)",
                  border:
                    filter === key
                      ? "1px solid var(--color-border-dim)"
                      : "1px solid transparent",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="px-3 py-2 rounded-lg text-[12px] outline-none"
            style={{
              background: "var(--color-elevated)",
              border: "1px solid var(--color-border-subtle)",
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-sans)",
              cursor: "pointer",
            }}
          >
            <option value="risk">Sort: Risk</option>
            <option value="name">Sort: Name</option>
            <option value="sessions">Sort: Sessions</option>
          </select>

          <div
            className="flex items-center rounded-lg overflow-hidden"
            style={{ border: "1px solid var(--color-border-subtle)" }}
          >
            {(["grid", "table"] as const).map((v) => (
              <button
                key={v}
                onClick={() => switchView(v)}
                className="px-3 py-2 flex items-center"
                style={{
                  background:
                    view === v ? "var(--color-elevated)" : "transparent",
                  cursor: "pointer",
                  border: "none",
                  transition: "background 0.15s",
                }}
              >
                {v === "grid" ? (
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <rect
                      x="3"
                      y="3"
                      width="7"
                      height="7"
                      rx="1.5"
                      stroke={
                        view === "grid"
                          ? "var(--color-text-primary)"
                          : "var(--color-text-muted)"
                      }
                      strokeWidth="1.6"
                    />
                    <rect
                      x="14"
                      y="3"
                      width="7"
                      height="7"
                      rx="1.5"
                      stroke={
                        view === "grid"
                          ? "var(--color-text-primary)"
                          : "var(--color-text-muted)"
                      }
                      strokeWidth="1.6"
                    />
                    <rect
                      x="3"
                      y="14"
                      width="7"
                      height="7"
                      rx="1.5"
                      stroke={
                        view === "grid"
                          ? "var(--color-text-primary)"
                          : "var(--color-text-muted)"
                      }
                      strokeWidth="1.6"
                    />
                    <rect
                      x="14"
                      y="14"
                      width="7"
                      height="7"
                      rx="1.5"
                      stroke={
                        view === "grid"
                          ? "var(--color-text-primary)"
                          : "var(--color-text-muted)"
                      }
                      strokeWidth="1.6"
                    />
                  </svg>
                ) : (
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <line
                      x1="3"
                      y1="6"
                      x2="21"
                      y2="6"
                      stroke={
                        view === "table"
                          ? "var(--color-text-primary)"
                          : "var(--color-text-muted)"
                      }
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <line
                      x1="3"
                      y1="12"
                      x2="21"
                      y2="12"
                      stroke={
                        view === "table"
                          ? "var(--color-text-primary)"
                          : "var(--color-text-muted)"
                      }
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <line
                      x1="3"
                      y1="18"
                      x2="21"
                      y2="18"
                      stroke={
                        view === "table"
                          ? "var(--color-text-primary)"
                          : "var(--color-text-muted)"
                      }
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div ref={contentRef}>
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-2xl"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            <svg
              width="40"
              height="40"
              fill="none"
              viewBox="0 0 24 24"
              style={{ color: "var(--color-text-muted)", marginBottom: 12 }}
            >
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M21 21l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <p
              className="text-[13px] font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              No users found
            </p>
            <p
              className="text-[11.5px] mt-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              Try adjusting your search or filter
            </p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((u, i) => (
              <UserCard key={u.id} user={u} index={i} />
            ))}
          </div>
        ) : (
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
            >
              <div>
                <h2
                  className="text-[13.5px] font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  All Users
                </h2>
                <p
                  className="text-[11.5px] mt-0.5"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {filtered.length} users
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table
                className="w-full"
                style={{ borderCollapse: "collapse", minWidth: 820 }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid var(--color-border-subtle)",
                    }}
                  >
                    {[
                      "User",
                      "Department",
                      "Risk",
                      "7d Trend",
                      "Sessions",
                      "Top Alert",
                      "Last Active",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-[10.5px] font-medium tracking-[0.07em] uppercase"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <UserRow key={u.id} user={u} index={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div
        className="rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-3"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-subtle)",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: "var(--color-elevated)",
              border: "1px solid var(--color-border-dim)",
            }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path
                d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                stroke="var(--color-text-muted)"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <circle
                cx="9"
                cy="7"
                r="4"
                stroke="var(--color-text-muted)"
                strokeWidth="1.6"
              />
              <path
                d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                stroke="var(--color-text-muted)"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <div>
            <p
              className="text-[13px] font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              User Monitoring
            </p>
            <p
              className="text-[11.5px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              {filtered.length} of {USERS.length} users shown · Pipeline synced
              today 21:18
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {[
            {
              label: "High Risk",
              val: USERS.filter((u) => u.riskScore >= 75).length,
              color: "var(--color-crimson-bright)",
            },
            {
              label: "Flagged",
              val: USERS.filter((u) => u.flagged > 0).length,
              color: "var(--color-amber-bright)",
            },
            {
              label: "Clean",
              val: USERS.filter((u) => u.flagged === 0).length,
              color: "var(--color-emerald)",
            },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <span
                className="text-[16px] font-bold font-mono"
                style={{ color: item.color }}
              >
                {item.val}
              </span>
              <span
                className="text-[10px]"
                style={{ color: "var(--color-text-muted)" }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;
