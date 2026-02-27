<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/rocket.svg" width="80" height="80" alt="Sales Reward Engine Logo">
  
  # Sales Reward Engine
  
  **An Enterprise-Grade Sales Performance & Incentive Management Platform**
  
  [![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.0-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Java 21](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

  <p align="center">
    Automate commissions, simulate incentives, and empower your sales team with an unparalleled user experience.
  </p>
</div>

---

## ✨ Overview

The **Sales Reward Engine** is a cutting-edge platform designed to revolutionize how organizations manage sales commissions. Built with a stunning **Premium Glassmorphic UI**, it bridges the gap between complex backend incentive calculations and a delightful, seamless frontend experience.

Whether you're a **Sales Representative** tracking your lifetime earnings or a **Global Administrator** configuring sophisticated tier-based policies, this engine delivers real-time analytics with enterprise-level security.

---

## 🚀 Key Features

### 🛡️ For Administrators
- **Dynamic Policy Configuration:** Create, edit, and apply advanced commission rules (Flat rate, Tiered, Performance-based).
- **Automated Workflow Approvals:** One-click Deal approvals with real-time payout calculations.
- **Platform Analytics & Governance:** Monitor global metrics, audit logs, and manage user roles seamlessly.
- **Enterprise Settings:** Toggle maintenance modes, configure notification thresholds, and manage system-wide parameters.

### 💼 For Sales Executives
- **Real-Time Performance Dashboards:** Track "Pending Payouts", "Lifetime Earnings", and "Average Deal Sizes" via incredibly detailed charts.
- **Incentive Simulator (What-If Analysis):** Predict commissions before closing a deal using live active policies.
- **Intelligent Leaderboards:** Gamify the sales process with beautifully designed ranking interfaces.
- **Instant Deal Submission:** A frictionless intake form with smart categorization for Upsells, Renewals, and New Business.

---

## 💻 Tech Stack

### Frontend (Client)
The user interface is engineered for high performance and aesthetic excellence.
- **Core Framework:** React 18 + Vite
- **Styling:** Tailwind CSS (featuring custom Aurora meshes, Hyper-Glass panels, and seamless Dual-Theme support)
- **Data Visualization:** Recharts (Responsive Pie & Line charts)
- **Routing:** React Router v6
- **Icons:** Lucide-React & Heroicons

### Backend (Server)
A robust, secure, and scalable foundation.
- **Core Framework:** Java 21 + Spring Boot 3
- **Data Persistence:** Spring Data JPA + PostgreSQL (H2 for local development)
- **Security:** Spring Security + JWT Authentication
- **Build Tool:** Gradle

---

## ⚙️ Quick Start Guide

Get the Sales Reward Engine running locally in just a few steps.

### Prerequisites
- Node.js (v18+)
- Java JDK 21+
- Gradle (Included via wrapper)

### 1. Launch the Spring Boot Backend

Open your terminal and navigate to the backend directory:

```bash
cd SalesIncentiveSystem
```

Run the application:
```bash
# macOS / Linux
./gradlew bootRun

# Windows
gradlew.bat bootRun
```
*The API will be live at `http://localhost:8080`*

### 2. Launch the React Frontend

Open a **new terminal window** and navigate to the frontend:

```bash
cd frontend
```

Install the dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*The beautiful UI will be live at `http://localhost:5173`*

---

## 🔐 Demo Credentials

The platform features Role-Based Access Control (RBAC). Use these credentials to explore the different interfaces:

| Role | Email Address | Password |
| :--- | :--- | :--- |
| **Global Admin** | `admin@test.com` | `password` |
| **Sales Rep** | `sales@test.com` | `password` |

---

## 🎨 Design Philosophy

### The "Aurora Glass" UI
This platform abandons boring, traditional dashboard designs. It utilizes:
1. **Dynamic Ambient Backgrounds**: Slow-moving, code-generated aurora blobs that breathe life into the application.
2. **True Glassmorphism**: Cards feature strict translucent backgrounds, precise borders, and layered background blurs.
3. **Flawless Dark Mode Integration**: Every shadow, text color, and gradient perfectly adapts whether the user prefers light or dark themes.

---

## 📁 Repository Structure

```tree
Sales-Reward-Engine/
├── frontend/
│   ├── src/
│   │   ├── components/      # Glass cards, Custom Charts, Forms, Tables
│   │   ├── layouts/         # Role-specific Wrappers (Admin & Sales)
│   │   ├── pages/           # Logic-heavy views (Simulator, Performance)
│   │   └── context/         # Global App State (Auth, Sales Data, Theme)
│   └── index.css            # Custom animations & global variables
│
└── SalesIncentiveSystem/
    ├── src/main/java/org/example/salesincentivesystem/
    │   ├── controllers/     # RESTful API endpoints
    │   ├── models/          # JPA Entities (Deals, Users, Policies)
    │   ├── security/        # JWT & CORS configuration
    │   └── services/        # Business Logic & Commission Math
    └── application.yml      # DB & Server configuration
```

---

<div align="center">
  <p>Built with ❤️ for High-Performing Sales Teams.</p>
</div>
