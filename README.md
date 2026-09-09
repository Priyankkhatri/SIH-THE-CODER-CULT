# 🏛️ SIH 2026 — AI-Powered Intelligent Tourist Companion
### Problem Statement: **SIH26204** | Team: **THE CODER CULT**
**Repository:** [Priyankkhatri/SIH-THE-CODER-CULT](https://github.com/Priyankkhatri/SIH-THE-CODER-CULT) *(Forked from [maharshijpatelcg-work/SIH-THE-CODER-CULT](https://github.com/maharshijpatelcg-work/SIH-THE-CODER-CULT))*

---

## 📌 Executive Overview
This repository contains the **Digital Indian Heritage Dataset, Geospatial Registry, and Edge Computer Vision Pipeline** engineered for **Smart India Hackathon 2026 (Problem Statement SIH26204: AI-Powered Intelligent Tourist Companion)**.

Rather than relying on generic LLMs (which frequently hallucinate historical facts) or toy image datasets of 20–30 postcard photos, this repository delivers an **audited, production-ready 4-tier heritage data architecture** covering India's built heritage from macro-level national censuses down to micro-level camera angle detection and museum artifacts.

---

## 🏗️ 4-Tier Architecture Overview

```
Level 4: NATIONAL MACRO CENSUS
  └─ 19.64 Lakhs Documented Antiquities (ASI + State + NMMA + OpenStreetMap)
       │
Level 3: COMPLETE ALL-INDIA ASI NATIONAL REGISTRY
  └─ 3,936 Centrally Protected Monuments across 28 States & 8 UTs (1.02 MB CSV)
       │
Level 2: EXHAUSTIVE GUJARAT STATE ARCHAEOLOGICAL ATLAS
  └─ All 203 Centrally Protected Sites across all 33 Districts of Gujarat (55 KB CSV)
       │
Level 1: HIGH-DENSITY VISION & CURATORIAL RAG SHOWCASE
  └─ 91 Master Sites | 541 Verified Multi-Angle Photos | Scannable CV Targets
```

---

## 📊 Dataset Catalog & Inventory

| File Path | Records | Size | Description |
| :--- | :--- | :--- | :--- |
| [`dataset/asi_national_heritage_registry_3696.csv`](dataset/asi_national_heritage_registry_3696.csv) | **3,936 Monuments** | 1.02 MB | Official inventory of all ASI Centrally Protected Monuments across all 28 Indian States and UTs with coordinates and Commons categories. |
| [`dataset/asi_national_heritage_registry_3696.json`](dataset/asi_national_heritage_registry_3696.json) | **3,936 Monuments** | 2.12 MB | Structured JSON format with complete metadata. |
| [`dataset/gujarat_heritage_atlas_exhaustive.csv`](dataset/gujarat_heritage_atlas_exhaustive.csv) | **203 Monuments** | 55.6 KB | Exhaustive coverage of all Centrally Protected Monuments in Gujarat across all 33 districts (Vadodara Circle & Ahmedabad Sub-Circle). |
| [`dataset/gujarat_heritage_atlas_exhaustive.json`](dataset/gujarat_heritage_atlas_exhaustive.json) | **203 Monuments** | 112 KB | Complete Gujarat JSON dataset. |
| [`dataset/indian_heritage_dataset.json`](dataset/indian_heritage_dataset.json) | **91 Master Sites** | 328 KB | Deep curatorial dataset with **541 verified working multi-angle photos**, architectural styles, scannable CV targets, and audio-guide scripts. |
| [`dataset/indian_heritage_dataset.csv`](dataset/indian_heritage_dataset.csv) | **91 Master Sites** | 295 KB | Tabular version of the 91 curated showcase sites. |
| [`dataset/national_heritage_lakhs_census.csv`](dataset/national_heritage_lakhs_census.csv) | **33 States/UTs** | 4.2 KB | Official state-by-state 1.96 Million (19.64 Lakhs) national heritage census table (ASI + State + NMMA + OSM). |
| [`dataset/cv_training_augmentation_spec.json`](dataset/cv_training_augmentation_spec.json) | Spec | 1.5 KB | Synthetic camera augmentation pipeline for simulating real tourist mobile conditions (lighting, glare, blur, occlusion). |

---

## 🌐 Interactive Web Viewer (`index.html` / `INDIAN_HERITAGE_DATASET.html`)

An interactive, zero-dependency browser dashboard (1.64 MB) is included in the root directory:
* **Tab 1 — Curated Vision & RAG Showcase:** Browse 91 landmark sites with multi-angle photo carousels (exterior, interior, ceilings, night views) and audio-guide dossiers.
* **Tab 2 — Gujarat Heritage Atlas:** Search and filter all 203 Centrally Protected Monuments of Gujarat by district with direct links to Wikimedia Commons photo archives.
* **Tab 3 — All-India ASI National Registry:** Paginated browser across all 3,936 National Monuments with instant state search and CSV downloads.
* **Tab 4 — Dataset Sufficiency Audit:** Complete engineering analysis on why small datasets fail in the field and how this multi-tier architecture solves it.
* **National Census Modal:** State-by-state breakdown of 19.64 Lakhs heritage records.

👉 **To view:** Simply open `index.html` or `INDIAN_HERITAGE_DATASET.html` in any web browser.

---

## 👁️ Computer Vision & Retrieval Pipelines

### 1. Two-Stage Geofenced Landmark Retrieval
* Located in: [`pipelines/google_landmarks_v2_india_bridge.py`](pipelines/google_landmarks_v2_india_bridge.py)
* **Stage A (Geofencing Pre-Filter):** Uses the Haversine formula on GPS coordinates to filter monuments within a 25km radius, reducing the candidate search space from 3,936 monuments down to <10 local candidates.
* **Stage B (Contrastive Visual Inference):** Matches camera embeddings using **SigLIP** (`google/siglip-base-patch16-384`) or **DINOv2** (`facebook/dinov2-small`) for fine-grained architectural recognition in under 30ms.

### 2. Edge Mobile Deployment
* Optimized for **MobileNetV4** on Android NPU for offline, low-battery tourist camera recognition.

---

## 📂 Repository Structure

```
SIH-THE-CODER-CULT/
├── README.md                                 # This master documentation
├── index.html                                # Interactive standalone Web Viewer
├── INDIAN_HERITAGE_DATASET.html              # Mirrored Dashboard
├── asi_national_heritage_registry_3696.csv   # Root download link
├── gujarat_heritage_atlas_exhaustive.csv     # Root download link
│
├── dataset/                                  # Complete Core Datasets
│   ├── asi_national_heritage_registry_3696.csv
│   ├── asi_national_heritage_registry_3696.json
│   ├── gujarat_heritage_atlas_exhaustive.csv
│   ├── gujarat_heritage_atlas_exhaustive.json
│   ├── indian_heritage_dataset.csv
│   ├── indian_heritage_dataset.json
│   ├── national_heritage_lakhs_census.csv
│   ├── dataset_master_matrix.csv
│   ├── monuments_50_master_matrix.csv
│   └── cv_training_augmentation_spec.json
│
├── pipelines/                                # AI/ML Computer Vision Engines
│   ├── google_landmarks_v2_india_bridge.py   # 2-Stage Geofenced Vision Pipeline
│   └── prototype_vector_pipeline.py          # SigLIP/DINOv2 Contrastive Matcher
│
└── docs/                                     # Research & Engineering Audits
    └── SIH2026_HERITAGE_RESEARCH_REPORT.md   # Publication-Grade Defense Document
```

---

## 🏛️ Official Data Sources & Attribution
* **Archaeological Survey of India (ASI)** — Ministry of Culture, Government of India.
* **National Mission on Monuments and Antiquities (NMMA)** — Built Heritage & Antiquities Database.
* **UNESCO World Heritage Centre** — State of Conservation and Inscription Dossiers.
* **Wikimedia Commons** — Wiki Loves Monuments India photo repositories.
* **OpenStreetMap (OSM)** — Geocoded heritage nodes.

---
*Developed for Smart India Hackathon 2026 | Team THE CODER CULT*
