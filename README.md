# Tasmanian Load-Limited Bridges Dashboard

**Live demo:** [https://tas-risk-dashboard-cnlz.vercel.app](https://tas-risk-dashboard-cnlz.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=flat-square&logo=tailwindcss)
![Leaflet](https://img.shields.io/badge/Leaflet-GIS-199900?style=flat-square&logo=leaflet)
[![Data License: CC BY 4.0](https://img.shields.io/badge/Data-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Code License: MIT](https://img.shields.io/badge/Code-MIT-green.svg)](LICENSE)

An interactive dashboard exploring heavy-vehicle load limits on a sample of 20 Tasmanian bridges, built with Next.js, TypeScript, Tailwind CSS and Leaflet using open data from the Department of State Growth.

---

## Summary

In this sample of 20 load-limited bridges, 5 (25%) are restricted to 5 t or less, and 18 of 20 are council-managed. Load limits show legal restrictions, not structural condition. This is a convenience sample, not random, so figures describe these 20 bridges only.

---

## Features

* **Interactive map:** React-Leaflet with OpenStreetMap tiles (no API key). Markers coloured by load-limit band, the map fits to the markers, and popups show bridge details.
* **Searchable, sortable table:** Click any column header to sort (including load limit in tonnes), search by name, road, owner or notes, and filter by band.
* **CSV export:** Exports the current filtered table.
* **Chart:** Bar chart of bridges by band, built with Recharts.

---

## Scope & Data Specification

* **Dataset:** [Tasmanian Load Limited Bridges and Roads](https://researchdata.edu.au/tasmanian-load-limited-bridges-roads/3787918) (load-limit bridges layer), Department of State Growth (Tasmania). Retrieved 13 Oct 2026. 
* **Data File:** Local sample JSON/data asset located at `lib/bridgesData.ts`.
* **API Source Query:** [ArcGIS REST Query Service](https://data.stategrowth.tas.gov.au/ags/rest/services/HVN/LoadLimited_RoadsBridges/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&resultRecordCount=20&orderByFields=OBJECTID&f=json)
* **Sample Scope:** First 20 of 40 records in the source layer, ordered by Object ID (`resultRecordCount=20&orderByFields=OBJECTID`), checked 15 Oct 2026. Non-random convenience sample.
* **Licensing & Attribution:** Data © Department of State Growth (Tasmania), CC BY 4.0. Code: MIT.

---

## Classification Bands

To analyze the distribution of restrictions, assets are categorized into three author-defined exploratory bands:
* **Severe (≤ 5 t)**
* **Moderate (6–20 t)**
* **Light (> 20 t)**  
*(Note: These cut-offs are chosen by the author for exploration and do not represent an official departmental classification).*

---

## Tech Stack

* **Framework:** Next.js (App Router, Turbopack)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Mapping:** React-Leaflet
* **Charts:** Recharts

---

## Data Quality & Limitations

* **Unnamed Assets:** Some roads and bridges are unnamed in the source layer.
* **Supplementary Notes:** Specific structures feature axle-group or speed restrictions captured in metadata notes (e.g., Hoggs Bridge and Acton Creek).
* **Absence of Condition Data:** Limits reflect legal operating restrictions only, with no structural age, traffic volume, or freight-route data attached.

---

## Future Improvements

* Load all 40 records from the source layer.
* Cross-reference against the full Tasmanian bridge register to evaluate the share of each council's assets subject to load limits.
* Integrate supplementary traffic volume or asset condition datasets where available.

---

## What I Learned / Challenges

* **SSR & Leaflet Integration:** Managing Leaflet's reliance on `window` objects by utilizing dynamic imports with Server-Side Rendering (`ssr: false`) disabled in Next.js.
* **Data Normalization:** Handling missing or inconsistent attribute typing across raw public sector GIS layers.

---

## Getting Started

```bash
git clone https://github.com/hnphuongdoan/tas-risk-dashboard.git
cd tas-risk-dashboard
npm install
npm run dev

Open http://localhost:3000 in your browser.

License
Data © Department of State Growth (Tasmania), CC BY 4.0. Code licensed under the MIT License.