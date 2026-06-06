"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import gsap from "gsap";
import { Session, SESSIONS } from "@/data";

// const SESSIONS_DB: Record<number, SessionData> = {
//   15: {
//     id: 15,
//     user: "mehdi",
//     host: "laptop-t2f3cdg1",
//     risk: 100,
//     severity: "critical",
//     correlationStatus: "SIEM_AND_ML_CORRELATED",
//     finalSeverity: "high",
//     sessionStart: "2026-05-15T12:22:32.306000+00:00",
//     sessionEnd: "2026-05-15T12:23:23.597000+00:00",
//     eventCount: 14,
//     durationSeconds: 51.291,
//     behaviorIndicators: [
//       "SIEM Detection",
//       "GRU Sequence Anomaly",
//       "HDBSCAN Outlier",
//     ],
//     tokenSequence: [
//       "PROC_UNCATEGORIZED_USER",
//       "PROC_UNCATEGORIZED_USER",
//       "PROC_UNCATEGORIZED_USER",
//       "PROC_UNCATEGORIZED_USER",
//       "NET_WEB",
//       "NET_WEB",
//       "NET_WEB",
//       "NET_WEB",
//       "NET_WEB",
//       "NET_WEB",
//       "NET_WEB",
//       "NET_WEB",
//       "NET_WEB",
//       "NET_WEB",
//     ],
//     siemInfo: {
//       alertCount: 2,
//       rule: "Enumeration of Privileged Local Groups Membership",
//       riskScore: 47,
//       matchMethod: "nearest_time_user_host",
//     },
//     mlScores: {
//       gruReconstructionError: 2.695,
//       gruThreshold: 0.9671,
//       gruAnomaly: true,
//       hdbscanOutlierScore: 0.8074,
//       hdbscanAnomaly: true,
//     },
//     whyFlagged: [
//       {
//         title: "GRU Sequence Anomaly",
//         color: "amber",
//         desc: "The GRU autoencoder reconstruction error exceeded the learned threshold. This indicates that the session sequence differs from normal behavior learned during training.",
//       },
//       {
//         title: "HDBSCAN Outlier Detection",
//         color: "amber",
//         desc: "The session was identified as an outlier by the HDBSCAN clustering model. This indicates that its statistical features differ from normal session clusters.",
//       },
//       {
//         title: "SIEM Rule Match",
//         color: "amber",
//         desc: "Elastic Security generated one or more alerts that matched this session. This indicates that the activity matched a known detection rule.",
//       },
//     ],
//     finalDecision:
//       "SIEM alert: Enumeration of Privileged Local Groups Membership | HDBSCAN anomaly | GRU sequence anomaly",
//   },
//   8: {
//     id: 8,
//     user: "mehdi",
//     host: "laptop-t2f3cdg1",
//     risk: 77.25,
//     severity: "high",
//     correlationStatus: "ML_ONLY",
//     finalSeverity: "medium",
//     sessionStart: "2026-05-15T11:14:05.100000+00:00",
//     sessionEnd: "2026-05-15T11:18:42.880000+00:00",
//     eventCount: 9,
//     durationSeconds: 277.78,
//     behaviorIndicators: ["GRU Sequence Anomaly", "HDBSCAN Outlier"],
//     tokenSequence: [
//       "PROC_POWERSHELL",
//       "PROC_POWERSHELL",
//       "NET_WEB",
//       "NET_WEB",
//       "PROC_UNCATEGORIZED_USER",
//       "NET_WEB",
//       "NET_WEB",
//       "PROC_CMD",
//       "NET_WEB",
//     ],
//     siemInfo: null,
//     mlScores: {
//       gruReconstructionError: null,
//       gruThreshold: null,
//       gruAnomaly: false,
//       hdbscanOutlierScore: 0.6812,
//       hdbscanAnomaly: true,
//     },
//     whyFlagged: [
//       {
//         title: "HDBSCAN Outlier Detection",
//         color: "amber",
//         desc: "The session was identified as an outlier by the HDBSCAN clustering model. Statistical features deviate significantly from normal session clusters.",
//       },
//       {
//         title: "PowerShell Activity Observed",
//         color: "indigo",
//         desc: "Unusual PowerShell command execution patterns were detected. This deviates from the user's established behavioral baseline.",
//       },
//     ],
//     finalDecision:
//       "HDBSCAN anomaly | PowerShell behavior deviation from baseline",
//   },
// };

// type SessionData = {
//   id: number;
//   user: string;
//   host: string;
//   risk: number;
//   severity: string;
//   correlationStatus: string;
//   finalSeverity: string;
//   sessionStart: string;
//   sessionEnd: string;
//   eventCount: number;
//   durationSeconds: number;
//   behaviorIndicators: string[];
//   tokenSequence: string[];
//   siemInfo: {
//     alertCount: number;
//     rule: string;
//     riskScore: number;
//     matchMethod: string;
//   } | null;
//   mlScores: {
//     gruReconstructionError: number | null;
//     gruThreshold: number | null;
//     gruAnomaly: boolean;
//     hdbscanOutlierScore: number;
//     hdbscanAnomaly: boolean;
//   };
//   whyFlagged: { title: string; color: string; desc: string }[];
//   finalDecision: string;
// };

function severityStyle(sev: string) {
  const s = sev.toLowerCase();
  if (s === "critical")
    return {
      bg: "var(--color-crimson-dim)",
      border: "var(--color-crimson-mid)",
      text: "var(--color-crimson-bright)",
      dot: "var(--color-crimson)",
    };
  if (s === "high")
    return {
      bg: "var(--color-amber-dim)",
      border: "var(--color-amber-mid)",
      text: "var(--color-amber-bright)",
      dot: "var(--color-amber)",
    };
  if (s === "medium")
    return {
      bg: "var(--color-indigo-dim)",
      border: "var(--color-indigo-mid)",
      text: "var(--color-indigo-bright)",
      dot: "var(--color-indigo)",
    };
  return {
    bg: "var(--color-emerald-dim)",
    border: "var(--color-emerald-mid)",
    text: "var(--color-emerald)",
    dot: "var(--color-emerald)",
  };
}
function riskGradient(score: number) {
  if (score >= 75) return { from: "#e05c6b", to: "#b83050" };
  if (score >= 45) return { from: "#e0a35c", to: "#b87030" };
  return { from: "#4db8a4", to: "#2a8a78" };
}
function tokenColor(token: string) {
  if (token.includes("POWERSHELL") || token.includes("CMD"))
    return { bg: "#1e1040", border: "#4c3899", text: "#b39dff" };
  if (token.includes("NET"))
    return { bg: "#012a24", border: "#0a6655", text: "#34d9b9" };
  return {
    bg: "var(--color-elevated)",
    border: "var(--color-border-dim)",
    text: "var(--color-text-muted)",
  };
}
function indicatorColor(ind: string) {
  if (ind.includes("SIEM"))
    return {
      bg: "var(--color-indigo-dim)",
      border: "var(--color-indigo-mid)",
      text: "var(--color-indigo-bright)",
    };
  if (ind.includes("GRU"))
    return { bg: "#1e1040", border: "#4c3899", text: "#b39dff" };
  if (ind.includes("HDBSCAN"))
    return { bg: "#012a24", border: "#0a6655", text: "#34d9b9" };
  return {
    bg: "var(--color-elevated)",
    border: "var(--color-border-dim)",
    text: "var(--color-text-muted)",
  };
}
function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "medium",
  });
}

function RiskGauge({ score }: { score: number; sev: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const grad = riskGradient(score);

  useEffect(() => {
    if (!svgRef.current) return;
    const arc = svgRef.current.querySelector(".gauge-arc") as SVGPathElement;
    if (!arc) return;
    const len = arc.getTotalLength();
    gsap.fromTo(
      arc,
      { strokeDasharray: len, strokeDashoffset: len },
      {
        strokeDashoffset: len * (1 - score / 100),
        duration: 1.4,
        ease: "power3.out",
        delay: 0.6,
      },
    );
  }, [score]);

  const R = 72,
    CX = 90,
    CY = 90;
  const start = { x: CX - R, y: CY };
  const end = { x: CX + R, y: CY };

  return (
    <div className="flex flex-col items-center gap-1">
      <svg ref={svgRef} width="180" height="100" viewBox="0 0 180 100">
        <defs>
          <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={grad.from} />
            <stop offset="100%" stopColor={grad.to} />
          </linearGradient>
        </defs>
        <path
          d={`M ${start.x} ${start.y} A ${R} ${R} 0 0 1 ${end.x} ${end.y}`}
          fill="none"
          stroke="var(--color-elevated)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          className="gauge-arc"
          d={`M ${start.x} ${start.y} A ${R} ${R} 0 0 1 ${end.x} ${end.y}`}
          fill="none"
          stroke="url(#rg)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <text
          x={CX}
          y={CY - 6}
          textAnchor="middle"
          fontSize="30"
          fontWeight="700"
          fill={grad.from}
        >
          {score.toFixed(0)}
        </text>
        <text
          x={CX}
          y={CY + 14}
          textAnchor="middle"
          fontSize="10"
          fill="var(--color-text-muted)"
        >
          RISK SCORE
        </text>
      </svg>
    </div>
  );
}

function ScoreBar({
  label,
  value,
  max,
  color,
  anomaly,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  anomaly: boolean;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const pct = Math.min((value / max) * 100, 100);

  useEffect(() => {
    if (!barRef.current) return;
    gsap.fromTo(
      barRef.current,
      { width: "0%" },
      { width: `${pct}%`, duration: 1, ease: "power3.out", delay: 0.9 },
    );
  }, [pct]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span
          className="text-[12px] font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span
            className="text-[12px] font-mono font-semibold"
            style={{ color }}
          >
            {value.toFixed(4)}
          </span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
            style={{
              background: anomaly
                ? "var(--color-crimson-dim)"
                : "var(--color-emerald-dim)",
              color: anomaly
                ? "var(--color-crimson-bright)"
                : "var(--color-emerald)",
              border: `1px solid ${anomaly ? "var(--color-crimson-mid)" : "var(--color-emerald-mid)"}`,
            }}
          >
            {anomaly ? "ANOMALY" : "NORMAL"}
          </span>
        </div>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "var(--color-elevated)" }}
      >
        <div
          ref={barRef}
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 6px ${color}88` }}
        />
      </div>
    </div>
  );
}

function Timeline({ session }: { session: Session }) {
  const items = [
    { label: "Start", value: fmt(session.start), icon: "▶" },
    {
      label: "Behavior Sequence",
      value: `${session.eventCount} behavior tokens observed`,
      icon: "◈",
    },
    { label: "End", value: fmt(session.end), icon: "■" },
  ];

  return (
    <div className="flex flex-col gap-0">
      {items.map((item, i) => (
        <div key={item.label} className="flex gap-4 items-start timeline-item">
          <div className="flex flex-col items-center shrink-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold z-10"
              style={{
                background: "var(--color-indigo-dim)",
                border: "1px solid var(--color-indigo-mid)",
                color: "var(--color-indigo-bright)",
              }}
            >
              {item.icon}
            </div>
            {i < items.length - 1 && (
              <div
                className="w-px flex-1 mt-1 mb-1"
                style={{
                  background: "var(--color-border-subtle)",
                  minHeight: 32,
                }}
              />
            )}
          </div>
          <div className="pb-6">
            <p
              className="text-[13px] font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {item.label}
            </p>
            <p
              className="text-[12px] font-mono mt-0.5"
              style={{ color: "var(--color-text-muted)" }}
            >
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

const Page = () => {
  const params = useParams();
  const sessionId = Number(params?.id ?? 15);
  const session = SESSIONS.find((item) => item.id === sessionId) ?? SESSIONS[0];

  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const topRowRef = useRef<HTMLDivElement>(null);
  const sect2Ref = useRef<HTMLDivElement>(null);
  const sect3Ref = useRef<HTMLDivElement>(null);
  const sect4Ref = useRef<HTMLDivElement>(null);
  const sect5Ref = useRef<HTMLDivElement>(null);

  const sevStyle = severityStyle(session.severity ?? "low");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(headerRef.current, { y: -18, opacity: 0, duration: 0.5 }, 0);
      tl.from(
        topRowRef.current?.children ?? [],
        { y: 24, opacity: 0, duration: 0.55, stagger: 0.1 },
        0.15,
      );
      tl.from(sect2Ref.current, { y: 18, opacity: 0, duration: 0.45 }, 0.35);
      tl.from(
        sect3Ref.current?.children ?? [],
        { y: 18, opacity: 0, duration: 0.45, stagger: 0.08 },
        0.5,
      );
      tl.from(
        sect4Ref.current?.children ?? [],
        { y: 16, opacity: 0, duration: 0.4, stagger: 0.07 },
        0.65,
      );
      tl.from(
        sect5Ref.current?.children ?? [],
        { y: 14, opacity: 0, duration: 0.4, stagger: 0.06 },
        0.8,
      );
    }, pageRef);
    return () => ctx.revert();
  }, [sessionId]);

  return (
    <div ref={pageRef} className="p-6 md:p-8 max-w-350 mx-auto space-y-5">
      <div ref={headerRef}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <p
              className="text-[11px] font-medium tracking-widest uppercase mb-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              Session #{session.id} · {session.user}@{session.host}
            </p>
            <h1
              className="text-[26px] font-semibold tracking-[-0.03em] leading-none"
              style={{ color: "var(--color-text-primary)" }}
            >
              Analyst Investigation
            </h1>
            <p
              className="text-[12.5px] mt-1.5"
              style={{ color: "var(--color-text-muted)" }}
            >
              Detailed view including timeline, SIEM rules, GRU anomaly
              detection, HDBSCAN outlier analysis, and behavioral explanation.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-semibold uppercase tracking-wider"
              style={{
                background: sevStyle.bg,
                border: `1px solid ${sevStyle.border}`,
                color: sevStyle.text,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: sevStyle.dot }}
              />
              {session.severity}
            </span>
          </div>
        </div>
      </div>

      <div
        ref={topRowRef}
        className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4"
      >
        <div
          className="rounded-2xl p-6"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <h2
            className="text-[13.5px] font-semibold tracking-[-0.01em] mb-5"
            style={{ color: "var(--color-text-primary)" }}
          >
            Session Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5">
            {[
              ["Session ID", `#${session.id}`],
              ["User", session.user],
              ["Host", session.host],
              ["Event Count", `${session.eventCount} events`],
              ["Duration", `${session.duration} minutes`],
              ["Session Start", fmt(session.start)],
              ["Session End", fmt(session.end)],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-0.5">
                <span
                  className="text-[10.5px] font-medium tracking-wider uppercase"
                  style={{ color: "var(--color-indigo-bright)" }}
                >
                  {k}
                </span>
                <span
                  className="text-[13px] font-mono"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl p-6 flex flex-col gap-4"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <h2
            className="text-[13.5px] font-semibold tracking-[-0.01em]"
            style={{ color: "var(--color-text-primary)" }}
          >
            Final Risk Decision
          </h2>
          <RiskGauge score={session.risk} sev={session.severity} />
          <div className="flex flex-col gap-2.5 mt-1">
            <div>
              <span
                className="text-[10.5px] font-medium tracking-wider uppercase"
                style={{ color: "var(--color-indigo-bright)" }}
              >
                Correlation Status
              </span>
              <p
                className="text-[12.5px] font-mono mt-0.5"
                style={{ color: "var(--color-text-primary)" }}
              >
                {session.tags.join(", ")}
              </p>
            </div>
            <div>
              <span
                className="text-[10.5px] font-medium tracking-wider uppercase"
                style={{ color: "var(--color-indigo-bright)" }}
              >
                Final Severity
              </span>
              <p
                className="text-[12.5px] font-mono mt-0.5 capitalize"
                style={{ color: "var(--color-text-primary)" }}
              >
                {session.severity}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={sect2Ref}
        className="rounded-2xl p-6"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-subtle)",
        }}
      >
        <h2
          className="text-[13.5px] font-semibold tracking-[-0.01em] mb-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Behavior Indicators
        </h2>
        <div className="flex flex-wrap gap-2">
          {session.reason.split(", ").map((ind) => {
            const s = indicatorColor(ind);
            return (
              <span
                key={ind}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium"
                style={{
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                  color: s.text,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: s.text }}
                />
                {ind}
              </span>
            );
          })}
        </div>
      </div>

      <div
        className="rounded-2xl p-6"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-subtle)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-[13.5px] font-semibold tracking-[-0.01em]"
            style={{ color: "var(--color-text-primary)" }}
          >
            Token Sequence
          </h2>
          <span
            className="text-[11px] px-2 py-1 rounded-md font-mono"
            style={{
              background: "var(--color-elevated)",
              color: "var(--color-text-muted)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            {session.tokens.length} tokens
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {session.tokens.map((tok, i) => {
            const s = tokenColor(tok);
            return (
              <span
                key={i}
                className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-mono font-medium"
                style={{
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                  color: s.text,
                }}
              >
                {tok}
              </span>
            );
          })}
        </div>
      </div>

      <div ref={sect3Ref} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="rounded-2xl p-6"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <h2
            className="text-[13.5px] font-semibold tracking-[-0.01em] mb-5"
            style={{ color: "var(--color-text-primary)" }}
          >
            SIEM Rule Information
          </h2>
          {session.siemInfo ? (
            <div className="flex flex-col gap-3.5">
              {[
                ["SIEM Alert Count", String(session.siemInfo.alertCount)],
                ["SIEM Rule", session.siemInfo.rule],
                ["SIEM Risk Score", String(session.siemInfo.riskScore)],
                ["Match Method", session.siemInfo.matchMethod],
              ].map(([k, v]) => (
                <div key={k}>
                  <span
                    className="text-[11px] font-semibold"
                    style={{ color: "var(--color-amber-bright)" }}
                  >
                    {k}:
                  </span>
                  <span
                    className="text-[12.5px] ml-1.5"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{
                background: "var(--color-elevated)",
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              <span
                className="text-[12px]"
                style={{ color: "var(--color-text-muted)" }}
              >
                No SIEM rule matched this session.
              </span>
            </div>
          )}
        </div>

        <div
          className="rounded-2xl p-6"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <h2
            className="text-[13.5px] font-semibold tracking-[-0.01em] mb-5"
            style={{ color: "var(--color-text-primary)" }}
          >
            ML Scores
          </h2>
          <div className="flex flex-col gap-4">
            {session.mlScores.gruReconstructionError !== null && (
              <>
                <ScoreBar
                  label="GRU Reconstruction Error"
                  value={session.mlScores.gruReconstructionError!}
                  max={4}
                  color="var(--color-amber-bright)"
                  anomaly={session.mlScores.gruAnomaly}
                />
                <div className="flex items-center justify-between text-[12px]">
                  <span style={{ color: "var(--color-text-muted)" }}>
                    GRU Threshold
                  </span>
                  <span
                    className="font-mono"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {session.mlScores.gruThreshold}
                  </span>
                </div>
                <div
                  style={{
                    height: 1,
                    background: "var(--color-border-subtle)",
                  }}
                />
              </>
            )}
            <ScoreBar
              label="HDBSCAN Outlier Score"
              value={session.mlScores.hdbscanOutlierScore}
              max={1}
              color="var(--color-indigo-bright)"
              anomaly={session.mlScores.hdbscanAnomaly}
            />
          </div>
        </div>
      </div>

      <div
        ref={sect4Ref}
        className="rounded-2xl p-6"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-subtle)",
        }}
      >
        <h2
          className="text-[13.5px] font-semibold tracking-[-0.01em] mb-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Why Was This Session Flagged?
        </h2>
        <div className="flex flex-col gap-3">
          {session.whyFlagged.map((item) => {
            const c =
              item.color === "amber"
                ? {
                    border: "var(--color-amber-mid)",
                    text: "var(--color-amber-bright)",
                    bg: "var(--color-amber-dim)",
                  }
                : item.color === "indigo"
                  ? {
                      border: "var(--color-indigo-mid)",
                      text: "var(--color-indigo-bright)",
                      bg: "var(--color-indigo-dim)",
                    }
                  : {
                      border: "var(--color-crimson-mid)",
                      text: "var(--color-crimson-bright)",
                      bg: "var(--color-crimson-dim)",
                    };
            return (
              <div
                key={item.title}
                className="rounded-xl px-5 py-4"
                style={{
                  background: "var(--color-elevated)",
                  border: `1px solid ${c.border}`,
                }}
              >
                <p
                  className="text-[13px] font-semibold mb-1.5"
                  style={{ color: c.text }}
                >
                  {item.title}
                </p>
                <p
                  className="text-[12.5px] leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div
        ref={sect5Ref}
        className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-4"
      >
        {/* Timeline */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <h2
            className="text-[13.5px] font-semibold tracking-[-0.01em] mb-5"
            style={{ color: "var(--color-text-primary)" }}
          >
            Session Timeline
          </h2>
          <Timeline session={session} />
        </div>

        <div className="flex flex-col gap-4">
          <div
            className="rounded-2xl p-6"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            <h2
              className="text-[13.5px] font-semibold tracking-[-0.01em] mb-4"
              style={{ color: "var(--color-text-primary)" }}
            >
              Final Decision Explanation
            </h2>
            <div
              className="rounded-xl px-4 py-3 font-mono text-[12px] leading-relaxed"
              style={{
                background: "var(--color-elevated)",
                border: "1px solid var(--color-border-dim)",
                color: "var(--color-text-secondary)",
              }}
            >
              {session.finalDecision}
            </div>
          </div>
        </div>
      </div>

      <div
        className="rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-3"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-subtle)",
        }}
      >
        <div>
          <p
            className="text-[13px] font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Take Action
          </p>
          <p
            className="text-[11.5px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            Mark this session or escalate to your team.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {["Mark as Reviewed", "Escalate", "Dismiss"].map((label, i) => (
            <button
              key={label}
              className="px-4 py-2 rounded-lg text-[12.5px] font-medium"
              style={{
                background:
                  i === 0
                    ? "var(--color-indigo-dim)"
                    : i === 1
                      ? "var(--color-crimson-dim)"
                      : "transparent",
                border:
                  i === 0
                    ? "1px solid var(--color-indigo-mid)"
                    : i === 1
                      ? "1px solid var(--color-crimson-mid)"
                      : "1px solid var(--color-border-dim)",
                color:
                  i === 0
                    ? "var(--color-indigo-bright)"
                    : i === 1
                      ? "var(--color-crimson-bright)"
                      : "var(--color-text-secondary)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                gsap.to(e.currentTarget, { scale: 1.03, duration: 0.15 })
              }
              onMouseLeave={(e) =>
                gsap.to(e.currentTarget, { scale: 1, duration: 0.18 })
              }
              onClick={(e) => {
                gsap
                  .timeline()
                  .to(e.currentTarget, { scale: 0.95, duration: 0.08 })
                  .to(e.currentTarget, {
                    scale: 1,
                    duration: 0.35,
                    ease: "elastic.out(1,0.5)",
                  });
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
