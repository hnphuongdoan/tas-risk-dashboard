# Tasmanian Load-Limited Bridges Dashboard

A production-ready, portfolio-grade Next.js web application designed to visualize, filter, and analyze real-world infrastructure asset data from Tasmania. Built with a strong focus on data credibility, transparent assumptions, and clean analytical layout.

---

## 🚀 Key Features

* **Real Infrastructure Dataset:** Parses and processes load-limited bridge data sourced from the Department of State Growth (Tasmania) and the National Heavy Vehicle Regulator.
* **Interactive Data Grid:** Features live search capability across bridge names, roads, and owners, alongside dynamic multi-column sorting.
* **Analytical Decision-Support Chart:** Horizontal bar visualization showing bridge ownership distribution with objective, non-overclaimed executive insights.
* **Geospatial Location Inspector:** Lists spatial bridge metadata with WGS84 geographic coordinates and restriction-tier badges.
* **Transparent Methodology & Limitations:** Explicitly documents sample scope, data provenance, CC BY 4.0 licensing, and analytical boundaries to maintain professional credibility.

---

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router, Server Components)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Data Visualization:** Recharts
* **CSV Parsing:** PapaParse

---

## 📂 Project Structure

```text
tas-risk-dashboard/
├── app/
│   ├── layout.tsx         # Root layout & styling setup
│   └── page.tsx           # Main dashboard assembly & methodology footer
├── components/
│   ├── AssetTable.tsx     # Filterable, sortable, and searchable data grid
│   ├── RiskChart.tsx      # Horizontal analytical bar chart with observations
│   └── RiskMap.tsx        # Spatial coordinate cards with restriction badges
├── data/
│   └── tasmania_assets.csv# Real infrastructure sample dataset
├── lib/
│   └── loadAssets.ts      # Server-side CSV reader & data mapper
├── types/
│   └── asset.ts           # TypeScript interfaces for asset records
└── next.config.ts         # Next.js configurations & dev origins