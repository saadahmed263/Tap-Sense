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
```
---

## 📖 How to Use

1.  **Launch:** Open the app in your browser.
2.  **Permissions:** Allow camera access (required for emotion tracking).
3.  **Upload UI:** Click "Upload UI" to select a long screenshot of the website/app you are testing.
4.  **Start Testing:** Click "Start Testing".
    * The app will track your face in the background.
    * Interact with the design (click, scroll, react).
5.  **Generate Report:** When finished, click **"Stop & Generate Report"**.
    * You will see a dashboard with your emotion metrics, click map, and timeline.
    * Click the **Print** icon to save it as a PDF.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ by [Saad Ahmed](https://github.com/saadahmed263)**