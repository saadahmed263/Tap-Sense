# 🧠 TapSense - UX Emotion & Behavior Tracker

> **Real-time UX emotion tracking, click interaction mapping, and scroll depth analytics using Google MediaPipe and React.**

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![React](https://img.shields.io/badge/React-18-61DAFB.svg?style=flat&logo=react) ![Vite](https://img.shields.io/badge/Vite-Fast-646CFF.svg?style=flat&logo=vite) ![Privacy](https://img.shields.io/badge/Privacy-100%25_Local-green.svg)

TapSense is a lightweight, browser-based research tool designed for UX Designers and Researchers. It uses computer vision (Google MediaPipe) to track user emotions, interactions, and scroll behavior during prototype testing—all without requiring a backend or expensive API keys.

---

## ✨ Features

* **🎭 Real-Time Emotion Detection:** Instantly detects micro-expressions (Delight, Frustration, Confusion, Surprise) using 478 distinct facial landmarks.
* **🖱️ Click Heatmaps:** visualizes exactly where users tap or click on your prototype with numbered interaction pins.
* **📜 Scroll Depth Analytics:** Automatically tracks how far users scroll down your designs.
* **🔒 Privacy-First Architecture:** All processing happens locally in the user's browser. No video data is ever sent to a server.
* **📄 Instant PDF Reports:** Generates a comprehensive session summary with one click, ready for stakeholder presentations.

---

## 🛠️ Tech Stack

* **Core:** React + Vite (Fast HMR & build)
* **AI Engine:** Google MediaPipe Tasks Vision (Face Landmarker)
* **Icons:** Lucide React
* **Deployment:** GitHub Pages
* **Storage:** In-memory (Session based)

---

## 🚀 Quick Start

You can run this project locally in minutes.

### Prerequisites
* Node.js installed on your machine.

### Installation

```bash
# 1. Clone the repository
git clone [https://github.com/saadahmed263/Tap-Sense.git](https://github.com/saadahmed263/Tap-Sense.git)

# 2. Enter the directory
cd Tap-Sense

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev