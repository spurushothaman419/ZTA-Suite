# ZTA-Suite

## Zero Trust Architecture Maturity Assessment Tool

A comprehensive web application for conducting Zero Trust Architecture (ZTA) maturity assessments following the CISA Zero Trust Maturity Model (ZTMM) methodology.

## 🌐 Live Application

**URL:** https://spurushothaman419.github.io/ZTA-Suite/

✅ **No server required** - The app runs entirely on GitHub Pages!

---

## 🏗️ Hosting Architecture

| Component | Service | Cost |
|-----------|---------|------|
| **Frontend (React App)** | GitHub Pages | Free |
| **Backend (Database & Auth)** | Supabase | Free tier |
| **CI/CD Pipeline** | GitHub Actions | Free |
| **Domain** | GitHub | Free |

### How It Works
1. **GitHub Pages** serves your static files (HTML, CSS, JS)
2. **Supabase** handles authentication and database (cloud service)
3. **No server to manage** - everything is serverless!
4. **Auto-deployment** - Every push to `main` triggers automatic deployment

---

## ✨ Features

### ZTMM Assessment (8 Pillars)
- **Identity** - User and entity identity management
- **Devices** - Device security and compliance
- **Networks** - Network segmentation and security
- **Applications & Workloads** - Application security
- **Data** - Data protection and classification
- **Visibility & Analytics** - Security monitoring and analytics
- **Automation & Orchestration** - Security automation
- **Governance & Compliance** - Policy and compliance management

### Maturity Levels
- 🔴 Traditional (Level 1)
- 🟠 Initial (Level 2)
- 🟡 Advanced (Level 3)
- 🟢 Optimal (Level 4)

### Visualization & Charts
- **Spider/Radar Charts** - Overall maturity assessment visualization
- **Individual Pillar Charts** - Detailed analysis per pillar
- **Maturity Distribution** - Bar charts showing level distribution
- **Gap Analysis** - Current vs target state comparison

### Task Management
- Create implementation tasks for each pillar
- Track progress with status updates (To Do, In Progress, Done)
- Prioritize tasks (High/Medium/Low)
- Link tasks to specific assessments

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Icons**: Lucide React
- **Deployment**: GitHub Pages + GitHub Actions

---

## 🚀 Deployment

### Automatic Deployment
The app automatically deploys to GitHub Pages when you push to the `main` branch.

### GitHub Actions Workflow
Located at `.github/workflows/deploy.yml`:
- Triggers on push to `main`
- Installs dependencies
- Builds production bundle
- Deploys to GitHub Pages

### Required GitHub Secrets
Add these in **Settings → Secrets and variables → Actions → Repository secrets**:

| Secret Name | Description |
|-------------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/spurushothaman419/ZTA-Suite.git
cd ZTA-Suite

# Install dependencies
npm install

# Create .env file with Supabase credentials
cat > .env << EOF
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
EOF

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📊 Database Schema

### Tables
| Table | Description |
|-------|-------------|
| `profiles` | User profiles linked to auth |
| `assessments` | ZTMM assessments with pillar scores |
| `tasks` | Implementation tasks linked to assessments |

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Policies enforce data isolation

---

## 🔒 Security Features

- ✅ Supabase Authentication (Email/Password)
- ✅ Row Level Security on all tables
- ✅ HTTPS enforced on GitHub Pages
- ✅ Environment variables for sensitive data
- ✅ No server-side code to maintain

---

## 📝 License

MIT License

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with ❤️ for Zero Trust security practitioners
