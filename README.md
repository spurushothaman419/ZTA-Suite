# ZTA-Suite

## Zero Trust Architecture Maturity Assessment Tool

A comprehensive web application for conducting Zero Trust Architecture (ZTA) maturity assessments following the CISA Zero Trust Maturity Model (ZTMM) methodology.

## 🚀 Live Demo

**[Access the Application](https://work-1-ikuulrlrqhzpiwgg.prod-runtime.all-hands.dev)**

## ✨ Features

- **Project Management** - Create and manage ZTA assessment projects
- **Phase Tracking** - Track progress through 6 assessment phases (0-5)
- **CISA ZTMM Pillars** - Assess all 7 Zero Trust pillars:
  - Identity
  - Device
  - Network
  - Application/Workload
  - Data
  - Visibility & Analytics
  - Automation & Orchestration
- **RAID Log** - Track Risks, Assumptions, Issues, and Dependencies
- **Stakeholder Management** - Manage project stakeholders and RACI matrix
- **Evidence Tracking** - Document and track assessment evidence
- **Roadmap Planning** - Create implementation roadmaps

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Row Level Security)
- **Build Tool**: Vite
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/spurushothaman419/ZTA-Suite.git
   cd ZTA-Suite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 📄 License

MIT
