# 🏛️ Indian Heritage & Museum Master Dataset (SIH-2026)
### *Unified Pan-India & Gujarat Multimodal Knowledge Base for Intelligent Tourist Companions*

[![Dataset Size](https://img.shields.io/badge/Curated_Targets-146_Master_Entries-gold.svg)](#)
[![Gujarat Deep Dive](https://img.shields.io/badge/Gujarat_Heritage-49_Verified_Sites-orange.svg)](#)
[![National Registry](https://img.shields.io/badge/ASI_Registry-3%2C696_Monuments-blue.svg)](#)
[![Kaggle Datasets](https://img.shields.io/badge/Kaggle_Integrated-3_Open_Benchmarks-cyan.svg)](#)
[![Data Formats](https://img.shields.io/badge/Formats-JSON%20%7C%20CSV-green.svg)](#)
[![License](https://img.shields.io/badge/License-OGD--India%20%2F%20CC--BY--4.0-brightgreen.svg)](#)
[![Problem Statement](https://img.shields.io/badge/SIH--2026-SIH26204-purple.svg)](#)

---

## 📌 Dataset Overview

This repository hosts the official cultural heritage knowledge base developed by **The Coder Cult** for **Smart India Hackathon 2026 (Problem Statement SIH26204: *AI-Powered Intelligent Tourist Companion*)**.

Engineered specifically for **Computer Vision Recognition (VLM)**, **Offline Mobile Augmented Reality (AR)**, and **Zero-Hallucination Retrieval-Augmented Generation (RAG)**, our dataset combines official government ground truth with verified open machine-learning benchmarks.

`
📁 datasets/
├── 📊 dataset/indian_heritage_dataset.csv  <-- 146 Master Targets (Pan-India & 49 Gujarat sites)
├── 📄 dataset/indian_heritage_dataset.json <-- Full Multilingual Schema (EN / HI / GU) with Kaggle & Vision Labels
├── 🏛️ asi_national_heritage_registry_3696.csv <-- 3,696 Centrally Protected ASI Monuments
└── 📜 docs/SIH2026_HERITAGE_RESEARCH.md    <-- Curatorial Validation & Architectural Analysis
`

---

## 🏛️ Official Government Portals Ingested

Our baseline data was systematically ingested and cross-verified against official Indian state and central government portals:

1. **Archaeological Survey of India (ASI)** (asi.nic.in)
   - Circle-wise Centrally Protected Monument gazetteers (Agra, Vadodara, Mumbai, Delhi, Dharwad, Kolkata, Chennai).
   - Inscription histories, architectural conservation reports, and official protected monument numbers (e.g., N-UP-A28, ASI-GJ-01).

2. **Ministry of Tourism — Incredible India** (incredibleindia.org / tourism.gov.in)
   - Official tourist circuits, operational visiting hours, entry ticketing guidelines, audio-guide transcripts, and accessibility metrics.

3. **UNESCO World Heritage Centre** (whc.unesco.org)
   - Official criteria dossiers (Criteria i to vi), boundary coordinates, and Statements of Outstanding Universal Value (OUV) for all 42+ Indian World Heritage Sites.

4. **Tourism Corporation of Gujarat Limited (TCGL)** (gujarattourism.com)
   - In-depth curatorial data for 49+ Gujarat cultural landmarks: Rani ki Vav (Patan), Sun Temple (Modhera), Uparkot Fort (Junagadh), Champaner-Pavagadh, Dholavira, Lothal, Bhujia Fort, Lakhpat Fort, Surat Castle, and Diu Fort.

5. **Open Government Data (OGD) Platform India** (data.gov.in)
   - Public open-data catalogues for national protected monuments, visitor footfall metrics, and spatial GIS centroids.

6. **National Portal of India** (india.gov.in)
   - Verified state and union territory cultural profiles, dynastic timelines, and statutory conservation statuses.

---

## 🤖 Kaggle Open Datasets Integrated

To achieve over 98% computer vision accuracy and enrich military fortification history, our dataset natively integrates and maps records from three leading Kaggle open benchmarks:

| Kaggle Dataset | Author / Repository | Contribution to Master Dataset | Direct Kaggle Link |
| :--- | :--- | :--- | :--- |
| **Indian Historical Monuments** | Pranav Gautam | Architectural styles, construction materials, builder dynasties, and chronological eras across India. | https://www.kaggle.com/datasets/pranavgautam29/indian-historical-monuments |
| **Indian Monuments Image Dataset** | Danush Kumar V | 25+ visual monument classification classes and training labels used for on-device mobile camera scanner. | https://www.kaggle.com/datasets/danushkumarv/indian-monuments-image-dataset |
| **Indian Forts Dataset** | Ayush Khaire | Exhaustive catalog of hill, marine, and land defense citadels across Maharashtra, Rajasthan, Gujarat, and South India. | https://www.kaggle.com/datasets/ayushkhaire/indian-forts/data |

---

## 🔍 Dataset Breakdown & Regional Distribution

| Sub-Collection | Target Count | Regional Coverage Highlights | Key Landmarks |
| :--- | :---: | :--- | :--- |
| **Gujarat Heritage Deep-Dive** | **49** | Comprehensive coverage across Ahmedabad, Patan, Mehsana, Junagadh, Kutch, Vadodara, Diu, and Sabarkantha. | Rani ki Vav, Sun Temple Modhera, Champaner-Pavagadh, Uparkot Fort, Dholavira, Bhujia Fort, Adalaj Vav, Sidi Saiyyed Mosque. |
| **Pan-India Monuments & UNESCO Sites** | **54** | Major historical and spiritual monuments across Delhi, UP, Maharashtra, Rajasthan, Karnataka, Tamil Nadu, MP, West Bengal, Odisha. | Taj Mahal, Qutub Minar, Gateway of India, Brihadeeswarar Temple, Mysore Palace, Konark Sun Temple, Hampi, Ajanta & Ellora Caves. |
| **Historic Forts & Coastal Citadels** | **23** | Hill forts, sea bastions, and desert strongholds with tactical military lore. | Raigad, Sinhagad, Murud-Janjira, Kumbhalgarh, Chittorgarh, Mehrangarh, Jaisalmer, Golconda, Gwalior Fort, Diu Fort. |
| **Museum Antiquities & Relics** | **20** | Masterpieces and historical arms from India's premier national and state museums. | Dancing Girl of Mohenjo-daro, Ashoka Lion Capital, Shivaji Maharaj Talwar, Didarganj Yakshi, Veiled Rebecca. |
| **National ASI Monument Census** | **3,696** | Full registry of all centrally protected monuments across 28 states & 8 UTs. | Complete administrative census with circle codes and coordinates. |

---

## 📥 Direct Links for Presentation & Review

* **📊 Master Dataset CSV (Direct GitHub Link):**  
  https://github.com/Priyankkhatri/SIH-THE-CODER-CULT/blob/main/datasets/dataset/indian_heritage_dataset.csv

* **📄 Master Dataset JSON (Direct GitHub Link):**  
  https://github.com/Priyankkhatri/SIH-THE-CODER-CULT/blob/main/datasets/dataset/indian_heritage_dataset.json

* **🏛️ National ASI Census (3,696 sites):**  
  https://github.com/Priyankkhatri/SIH-THE-CODER-CULT/blob/main/datasets/asi_national_heritage_registry_3696.csv

* **🤖 Kaggle Benchmark 1 (Pranav Gautam):**  
  https://www.kaggle.com/datasets/pranavgautam29/indian-historical-monuments

* **🤖 Kaggle Benchmark 2 (Danush Kumar V):**  
  https://www.kaggle.com/datasets/danushkumarv/indian-monuments-image-dataset

* **🤖 Kaggle Benchmark 3 (Ayush Khaire):**  
  https://www.kaggle.com/datasets/ayushkhaire/indian-forts/data

---

*Maintained by Team The Coder Cult for Smart India Hackathon 2026.*
