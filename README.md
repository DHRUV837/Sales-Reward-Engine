<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/rocket.svg" width="100" height="100" alt="Sales Reward Engine Logo">

  # Sales Reward Engine

  **An Enterprise-Grade Sales Performance & Incentive Management Platform**

  A modern, full-stack incentive tracking system for high-performing sales organizations.

  [![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
  [![Java 21](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

  <br />
</div>

---

## 🌐 Live Demo

🚀 **[Try Sales Reward Engine Live →](#)** *(Deployment Links Coming Soon)*

| Component | URL |
| :--- | :--- |
| 🖥️ **Frontend** | `sales-reward-engine.vercel.app` *(Pending)* |
| ⚙️ **Backend API** | `sales-reward-api.onrender.com` *(Pending)* |
| 🗄️ **Database** | AWS RDS PostgreSQL |

> ☕ **First time visiting?** Our backend server takes a power nap when no one's around! 
> Give it ~1 minute to wake up, stretch, and load your dashboard. 😴➡️🚀

### Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| 👨‍💼 **Global Admin** | `admin@test.com` | `password` |
| 🧑‍💻 **Sales Executive** | `sales@test.com` | `password` |

---

## 📋 Overview

The **Sales Reward Engine** is a comprehensive, enterprise-grade incentive calculation solution designed for modern sales teams. It provides real-time commission tracking, predictive incentive simulations, automated deal approvals, and stunning performance analytics—all wrapped in a highly advanced dual-theme **"Aurora Glass"** UI.

---

## ✨ Key Features

- 🎯 **Advanced Incentive Calculation** - Support for Flat Rate, Tiered, and Performance-multiplier policies.
- 📊 **Real-Time Analytics Dashboard** - Revenue tracking, live Payout metrics, and interactive Performance Trends.
- 🔮 **What-If Simulator** - Allow sales reps to accurately predict commissions before officially closing a deal.
- 🏪 **Deal Lifecycle Management** - Automated workflows from submission to approval, complete with categorization (Upsell, Renewal, New Business).
- 🌓 **Dual-Theme "Aurora Glass" UI** - A premium, visually stunning interface supporting both strict Light and deep Dark modes seamlessly.
- 👥 **Role-Based Access Control** - Distinct permissions and interfaces for Sales Executives vs. Global Administrators.

---

## 🏗️ Tech Stack

### Frontend Architecture

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | 18.2 | Core UI Framework |
| **Vite** | 5.0 | High-speed Build Tool |
| **TailwindCSS** | 3.4 | Utility-first Styling & Glassmorphism |
| **Recharts** | 2.12 | Interactive Charts & Analytics |
| **Lucide React**| 0.3 | Premium SVG Iconography |
| **Axios** | 1.6 | Asynchronous HTTP requests |

### Backend Architecture

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Spring Boot**| 3.2 | Core Backend Framework |
| **Java** | 21 | High-performance Language |
| **Spring Sec.**| 6.2 | Role-based Auth & Cryptography |
| **Spring JPA** | 3.2 | Database ORM |
| **PostgreSQL** | 16 | Primary Relational Database |
| **H2 Database**| - | In-memory dev/testing DB |
| **JWT** | 0.11 | Secure Token Authentication |

---

## 📁 Project Structure

```text
Sales-Reward-Engine/
├── frontend/                 # High-Performance React UI
│   ├── src/
│   │   ├── api/             # Axios interceptors & service logic
│   │   ├── components/      # Glass cards, Custom Charts, Forms, Tables
│   │   ├── layouts/         # Role-specific Layouts (Admin vs Sales)
│   │   ├── pages/           # Logic-heavy views (Simulator, Dashboard)
│   │   ├── context/         # Centralized Auth & Theme Context
│   │   └── index.css        # Global Aurora meshes & hyper-glass styles
│   └── package.json
│
├── SalesIncentiveSystem/    # Robust Spring Boot REST API
│   ├── src/main/java...
│   │   ├── config/          # JWT, CORS, & App Configurations
│   │   ├── controllers/     # Secure REST API Endpoints
│   │   ├── models/          # JPA Entities (Policies, Deals, Users)
│   │   └── services/        # Business Logic & Commission Math
│   └── build.gradle
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ and npm
- **Java**: JDK 21+
- **Gradle**: (Optional, wrapper included)

### ⚙️ Backend Setup

1. **Navigate to the Backend**
   ```bash
   cd SalesIncentiveSystem
   ```
2. **Launch the Spring Boot App**
   *(Uses H2 in-memory DB by default for zero-config startup)*
   ```bash
   # macOS / Linux
   ./gradlew bootRun

   # Windows
   gradlew.bat bootRun
   ```
   *The backend mounts at: `http://localhost:8080`*

### 🖥️ Frontend Setup

1. **Navigate to the Frontend**
   ```bash
   cd frontend
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   *The stunning UI mounts at: `http://localhost:5173`*

---

## 👥 User Roles & Permissions

| Role | Permissions | Available Modules |
| :--- | :--- | :--- |
| **Global Admin** | Full system control. Approve/Reject all deals. Create incentive logic. Manage users. | *Policy Settings, System Audit, Deal Approval, User Management* |
| **Sales Rep** | Submit deals, run simulations, view personal earnings, access leaderboards. | *My Dashboard, Deal Intake, What-If Simulator, My Payouts* |

---

## 📈 Core Modules

### 1. The Command Center (Dashboard)
- Bird's-eye view of organization-wide or personal metrics.
- Animated, real-time counter displays.
- Quick-access action buttons.

### 2. The Incentive Engine
- Administer flat rate, tiered, or multiplier policies.
- Automatically calculate payouts upon deal approval.
- Assign active policies instantly securely.

### 3. Deal & Payout Management
- Frictionless deal submission forms.
- One-click approvals for Administrators.
- Beautiful *Earnings Breakdowns* with interactive Recharts.

---

## 👨‍💻 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <p>Built with ❤️ for modern, high-performing sales teams.</p>
</div>
