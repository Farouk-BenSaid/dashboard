# Threat Detection Dashboard

A lightweight, developer-focused Next.js application that demonstrates a threat investigation dashboard with ML / SIEM correlation, interactive visualizations, and a clean UI built with TypeScript and React.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development Notes](#development-notes)
- [Contributing](#contributing)
- [License](#license)

## Overview

This repository contains a demo security operations dashboard that visualizes session-level detections, risk scoring, and evidence supporting automatic flagging. It is intended as a developer showcase and starting point for building richer investigation workflows and integrations with SIEM/ML systems.

## Features

- Session timeline and detail view
- Risk gauge and severity indicators
- Token/behavior visualization and token coloring
- SIEM and ML correlation examples (GRU / HDBSCAN) with synthetic data
- Smooth UI animations powered by `gsap`

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- React + TypeScript
- GSAP for animations
- lucide-react for icons
- Tailwind CSS (utility-first styling)

## Quick Start

Prerequisites

- Node.js 18 or newer
- Yarn, npm, or pnpm (any package manager supported)

Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

Run development server

```bash
npm run dev
# open http://localhost:3000
```

Build for production

```bash
npm run build
npm run start
```

Formatting and linting (if configured)

```bash
npm run lint
npm run format
```

## Project Structure

Key files and directories:

- [data.ts](data.ts): synthetic dataset and `Session` type used across the app
- [package.json](package.json): project scripts and dependencies
- [tsconfig.json](tsconfig.json): TypeScript configuration
- [app/layout.tsx](app/layout.tsx): global app layout and provider setup
- [app/dashboard/layout.tsx](app/dashboard/layout.tsx): dashboard layout wrapper
- [app/dashboard/page.tsx](app/dashboard/page.tsx): dashboard landing page
- [app/dashboard/investigate/%5Bid%5D/page.tsx](app/dashboard/investigate/%5Bid%5D/page.tsx): session investigation/detail view (animations, charts)
- [app/dashboard/components/Sidebar.tsx](app/dashboard/components/Sidebar.tsx): sidebar component
- [app/dashboard/components/Topbar.tsx](app/dashboard/components/Topbar.tsx): topbar component

Explore the `app` directory to find all routes and UI components.

## Development Notes

- Data source: `data.ts` contains the in-memory session dataset used by the demo. In production, replace this with API calls to a backend or SIEM service.
- Animation context: the investigate detail page uses `gsap` with React refs — when changing layout or route behavior, ensure refs are still present before animating.
- Severity/risk helpers: color and severity mapping utilities live in the investigate page; consider extracting them into a shared `lib/` or `utils/` folder if reused.

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/awesome`)
3. Make changes and add tests if applicable
4. Open a pull request describing the change

Please follow existing code style and add clear commit messages.

## License

This project is provided as-is for demonstration purposes. Add a license file (`LICENSE`) if you plan to reuse or distribute the code.

---

If you want, I can also:

- add badges (build, license, coverage)
- extract shared utilities into `src/lib` or `app/lib`
- add example API routes and a mock server for session data

Tell me which of the above you'd like next.
