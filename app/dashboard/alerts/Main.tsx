"use client";

import { SESSIONS } from "@/data";
import gsap from "gsap";
import { ArrowRight, Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

function riskPillStyle(score: number) {
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

function tagStyle(tag: string) {
  if (tag === "SIEM+ML" || tag === "Elastic")
    return {
      bg: "var(--color-indigo-dim)",
      border: "var(--color-indigo-mid)",
      text: "var(--color-indigo-bright)",
    };
  if (tag === "GRU")
    return { bg: "#1e1040", border: "#4c3899", text: "#b39dff" };
  if (tag === "HDBSCAN")
    return { bg: "#012a24", border: "#0a6655", text: "#34d9b9" };
  return {
    bg: "var(--color-elevated)",
    border: "var(--color-border-dim)",
    text: "var(--color-text-muted)",
  };
}

const Main = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(tableRef.current?.querySelectorAll(".table-row") ?? [], {
        y: 20,
        opacity: 0,
        duration: 0.45,
        stagger: 0.06,
      });
      tl.from(
        tableRef.current?.querySelectorAll(".risk-pill") ?? [],
        {
          scale: 0.5,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "back.out(2)",
        },
        0.05,
      );
      tl.from(feedRef.current, {
        y: 14,
        opacity: 0,
        duration: 0.4,
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="p-6 md:p-8 max-w-350 mx-auto space-y-5">
      <div
        ref={tableRef}
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
              className="text-[13.5px] font-semibold tracking-[-0.01em]"
              style={{ color: "var(--color-text-primary)" }}
            >
              Top Risky Sessions
            </h2>
            <p
              className="text-[11.5px] mt-0.5"
              style={{ color: "var(--color-text-muted)" }}
            >
              Sorted by risk score · {SESSIONS.length} flagged
            </p>
          </div>

          <div
            className="flex items-center gap-1 rounded-lg p-1"
            style={{
              background: "var(--color-elevated)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            {["All", "SIEM+ML", "ML Only"].map((tab, i) => (
              <button
                key={tab}
                className="px-3 py-1 rounded-md text-[11.5px] font-medium"
                style={{
                  background: i === 0 ? "var(--color-surface)" : "transparent",
                  color:
                    i === 0
                      ? "var(--color-text-primary)"
                      : "var(--color-text-muted)",
                  border:
                    i === 0
                      ? "1px solid var(--color-border-dim)"
                      : "1px solid transparent",
                  cursor: "pointer",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table
            className="w-full"
            style={{ borderCollapse: "collapse", minWidth: 780 }}
          >
            <thead>
              <tr
                style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
              >
                {[
                  "Session",
                  "User / Host",
                  "Risk",
                  "Detection",
                  "Reason",
                  "SIEM Rule",
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
              {SESSIONS.map((s, i) => {
                const pill = riskPillStyle(s.risk);
                return (
                  <tr
                    key={s.id}
                    className="table-row"
                    style={{
                      background:
                        i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.012)",
                      borderLeft: s.critical
                        ? "2px solid var(--color-crimson)"
                        : "2px solid transparent",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "var(--color-elevated)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.012)")
                    }
                  >
                    <td className="px-5 py-3.5">
                      <span
                        className="font-mono text-[13px] font-medium"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        #{s.id}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                          style={{
                            background: "var(--color-indigo-dim)",
                            color: "var(--color-indigo-bright)",
                            border: "1px solid var(--color-indigo-mid)",
                          }}
                        >
                          {s.user[0].toUpperCase()}
                        </span>
                        <div className="flex flex-col">
                          <span
                            className="text-[13px] font-medium"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            {s.user}
                          </span>
                          <span
                            className="text-[11px] font-mono"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            {s.host}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className="risk-pill inline-flex items-center px-2.5 py-1 rounded-lg text-[12px] font-semibold font-mono"
                        style={{
                          background: pill.bg,
                          border: `1px solid ${pill.border}`,
                          color: pill.text,
                        }}
                      >
                        {s.risk.toFixed(2)}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {s.tags.map((tag) => {
                          const ts = tagStyle(tag);
                          return (
                            <span
                              key={tag}
                              className="inline-flex px-2 py-0.5 rounded-[5px] text-[10.5px] font-medium"
                              style={{
                                background: ts.bg,
                                border: `1px solid ${ts.border}`,
                                color: ts.text,
                              }}
                            >
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 max-w-55">
                      <p
                        className="text-[12px] leading-relaxed line-clamp-2"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {s.reason}
                      </p>
                    </td>

                    <td className="px-5 py-3.5 max-w-40">
                      <p
                        className="text-[12px] leading-relaxed"
                        style={{
                          color:
                            s.siemInfo?.rule === "No SIEM rule"
                              ? "var(--color-text-muted)"
                              : "var(--color-amber-bright)",
                        }}
                      >
                        {s.siemInfo?.rule}
                      </p>
                    </td>

                    <td className="px-5 py-3.5">
                      <Link
                        href={`/dashboard/investigate/${s.id}`}
                        className="inline-flex items-center gap-1 text-[12px] font-medium px-3 py-1.5 rounded-lg transition-opacity"
                        style={{
                          background: "var(--color-indigo-dim)",
                          border: "1px solid var(--color-indigo-mid)",
                          color: "var(--color-indigo-bright)",
                        }}
                        onMouseEnter={(e) =>
                          gsap.to(e.currentTarget, { x: 2, duration: 0.18 })
                        }
                        onMouseLeave={(e) =>
                          gsap.to(e.currentTarget, { x: 0, duration: 0.2 })
                        }
                      >
                        Investigate
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div
        ref={feedRef}
        className="rounded-2xl px-6 py-5 flex items-center justify-between gap-4"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-subtle)",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: "var(--color-elevated)",
              border: "1px solid var(--color-border-dim)",
            }}
          >
            <Bell
              className="w-4 h-4"
              style={{ color: "var(--color-text-muted)" }}
            />
          </span>
          <div>
            <h2
              className="text-[13.5px] font-semibold tracking-[-0.01em]"
              style={{ color: "var(--color-text-primary)" }}
            >
              Live Alert Feed
            </h2>
            <p
              className="text-[12px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              No new alerts since last pipeline run.
            </p>
          </div>
        </div>

        <button
          className="shrink-0 px-4 py-2 rounded-lg text-[12.5px] font-medium"
          style={{
            background: "transparent",
            border: "1px solid var(--color-border-dim)",
            color: "var(--color-text-secondary)",
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
          }}
          onMouseEnter={(e) =>
            gsap.to(e.currentTarget, {
              borderColor: "var(--color-border-strong)",
              color: "var(--color-text-primary)",
              duration: 0.18,
            })
          }
          onMouseLeave={(e) =>
            gsap.to(e.currentTarget, {
              borderColor: "var(--color-border-dim)",
              color: "var(--color-text-secondary)",
              duration: 0.2,
            })
          }
          onClick={(e) => {
            gsap
              .timeline()
              .to(e.currentTarget, { scale: 0.95, duration: 0.09 })
              .to(e.currentTarget, {
                scale: 1,
                duration: 0.4,
                ease: "elastic.out(1,0.5)",
              });
          }}
        >
          Reset cleared alerts
        </button>
      </div>
    </div>
  );
};

export default Main;
