# 🏛️ Indian Heritage & Museum Master Dataset (SIH-2026)
### *Multimodal Benchmark & RAG Knowledge Base for Intelligent Tourist Companions*

[![Dataset Size](https://img.shields.io/badge/Curated_Targets-122_Master_Entries-gold.svg)](#)
[![National Registry](https://img.shields.io/badge/ASI_Registry-3%2C696_Monuments-blue.svg)](#)
[![Data Format](https://img.shields.io/badge/Formats-JSON%20%7C%20CSV-green.svg)](#)
[![License](https://img.shields.io/badge/License-OGD--India%20%2F%20CC--BY--4.0-brightgreen.svg)](#)
[![Problem Statement](https://img.shields.io/badge/SIH--2026-SIH26204-purple.svg)](#)

---

## 📌 Dataset Overview

This repository hosts the primary heritage knowledge base developed by **The Coder Cult** for **Smart India Hackathon 2026 (Problem Statement `SIH26204`: *AI-Powered Intelligent Tourist Companion*)**. 

Unlike generic tourism lists, this dataset is engineered specifically for **Computer Vision Recognition (VLM)**, **Offline Mobile Augmented Reality (AR)**, and **Zero-Hallucination Retrieval-Augmented Generation (RAG)**.

```
📁 datasets/
├── 📊 indian_heritage_dataset.csv        <-- 122 Curated Targets with Multi-Angle Visuals & Room Coordinates
├── 📄 indian_heritage_dataset.json       <-- Full Structured Multilingual Schema (EN / HI / GU)
├── 🏛️ asi_national_heritage_registry.csv <-- 3,696 Centrally Protected ASI Monuments
└── 📜 docs/SIH2026_HERITAGE_RESEARCH.md  <-- Curatorial Validation & Architectural Analysis
```

---

## 🔍 Dataset Breakdown & Coverage

| Sub-Collection | Target Count | Coverage Details | Key Examples |
| :--- | :---: | :--- | :--- |
| **National Monuments & UNESCO Sites** | **79** | Pan-India coverage with special depth in Gujarat, Western, Northern, and Southern heritage corridors. | Sidi Saiyyed Mosque, Rani ki Vav, Sun Temple Modhera, Konark, Hampi Chariot, Ellora Cave 16. |
| **Museum Antiquities & Relics** | **43+** | Masterpieces across National Museum Delhi, Salar Jung Hyderabad, Indian Museum Kolkata, CSMVS Mumbai, Baroda Museum, Calico Museum. | Dancing Girl (c. 2500 BCE), Veiled Rebecca, Ashoka Lion Capital, Shivaji Maharaj Talwar, Akota Bronzes. |
| **National ASI Monument Registry** | **3,696** | All centrally protected monuments across 28 states & UTs with ASI circle codes, districts, and coordinates. | Complete census of centrally declared heritage sites in India. |

---

## 📋 Schema & Metadata Fields

Each master target entry includes structured metadata across **14 distinct dimensions**:

```json
{
  "id": "nm-del-001",
  "name": "Dancing Girl of Mohenjo-daro",
  "name_hindi": "मोहनजोदड़ो की नर्तकी",
  "name_gujarati": "મોહેંજો-દડોની નર્તકી",
  "category": "museum_antiquity",
  "material_technique": "Lost-wax cast bronze (Copper-Tin alloy)",
  "period": "c. 2500 BCE (Mature Harappan Phase)",
  "dimensions": "10.5 cm height x 5 cm width",
  "location": {
    "institution": "National Museum, New Delhi",
    "gallery": "Harappan Gallery",
    "floor": "Ground Floor",
    "showcase": "Showcase 3",
    "coordinates": [28.6118, 77.2193]
  },
  "scannable_micro_features": [
    "24 bangles on left arm",
    "Tribhanga posture (three-bend stance)",
    "High coiffure bun hairstyle",
    "Cowrie shell necklace"
  ],
  "curatorial_audio_transcript": {
    "en": "Crafted around 2500 BCE using lost-wax casting, this 10.5 cm bronze statuette...",
    "hi": "लगभग 2500 ईसा पूर्व में लॉस्ट-वैक्स तकनीक से निर्मित यह 10.5 सेमी की कांस्य मूर्ति..."
  },
  "reference_photos": [
    "https://upload.wikimedia.org/.../Dancing_Girl_Mohenjo-daro.jpg",
    "https://upload.wikimedia.org/.../Dancing_Girl_Side_Profile.jpg"
  ]
}
```

---

## 🎯 Verification & Zero-Hallucination Benchmark

During live testing with local **Qwen 3.5 9B** on an NVIDIA RTX 3050 GPU:
* **Without Dataset Context (Zero-Shot):** The raw model hallucinated dates and architects (e.g. claiming Sidi Saiyyed Jali was built in 1960 by "Virendra Saiyyed").
* **With Our Dataset Context (RAG Augmented):** The model achieved **100% curatorial accuracy**, correctly recognizing exact 1572 CE construction, the Abyssinian general, and the IIM-A logo connection.

---

## 📥 Quick Data Access

* **Direct CSV Table View:** [View `indian_heritage_dataset.csv`](./dataset/indian_heritage_dataset.csv)
* **Direct JSON Schema View:** [View `indian_heritage_dataset.json`](./dataset/indian_heritage_dataset.json)
* **National ASI Registry (3,696 sites):** [View `asi_national_heritage_registry_3696.csv`](./asi_national_heritage_registry_3696.csv)

---
*Maintained by Team The Coder Cult for Smart India Hackathon 2026. Data sourced under the Open Government Data (OGD) Platform India & National Institutional Archives.*
