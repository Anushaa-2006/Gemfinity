# 💎 Gemfinity – Jewellery Savings Scheme Mobile App

Gemfinity is a cross-platform mobile application and backend ecosystem designed for jewellery retailers and customers to digitize traditional monthly jewellery savings schemes (Gold/Silver chit funds).

---

## 🌟 Key Features
- **User Authentication:** Secure JWT & Firebase authentication flow.
- **Scheme Enrollment Engine:** Flexible 11-month savings plans with retailer bonus contribution.
- **Razorpay Sandbox Integration:** Native mobile checkout with server-side signature verification.
- **Interactive Savings Dashboard:** Circular progress indicators, benchmark 22K gold weight accumulator, and next due date countdown.
- **Scheme Collections:** Group individual family chit funds into named sets (e.g., *"Bridal Gold Savings Plan"*).
- **Rewards & Loyalty Store:** Earn +100 points per timely monthly payment, upgrade tier status (Bronze → Silver → Gold → Platinum), and redeem making charge discount vouchers.
- **Dynamic QR Purity Certificate Generator:** Automatic cryptographic 22K 916 BIS Hallmarked certificate creation on scheme maturity.
- **Bilingual Multi-Language Support:** Instant runtime switching between **English (EN)** and **Tamil (ТА)**.
- **Minimalist Theme System:** Champagne Gold & Deep Slate Green theme with soft neumorphic interface cards.

---

## 🛠️ Tech Stack & Specifications
* **Frontend Mobile App:** React 18, Vite, Lucide Icons, QRCode SVG, `react-i18next`.
* **Backend API:** Node.js (v18+), Express.js, SQLite / PostgreSQL / MySQL, JWT, bcryptjs.
* **Payment Gateway:** Razorpay API (Sandbox Mode).
* **Database & Hosting:** Render / Heroku (Backend Free Tier), Railway / ClearDB (Database).

---

## 🚀 Quick Start Guide

### 1. Launch Backend API Server
```bash
cd gemfinity-backend
npm install
npm start
```
* Backend runs at: `http://localhost:5000`
* Pre-seeded Demo Account: `ananya@gemfinity.com` / `gemfinity123`

### 2. Launch Mobile App Interface
```bash
cd gemfinity-mobile
npm install
npm run dev
```
* Mobile App Web Preview runs at: `http://localhost:3000`

---

## 📜 Resume-Friendly Summary
> "Developed **Gemfinity**, a cross-platform mobile app for jewellery retailers to digitize customer savings schemes, featuring Razorpay sandbox payments, loyalty rewards, QR-based purity certificates, and collections. Built with React Native, Node.js, Express, and MySQL/PostgreSQL, deployed on Heroku/Render free tier."
