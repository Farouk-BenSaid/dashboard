import {
  ActivityIcon,
  LayoutGrid,
  Sun,
  TriangleAlert,
  Zap,
} from "lucide-react";

export const STATS = [
  {
    label: "Total Sessions",
    value: "15",
    sub: "Analyzed windows",
    color: "text",
    icon: LayoutGrid,
  },
  {
    label: "SIEM Alerts",
    value: "1",
    sub: "Elastic rule detections",
    color: "amber",
    icon: TriangleAlert,
  },
  {
    label: "ML Alerts",
    value: "7",
    sub: "GRU/HDBSCAN detections",
    color: "indigo",
    icon: Sun,
  },
  {
    label: "Average Risk",
    value: "42.09",
    sub: "Mean correlated score",
    color: "text",
    icon: ActivityIcon,
  },
  {
    label: "Maximum Risk",
    value: "100",
    sub: "Highest active risk",
    color: "crimson",
    icon: Zap,
  },
];

export type Status = "escalated" | "reviewed" | "dismissed";

export interface Session {
  id: number;
  user: string;
  host: string;
  risk: number;
  critical: boolean;
  severity: string;
  status: Status;
  tags: string[];
  siemInfo: {
    alertCount: number;
    rule: string;
    riskScore: number;
    matchMethod: string;
  } | null;
  reason: string;
  start: string;
  end: string;
  duration: string;
  eventCount: number;
  analystNote: string;
  gru: { error: number; threshold: number };
  hdbscan: { score: number };
  tokens: string[];
  mlScores: {
    gruReconstructionError: number;
    gruThreshold: number;
    gruAnomaly: boolean;
    hdbscanOutlierScore: number;
    hdbscanAnomaly: boolean;
  };
  whyFlagged: {
    title: string;
    color: string;
    desc: string;
  }[];
  finalDecision: string;
}

export const SESSIONS: Session[] = [
  {
    id: 15,
    user: "mehdi",
    host: "laptop-t2f3cdg1",
    risk: 100,
    critical: true,
    severity: "critical",
    status: "escalated",
    tags: ["SIEM+ML", "GRU", "HDBSCAN"],
    siemInfo: {
      alertCount: 2,
      rule: "Enumeration of Privileged Local Groups Membership",
      riskScore: 47,
      matchMethod: "nearest_time_user_host",
    },
    reason:
      "SIEM rule and ML models agreed on suspicious behavior. GRU error exceeded threshold. HDBSCAN classified as outlier.",
    start: "2026-05-15T12:22:32Z",
    end: "2026-05-15T12:23:23Z",
    duration: "51s",
    eventCount: 14,
    analystNote: "Sent to Tier-2. Possible lateral movement detected.",
    gru: { error: 2.695, threshold: 0.967 },
    hdbscan: { score: 0.807 },
    tokens: [
      "PROC_UNCATEGORIZED_USER",
      "PROC_UNCATEGORIZED_USER",
      "PROC_UNCATEGORIZED_USER",
      "NET_WEB",
      "NET_WEB",
      "NET_WEB",
      "NET_WEB",
      "NET_WEB",
      "NET_WEB",
    ],
    mlScores: {
      gruReconstructionError: 2.695,
      gruThreshold: 0.9671,
      gruAnomaly: true,
      hdbscanOutlierScore: 0.8074,
      hdbscanAnomaly: true,
    },
    whyFlagged: [
      {
        title: "GRU Sequence Anomaly",
        color: "amber",
        desc: "The GRU autoencoder reconstruction error exceeded the learned threshold. This indicates that the session sequence differs from normal behavior learned during training.",
      },
      {
        title: "HDBSCAN Outlier Detection",
        color: "amber",
        desc: "The session was identified as an outlier by the HDBSCAN clustering model. This indicates that its statistical features differ from normal session clusters.",
      },
      {
        title: "SIEM Rule Match",
        color: "amber",
        desc: "Elastic Security generated one or more alerts that matched this session. This indicates that the activity matched a known detection rule.",
      },
    ],
    finalDecision:
      "Escalate to Tier-2 for in-depth investigation of potential lateral movement.",
  },
  {
    id: 8,
    user: "mehdi",
    host: "laptop-t2f3cdg1",
    risk: 77.25,
    critical: false,
    severity: "high",
    status: "escalated",
    tags: ["ML ONLY", "HDBSCAN"],
    siemInfo: null,
    reason:
      "HDBSCAN outlier. PowerShell activity observed outside business hours.",
    start: "2026-05-15T09:14:07Z",
    end: "2026-05-15T09:16:44Z",
    duration: "2m 37s",
    eventCount: 22,
    analystNote: "Escalated — unusual PowerShell invocations need IR review.",
    gru: { error: 0.312, threshold: 0.967 },
    hdbscan: { score: 0.741 },
    tokens: [
      "PROC_POWERSHELL",
      "PROC_POWERSHELL",
      "NET_DNS",
      "PROC_UNCATEGORIZED_USER",
      "FILE_WRITE",
      "NET_WEB",
    ],
    mlScores: {
      gruReconstructionError: 0.312,
      gruThreshold: 0.967,
      gruAnomaly: false,
      hdbscanOutlierScore: 0.741,
      hdbscanAnomaly: true,
    },
    whyFlagged: [
      {
        title: "HDBSCAN Outlier Detection",
        color: "amber",
        desc: "The session was identified as an outlier by the HDBSCAN clustering model. Statistical features deviate significantly from normal session clusters.",
      },
      {
        title: "PowerShell Activity Observed",
        color: "indigo",
        desc: "Unusual PowerShell command execution patterns were detected. This deviates from the user's established behavioral baseline.",
      },
    ],
    finalDecision:
      "Escalate to IR team for review of unusual PowerShell activity outside business hours.",
  },
  {
    id: 9,
    user: "mehdi",
    host: "laptop-t2f3cdg1",
    risk: 76.83,
    critical: false,
    severity: "high",
    status: "reviewed",
    tags: ["ML ONLY", "HDBSCAN"],
    siemInfo: null,
    reason:
      "HDBSCAN outlier. Unusual network pattern but within expected maintenance window.",
    start: "2026-05-14T23:05:18Z",
    end: "2026-05-14T23:07:02Z",
    duration: "1m 44s",
    eventCount: 9,
    analystNote:
      "Reviewed — network spike correlates with scheduled backup job.",
    gru: { error: 0.288, threshold: 0.967 },
    hdbscan: { score: 0.719 },
    tokens: [
      "NET_WEB",
      "NET_WEB",
      "NET_WEB",
      "NET_WEB",
      "PROC_UNCATEGORIZED_USER",
      "NET_WEB",
    ],
    mlScores: {
      gruReconstructionError: 0.288,
      gruThreshold: 0.967,
      gruAnomaly: false,
      hdbscanOutlierScore: 0.719,
      hdbscanAnomaly: true,
    },
    whyFlagged: [
      {
        title: "HDBSCAN Outlier Detection",
        color: "amber",
        desc: "The session was identified as an outlier by the HDBSCAN clustering model. This indicates that its statistical features differ from normal session clusters.",
      },
    ],
    finalDecision:
      "Reviewed and determined to be a false positive due to scheduled backup activity.",
  },
  {
    id: 13,
    user: "mehdi",
    host: "laptop-t2f3cdg1",
    risk: 76.67,
    critical: false,
    severity: "high",
    status: "reviewed",
    tags: ["ML ONLY", "GRU", "HDBSCAN"],
    siemInfo: null,
    reason:
      "GRU and HDBSCAN both flagged. Analyst confirmed authorized admin task.",
    start: "2026-05-14T15:33:40Z",
    end: "2026-05-14T15:38:55Z",
    duration: "5m 15s",
    eventCount: 31,
    analystNote:
      "Reviewed — confirmed authorized AD group enumeration by sysadmin.",
    gru: { error: 1.124, threshold: 0.967 },
    hdbscan: { score: 0.688 },
    tokens: [
      "PROC_CMD",
      "PROC_CMD",
      "PROC_UNCATEGORIZED_USER",
      "NET_LDAP",
      "NET_LDAP",
      "PROC_UNCATEGORIZED_USER",
    ],
    mlScores: {
      gruReconstructionError: 1.124,
      gruThreshold: 0.967,
      gruAnomaly: true,
      hdbscanOutlierScore: 0.688,
      hdbscanAnomaly: true,
    },
    whyFlagged: [
      {
        title: "HDBSCAN Outlier Detection",
        color: "amber",
        desc: "The session was identified as an outlier by the HDBSCAN clustering model. This indicates that its statistical features differ from normal session clusters.",
      },
    ],
    finalDecision:
      "Reviewed and determined to be a false positive due to authorized administrative activity.",
  },
  {
    id: 11,
    user: "mehdi",
    host: "laptop-t2f3cdg1",
    risk: 66.98,
    critical: false,
    severity: "medium",
    status: "dismissed",
    tags: ["ML ONLY", "HDBSCAN"],
    siemInfo: null,
    reason:
      "HDBSCAN outlier. Command shell activity confirmed as developer tooling.",
    start: "2026-05-13T14:22:11Z",
    end: "2026-05-13T14:24:08Z",
    duration: "1m 57s",
    eventCount: 18,
    analystNote: "Dismissed — false positive. Dev running build scripts.",
    gru: { error: 0.198, threshold: 0.967 },
    hdbscan: { score: 0.621 },
    tokens: [
      "PROC_CMD",
      "PROC_CMD",
      "FILE_WRITE",
      "FILE_WRITE",
      "PROC_CMD",
      "NET_WEB",
    ],
    mlScores: {
      gruReconstructionError: 0.198,
      gruThreshold: 0.967,
      gruAnomaly: false,
      hdbscanOutlierScore: 0.621,
      hdbscanAnomaly: true,
    },
    whyFlagged: [
      {
        title: "HDBSCAN Outlier Detection",
        color: "amber",
        desc: "The session was identified as an outlier by the HDBSCAN clustering model. This indicates that its statistical features differ from normal session clusters.",
      },
    ],
    finalDecision:
      "Dismissed as false positive due to known developer activity.",
  },
  {
    id: 6,
    user: "mehdi",
    host: "laptop-t2f3cdg1",
    risk: 61.14,
    critical: false,
    severity: "medium",
    status: "dismissed",
    tags: ["ML ONLY", "HDBSCAN"],
    siemInfo: null,
    reason: "HDBSCAN outlier. Verified to be package manager traffic.",
    start: "2026-05-13T10:08:30Z",
    end: "2026-05-13T10:09:45Z",
    duration: "1m 15s",
    eventCount: 7,
    analystNote: "Dismissed — npm install activity, expected behaviour.",
    gru: { error: 0.155, threshold: 0.967 },
    hdbscan: { score: 0.584 },
    tokens: [
      "NET_WEB",
      "NET_WEB",
      "NET_WEB",
      "PROC_UNCATEGORIZED_USER",
      "NET_WEB",
    ],
    mlScores: {
      gruReconstructionError: 0.155,
      gruThreshold: 0.967,
      gruAnomaly: false,
      hdbscanOutlierScore: 0.584,
      hdbscanAnomaly: true,
    },

    whyFlagged: [
      {
        title: "HDBSCAN Outlier Detection",
        color: "amber",
        desc: "The session was identified as an outlier by the HDBSCAN clustering model. This indicates that its statistical features differ from normal session clusters.",
      },
    ],
    finalDecision:
      "Dismissed as false positive due to known package management activity.",
  },
  {
    id: 3,
    user: "sysadmin",
    host: "srv-prod-01",
    risk: 25.4,
    critical: false,
    severity: "low",
    status: "reviewed",
    tags: ["ML ONLY", "HDBSCAN"],
    siemInfo: null,
    reason: "Minor HDBSCAN outlier. Low risk score.",
    start: "2026-05-12T08:15:00Z",
    end: "2026-05-12T08:16:30Z",
    duration: "1m 30s",
    eventCount: 5,
    analystNote: "Reviewed — routine server health check.",
    gru: { error: 0.092, threshold: 0.967 },
    hdbscan: { score: 0.312 },
    tokens: [
      "PROC_UNCATEGORIZED_USER",
      "NET_WEB",
      "NET_WEB",
      "PROC_UNCATEGORIZED_USER",
    ],
    mlScores: {
      gruReconstructionError: 0.092,
      gruThreshold: 0.967,
      gruAnomaly: false,
      hdbscanOutlierScore: 0.312,
      hdbscanAnomaly: false,
    },
    whyFlagged: [
      {
        title: "HDBSCAN Outlier Detection",
        color: "amber",
        desc: "The session was identified as an outlier by the HDBSCAN clustering model. This indicates that its statistical features differ from normal session clusters.",
      },
    ],
    finalDecision: "Reviewed and determined to be normal activity.",
  },
  {
    id: 2,
    user: "jdoe",
    host: "workstation-44b",
    risk: 55.2,
    critical: false,
    severity: "medium",
    status: "dismissed",
    tags: ["ML ONLY", "GRU"],
    siemInfo: null,
    reason:
      "GRU flagged unusual sequence. Analyst confirmed VPN reconnection pattern.",
    start: "2026-05-12T17:44:22Z",
    end: "2026-05-12T17:46:10Z",
    duration: "1m 48s",
    eventCount: 11,
    analystNote: "Dismissed — VPN reconnect loop, known issue on this host.",
    gru: { error: 1.044, threshold: 0.967 },
    hdbscan: { score: 0.421 },
    tokens: [
      "NET_VPN",
      "NET_VPN",
      "NET_WEB",
      "NET_VPN",
      "PROC_UNCATEGORIZED_USER",
      "NET_WEB",
    ],
    mlScores: {
      gruReconstructionError: 1.044,
      gruThreshold: 0.967,
      gruAnomaly: true,
      hdbscanOutlierScore: 0.421,
      hdbscanAnomaly: false,
    },
    whyFlagged: [
      {
        title: "GRU Anomaly Detection",
        color: "amber",
        desc: "The session was identified as an anomaly by the GRU model. This indicates that its statistical features differ from normal session clusters.",
      },
    ],
    finalDecision:
      "Dismissed as false positive due to known VPN reconnect loop.",
  },
];

export const STATUS_CONFIG = {
  escalated: {
    label: "Escalated",
    bg: "var(--color-crimson-dim)",
    border: "var(--color-crimson-mid)",
    text: "var(--color-crimson-bright)",
    dot: "var(--color-crimson)",
  },
  reviewed: {
    label: "Reviewed",
    bg: "var(--color-emerald-dim)",
    border: "var(--color-emerald-mid)",
    text: "var(--color-emerald)",
    dot: "var(--color-emerald)",
  },
  dismissed: {
    label: "Dismissed",
    bg: "var(--color-overlay)",
    border: "var(--color-border-dim)",
    text: "var(--color-text-muted)",
    dot: "var(--color-text-muted)",
  },
};

export const SEVERITY_DATA = [
  {
    label: "Critical",
    color: "#e05c6b",
    glow: "#e05c6b55",
    count: SESSIONS.filter((s) => s.risk >= 80).length,
    sessions: [
      {
        id: SESSIONS.find((s) => s.risk >= 80)?.id || 0,
        score: SESSIONS.find((s) => s.risk >= 80)?.risk || 0,
      },
    ],
  },
  {
    label: "High",
    color: "#e07c5c",
    glow: "#e07c5c55",
    count: SESSIONS.filter((s) => s.risk >= 60 && s.risk < 80).length,
    sessions: [
      {
        id: SESSIONS.find((s) => s.risk >= 60 && s.risk < 80)?.id || 0,
        score: SESSIONS.find((s) => s.risk >= 60 && s.risk < 80)?.risk || 0,
      },
    ],
  },
  {
    label: "Medium",
    color: "#e0a35c",
    glow: "#e0a35c55",
    count: SESSIONS.filter((s) => s.risk >= 40 && s.risk < 60).length,
    sessions: [
      {
        id: SESSIONS.find((s) => s.risk >= 40 && s.risk < 60)?.id || 0,
        score: SESSIONS.find((s) => s.risk >= 40 && s.risk < 60)?.risk || 0,
      },
    ],
  },
  {
    label: "Low",
    color: "#e0c85c",
    glow: "#e0c85c55",
    count: SESSIONS.filter((s) => s.risk >= 20 && s.risk < 40).length,
    sessions: [
      {
        id: SESSIONS.find((s) => s.risk >= 20 && s.risk < 40)?.id || 0,
        score: SESSIONS.find((s) => s.risk >= 20 && s.risk < 40)?.risk || 0,
      },
    ],
  },
  {
    label: "Normal",
    color: "#4db8a4",
    glow: "#4db8a455",
    count: SESSIONS.filter((s) => s.risk < 20).length,
    sessions: [
      {
        id: SESSIONS.find((s) => s.risk < 20)?.id || 0,
        score: SESSIONS.find((s) => s.risk < 20)?.risk || 0,
      },
    ],
  },
];

export const RISK_BARS = SESSIONS.map((session) => ({
  id: `S${session.id}`,
  score: Math.round(session.risk),
})).sort((a, b) => b.score - a.score);

export const USERS = [
  {
    id: "mehdi",
    displayName: "Mehdi Bensalem",
    role: "System Administrator",
    department: "IT Operations",
    avatar: "MB",
    avatarColor: "#4f46e5",
    riskScore: 100,
    riskTrend: "up",
    sessions: 15,
    flagged: 7,
    lastActive: "2026-05-15T12:23:23Z",
    status: "active",
    topAlert: "SIEM+ML",
    hosts: ["laptop-t2f3cdg1"],
    alerts: { siem: 1, ml: 6, clean: 8 },
    weeklyRisk: [22, 35, 18, 67, 88, 100, 76],
  },
  {
    id: "sarah.k",
    displayName: "Sarah Karim",
    role: "DevOps Engineer",
    department: "Engineering",
    avatar: "SK",
    avatarColor: "#0891b2",
    riskScore: 34,
    riskTrend: "stable",
    sessions: 9,
    flagged: 1,
    lastActive: "2026-05-15T09:10:00Z",
    status: "active",
    topAlert: "ML ONLY",
    hosts: ["dev-ws-sk01", "build-server-02"],
    alerts: { siem: 0, ml: 1, clean: 8 },
    weeklyRisk: [12, 18, 30, 34, 22, 34, 28],
  },
  {
    id: "amine.t",
    displayName: "Amine Toumi",
    role: "Security Analyst",
    department: "Security",
    avatar: "AT",
    avatarColor: "#059669",
    riskScore: 8,
    riskTrend: "down",
    sessions: 6,
    flagged: 0,
    lastActive: "2026-05-14T16:45:00Z",
    status: "idle",
    topAlert: "Clean",
    hosts: ["sec-ws-at01"],
    alerts: { siem: 0, ml: 0, clean: 6 },
    weeklyRisk: [15, 10, 8, 6, 4, 8, 8],
  },
  {
    id: "lina.m",
    displayName: "Lina Mansouri",
    role: "HR Manager",
    department: "Human Resources",
    avatar: "LM",
    avatarColor: "#db2777",
    riskScore: 21,
    riskTrend: "stable",
    sessions: 4,
    flagged: 1,
    lastActive: "2026-05-15T11:00:00Z",
    status: "active",
    topAlert: "ML ONLY",
    hosts: ["hr-desktop-lm"],
    alerts: { siem: 0, ml: 1, clean: 3 },
    weeklyRisk: [5, 8, 12, 21, 18, 21, 15],
  },
  {
    id: "omar.b",
    displayName: "Omar Bouali",
    role: "Finance Lead",
    department: "Finance",
    avatar: "OB",
    avatarColor: "#d97706",
    riskScore: 55,
    riskTrend: "up",
    sessions: 8,
    flagged: 3,
    lastActive: "2026-05-15T08:30:00Z",
    status: "active",
    topAlert: "SIEM",
    hosts: ["fin-ws-ob01", "laptop-ob02"],
    alerts: { siem: 1, ml: 2, clean: 5 },
    weeklyRisk: [20, 25, 38, 42, 55, 48, 55],
  },
  {
    id: "rania.h",
    displayName: "Rania Haddad",
    role: "Junior Developer",
    department: "Engineering",
    avatar: "RH",
    avatarColor: "#7c3aed",
    riskScore: 3,
    riskTrend: "down",
    sessions: 3,
    flagged: 0,
    lastActive: "2026-05-13T14:20:00Z",
    status: "idle",
    topAlert: "Clean",
    hosts: ["dev-ws-rh01"],
    alerts: { siem: 0, ml: 0, clean: 3 },
    weeklyRisk: [6, 4, 3, 5, 3, 2, 3],
  },
];

export const STATS_USERS = [
  {
    label: "Total Users",
    value: "6",
    sub: "Monitored identities",
    color: "text",
  },
  {
    label: "Flagged Users",
    value: "3",
    sub: "At least 1 alert",
    color: "amber",
  },
  { label: "High Risk", value: "1", sub: "Score ≥ 75", color: "crimson" },
  {
    label: "Active Now",
    value: "4",
    sub: "Sessions in last 24h",
    color: "emerald",
  },
  {
    label: "Total Sessions",
    value: "45",
    sub: "Across all users",
    color: "indigo",
  },
];

// export const RISK_BARS = [
//   { id: "S15", score: 100 },
//   { id: "S8", score: 77 },
//   { id: "S9", score: 77 },
//   { id: "S13", score: 76 },
//   { id: "S11", score: 67 },
//   { id: "S6", score: 61 },
//   { id: "S2", score: 55 },
//   { id: "S5", score: 26 },
//   { id: "S3", score: 25 },
//   { id: "S12", score: 21 },
//   { id: "S14", score: 20 },
//   { id: "S4", score: 16 },
//   { id: "S10", score: 7 },
//   { id: "S1", score: 2 },
//   { id: "S7", score: 1 },
// ];

// const SEVERITY_DATA = [
//   {
//     label: "Critical",
//     count: 1,
//     color: "#e05c6b",
//     glow: "#e05c6b55",
//     sessions: [{ id: "S15", score: 100 }],
//   },
//   {
//     label: "High",
//     count: 3,
//     color: "#e07c5c",
//     glow: "#e07c5c55",
//     sessions: [
//       { id: "S8", score: 77 },
//       { id: "S9", score: 77 },
//       { id: "S13", score: 76 },
//     ],
//   },
//   {
//     label: "Medium",
//     count: 3,
//     color: "#e0a35c",
//     glow: "#e0a35c55",
//     sessions: [
//       { id: "S11", score: 67 },
//       { id: "S6", score: 61 },
//       { id: "S2", score: 55 },
//     ],
//   },
//   {
//     label: "Low",
//     count: 4,
//     color: "#e0c85c",
//     glow: "#e0c85c55",
//     sessions: [
//       { id: "S5", score: 26 },
//       { id: "S3", score: 25 },
//       { id: "S12", score: 21 },
//       { id: "S14", score: 20 },
//     ],
//   },
//   {
//     label: "Normal",
//     count: 4,
//     color: "#4db8a4",
//     glow: "#4db8a455",
//     sessions: [
//       { id: "S4", score: 16 },
//       { id: "S10", score: 7 },
//       { id: "S1", score: 2 },
//       { id: "S7", score: 1 },
//     ],
//   },
// ];
