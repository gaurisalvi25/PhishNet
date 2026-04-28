PhishNet is a lightweight machine learning-based Chrome extension that detects phishing websites in real-time using URL, textual (TF-IDF), and HTML structure features.

🔹 2. README.md (Full Professional Version)

You can copy this directly 👇

🛡️ PhishNet – Real-Time Phishing Detection System

PhishNet is a lightweight machine learning-based browser defense system designed to detect phishing websites in real time. It combines URL analysis, textual feature extraction, and HTML structure inspection to improve detection accuracy while maintaining low latency.

🚀 Features
🔍 Real-time phishing detection
🌐 Chrome extension integration
⚡ Lightweight and fast (CPU-based)
🧠 Machine Learning model (Random Forest)
🧾 Hybrid feature extraction:
URL-based features
TF-IDF textual features
HTML structure analysis
🔒 Privacy-preserving (no sensitive data stored)
🧠 How It Works
User opens a website
Chrome extension captures the URL
URL is sent to Flask backend
Features are extracted (URL + Text + HTML)
Random Forest model predicts result
Output shown as Safe / Phishing
🏗️ Tech Stack
Frontend: Chrome Extension (JavaScript, HTML, CSS)
Backend: Flask (Python)
Machine Learning: Scikit-learn
Feature Extraction: TF-IDF
Libraries: Pandas, NumPy
📊 Model Details
Algorithm: Random Forest
Accuracy: ~96%
Optimized for low latency and real-time prediction
