"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  ArrowRight,
  Eye,
  EyeClosed,
  LockIcon,
  Mail,
  TriangleAlert,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.from(gridRef.current, { opacity: 0, duration: 1.2 }, 0);

      tl.from(
        orb1Ref.current,
        { x: -60, y: -40, opacity: 0, duration: 1.4 },
        0,
      );
      tl.from(
        orb2Ref.current,
        { x: 60, y: 40, opacity: 0, duration: 1.4 },
        0.1,
      );

      tl.from(
        cardRef.current,
        {
          y: 44,
          opacity: 0,
          scale: 0.95,
          duration: 0.85,
          ease: "expo.out",
        },
        0.2,
      );

      tl.from(
        logoRef.current,
        {
          scale: 0.4,
          opacity: 0,
          duration: 0.5,
          ease: "back.out(2.2)",
        },
        0.65,
      );

      const fields = fieldsRef.current?.querySelectorAll(".anim-field");
      if (fields) {
        tl.from(
          fields,
          {
            y: 14,
            opacity: 0,
            duration: 0.55,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.7,
        );
      }
    }, rootRef);

    gsap.to(orb1Ref.current, {
      x: 28,
      y: 18,
      duration: 11,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(orb2Ref.current, {
      x: -22,
      y: -16,
      duration: 14,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(btnRef.current, {
      scale: 1.018,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!error || !errorRef.current) return;
    gsap.fromTo(
      errorRef.current,
      { x: 0 },
      {
        keyframes: { x: [-9, 9, -6, 6, -3, 3, 0] },
        duration: 0.45,
        ease: "power2.out",
      },
    );
    gsap.from(errorRef.current, { opacity: 0, y: -6, duration: 0.3 });
  }, [error]);

  // for backend integration
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    gsap
      .timeline()
      .to(btnRef.current, { scale: 0.96, duration: 0.1, ease: "power2.in" })
      .to(btnRef.current, {
        scale: 1,
        duration: 0.4,
        ease: "elastic.out(1,0.5)",
      });

    setLoading(true);

    setTimeout(() => {
      gsap.to(cardRef.current, {
        y: -28,
        opacity: 0,
        scale: 0.96,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => router.push("/dashboard"),
      });
    }, 1100);
  }

  function onFocus(e: React.FocusEvent<HTMLInputElement>) {
    gsap.to(e.currentTarget, {
      scale: 1.005,
      duration: 0.2,
      ease: "power2.out",
    });
  }
  function onBlur(e: React.FocusEvent<HTMLInputElement>) {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: "power2.out" });
  }

  function togglePw() {
    gsap.from(".pw-eye-icon", {
      rotate: 15,
      opacity: 0.4,
      duration: 0.25,
      ease: "power2.out",
    });
    setShowPw((v) => !v);
  }

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-5 py-10"
      style={{ backgroundColor: "var(--color-base)" }}
    >
      <div
        ref={gridRef}
        className="bg-dot-grid absolute inset-0 pointer-events-none"
      />

      <div
        ref={orb1Ref}
        className="absolute -top-40 -left-28 w-105 h-105 rounded-full pointer-events-none"
        style={{
          background: "var(--color-indigo-dim)",
          filter: "blur(88px)",
          opacity: 0.38,
        }}
      />
      <div
        ref={orb2Ref}
        className="absolute -bottom-32 -right-20 w-85 h-85 rounded-full pointer-events-none"
        style={{
          background: "var(--color-emerald-dim)",
          filter: "blur(80px)",
          opacity: 0.32,
        }}
      />

      <main
        ref={cardRef}
        className="relative z-10 w-full max-w-105 rounded-[22px] px-9 pt-10 pb-8"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-dim)",
        }}
      >
        <div ref={logoRef} className="mb-5">
          <span
            className="inline-flex items-center justify-center w-11 h-11 rounded-[10px] font-mono text-sm font-medium tracking-wider"
            style={{
              background: "var(--color-indigo-dim)",
              border: "1px solid var(--color-indigo-mid)",
              color: "var(--color-indigo-bright)",
            }}
          >
            SOC
          </span>
        </div>

        <h1
          className="text-[22px] font-semibold tracking-[-0.03em] mb-1.5"
          style={{ color: "var(--color-text-primary)" }}
        >
          UEBA SOC Dahboard
        </h1>
        <p
          className="text-[12.5px]"
          style={{ color: "var(--color-text-muted)" }}
        >
          Analyst access only. Authenticate to continue.
        </p>

        <div
          className="my-6 h-px"
          style={{ background: "var(--color-border-subtle)" }}
        />

        <form onSubmit={handleSubmit} noValidate>
          <div ref={fieldsRef} className="flex flex-col gap-4.5">
            <div className="anim-field flex flex-col gap-1.75">
              <label
                htmlFor="email"
                className="text-[11px] font-medium tracking-[0.06em] uppercase"
                style={{ color: "var(--color-text-muted)" }}
              >
                Email address
              </label>
              <div className="relative flex items-center">
                <span
                  className="absolute left-3 pointer-events-none z-10"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <Mail className="w-3.5 h-3.5" />
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="analyst@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  className="w-full h-10.5 pl-9.5 pr-4 rounded-[7px] text-[13.5px] outline-none transition-[border-color,box-shadow] duration-150"
                  style={{
                    background: "var(--color-elevated)",
                    border: "1px solid var(--color-border-dim)",
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-sans)",
                  }}
                  onFocusCapture={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "var(--color-indigo)";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 0 0 3px var(--color-indigo-glow)";
                  }}
                  onBlurCapture={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "var(--color-border-dim)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            <div className="anim-field flex flex-col gap-1.75">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-[11px] font-medium tracking-[0.06em] uppercase"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11.5px] transition-opacity hover:opacity-70"
                  style={{
                    color: "var(--color-indigo-bright)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative flex items-center">
                <span
                  className="absolute left-3 pointer-events-none z-10"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <LockIcon className="w-3.5 h-3.5" />
                </span>
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  className="w-full h-10.5 pl-9.5 pr-2.75 rounded-[7px] text-[13.5px] outline-none transition-[border-color,box-shadow] duration-150"
                  style={{
                    background: "var(--color-elevated)",
                    border: "1px solid var(--color-border-dim)",
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-sans)",
                  }}
                  onFocusCapture={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "var(--color-indigo)";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 0 0 3px var(--color-indigo-glow)";
                  }}
                  onBlurCapture={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "var(--color-border-dim)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={togglePw}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="pw-eye-icon absolute right-3 flex items-center p-1 transition-colors"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {showPw ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeClosed className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                ref={errorRef}
                role="alert"
                className="anim-field flex items-center gap-2.5 px-3.5 py-2.5 rounded-[7px] text-[12.5px]"
                style={{
                  background: "var(--color-crimson-dim)",
                  border: "1px solid var(--color-crimson-mid)",
                  color: "var(--color-crimson-bright)",
                }}
              >
                <TriangleAlert className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              ref={btnRef}
              type="submit"
              disabled={loading}
              className="anim-field flex items-center justify-center gap-2 w-full h-11 mt-1 rounded-[7px] text-[14px] font-medium text-white transition-[background] duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "var(--color-indigo)",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
              onMouseEnter={() =>
                !loading &&
                gsap.to(btnRef.current, {
                  background: "var(--color-indigo-bright)",
                  duration: 0.2,
                })
              }
              onMouseLeave={() =>
                !loading &&
                gsap.to(btnRef.current, {
                  background: "var(--color-indigo)",
                  duration: 0.25,
                })
              }
            >
              {loading ? (
                <>
                  <span
                    className="animate-spin-fast inline-block w-3.75 h-3.75 rounded-full border-2"
                    style={{
                      borderColor: "rgba(255,255,255,0.25)",
                      borderTopColor: "#fff",
                    }}
                  />
                  Authenticating…
                </>
              ) : (
                <>
                  Sign in to console
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <p
          className="mt-6 text-center text-[11px] leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          Access restricted to authorized personnel.
          <br />
          All sessions are monitored and logged.
        </p>
      </main>
    </div>
  );
}
