# Tasmanian Load-Limited Bridges Dashboard

> A high-fidelity, production-grade infrastructure analytics dashboard exploring heavy-vehicle load restrictions on Tasmanian bridges. Built with strict engineering standards, data-accurate reporting, and transparent methodological constraints.

![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=flat-square&logo=tailwindcss)
![React-Leaflet](https://img.shields.io/badge/Leaflet-GIS-199900?style=flat-square&logo=leaflet)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)

---

## 📌 Executive Summary

This dashboard provides an analytical interface for examining heavy-vehicle load-limit restrictions across Tasmanian bridge assets. 

* **Key Finding (Convenience Sample):** In a sample of **20 load-limited bridges**, **5 (25%)** are restricted to a severe threshold of **5 t or less**, and **18 of 20** are managed by local government councils.
* **Important Distinction:** Load limits represent **legal operating restrictions**, not structural engineering condition ratings.

---

## 📊 Scope & Data Specification

* **Dataset:** Tasmanian Load Limited Bridges and Roads (Load-Limit Bridges Layer), Department of State Growth (Tasmania). Retrieved 13 Oct 2026.
* **Sample Scope:** A convenience sample of **20 out of 40 records**, ordered by Object ID (`resultRecordCount=20&orderByFields=OBJECTID`), verified on 15 Oct 2026. Because this is a non-random convenience sample, all figures describe these 20 specific bridges only.
* **Licensing:** Licensed under Creative Commons Attribution 4.0 International (**CC BY 4.0**). Filtered and banded by the author.

---

## 🗂️ Classification Bands

To analyze the distribution of restrictions, assets are categorized into three author-defined operational bands:
1. **Severe ($\le 5$ t):** High restriction threshold, heavily limiting freight and multi-axle transport.
2. **Moderate (6–20 t):** Intermediate restriction band.
3. **Light ($> 20$ t):** Minor operating restrictions.

---

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router, Turbopack, Server-Side Rendering with dynamic client isolation)
* **Styling:** Tailwind CSS (Dark-mode engineering aesthetic)
* **GIS Mapping:** React-Leaflet with custom WGS84 coordinate markers, auto-bounding padding, and OpenStreetMap tiles (Zero external API key dependencies)
* **Data Visualization:** Recharts (Responsive bar distributions)
* **Data Utility:** Client-side multi-column sorting, real-time query filtering, and CSV data export

---

## ⚠️ Data Quality & Limitations

* **Unnamed Assets:** Certain regional roads and bridge assets lack formal naming conventions within the source layer.
* **Supplementary Notes:** Specific structures feature axle-group or speed restrictions captured in the metadata notes (e.g., Hoggs Bridge and Acton Creek).
* **Absence of Condition Data:** The dataset records legal thresholds only; no structural age, traffic volume, or asset condition metrics are attached.

---

## 🚀 Getting Started Locally

### Prerequisites
* Node.js (v18+ recommended)
* npm

### Installation & Run Steps

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/hnphuongdoan/tas-risk-dashboard.git](https://github.com/hnphuongdoan/tas-risk-dashboard.git)
   cd tas-risk-dashboard