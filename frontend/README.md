# OpsPulse Frontend | SpaceX-Inspired Incident Response Dashboard

OpsPulse is a high-performance, real-time incident response and system monitoring dashboard. The frontend is built with a focus on visual excellence, featuring a "SpaceX-inspired" aesthetic: pure black (`#000000`), signal white (`#f0f0fa`), and extreme minimalist UI patterns.

## 🚀 Key Features

- **Real-time Incident Monitoring**: Live feed of active incidents with severity and status tracking.
- **System Health Overview**: Micro-monitoring of services (Payment, Auth, DB, API) with uptime metrics.
- **Analytics & Trends**: Interactive charts visualizing incident volume and resolution performance.
- **AI-Powered Insights**: Contextual recommendations and anomaly detection based on system metrics.
- **Auth & Access Management**: Secure login/signup with OTP verification and granular API key management.
- **Boot Animation**: High-fidelity system initialization sequence using GSAP.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://reactjs.org/) + [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (Layout) + [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) (Design System)
- **State Management**: 
  - [Redux Toolkit](https://redux-toolkit.js.org/) (Dashboard data, API Keys)
  - [React Context](https://react.dev/learn/passing-data-deeply-with-context) (Authentication)
- **Animations**: [GSAP](https://gsap.com/) (Boot sequences) + [Framer Motion](https://www.framer.com/motion/) (UI transitions)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)

## 📂 Project Structure

```text
frontend/
├── src/
│   ├── app/                # Global store, routing, and core App component
│   ├── features/           # Domain-driven features
│   │   ├── auth/           # Login, Signup, OTP, Auth Context
│   │   ├── dashboard/      # Main monitoring view, hooks, slices
│   │   │   ├── components/ # View-specific components (Cards, Tables, Charts)
│   │   │   ├── service/    # Backend API abstraction (Dashboard, Incidents, Health)
│   │   │   └── hooks/      # Data fetching and transformation hooks
│   │   ├── public-pages/   # Landing, Terms, About
│   │   └── shared/         # Reusable UI components (Badges, Buttons, etc.)
│   ├── assets/             # Global styles and static assets
│   └── main.jsx            # Application entry point
├── public/                 # Static public assets (Fonts, Icons)
└── index.html              # HTML shell
```

## 🚥 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `frontend` root:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

### Development

Run the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### Build

Build for production:
```bash
npm run build
```
The production-ready files will be generated in the `dist` folder.

## 🎨 Design System

The project adheres to a strict "SpaceX" design language (defined in `DESIGN.md`):

- **Colors**:
  - Primary: `#000000` (Deep Space)
  - Text: `#f0f0fa` (Signal White)
  - Accents: Low-opacity borders and subtle glows (`rgba(255, 255, 255, 0.07)`).
- **Typography**: 
  - **Bebas Neue**: Main headings and technical readouts (industrial, geometric feel).
  - **Barlow Condensed**: Secondary labels and body text (high-density information).
- **Visual Style**: Extreme minimalism, zero shadows, no background containers, scanlines, and high-contrast typography.

## 🔌 API Integration

The frontend is fully integrated with the OpsPulse backend. Data fetching and state management are handled through a dedicated service layer and Redux thunks.

- **Service Layer**: Abstractions in `src/features/dashboard/service/` handle all REST requests to:
  - `dashboard.service.js`: Stats and trends.
  - `incident.service.js`: Incident CRUD operations.
  - `health.service.js`: Service monitoring and uptime.
  - `apiKey.service.js`: Key lifecycle management.
- **State Management**: Redux Toolkit manages global data states with granular loading and error flags.
- **Data Hook**: The `useDashboardData` hook transforms raw backend responses into UI-ready formats (mapping IDs, resolving icons, and normalizing chart data).

## 🛡️ License

This project is proprietary and confidential.
