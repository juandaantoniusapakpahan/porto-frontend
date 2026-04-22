# porto-frontend

Portfolio Frontend built with **React 19 + TypeScript + Vite**, featuring a public portfolio view and a protected dashboard for managing portfolio content.

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript 6 |
| UI Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 3 |
| State Management | Zustand |
| Routing | React Router DOM 6 |
| Form Handling | React Hook Form + Zod |
| HTTP Client | Axios |
| Animation | Framer Motion |
| Drag & Drop | dnd-kit |
| Notifications | React Hot Toast |
| Icons | Lucide React |

## Features

- **Public Portfolio Page**: View any user's portfolio at `/:username`
- **Auth**: Login, Register, GitHub OAuth2 callback
- **Dashboard**: Protected area to manage all portfolio sections
  - Personal Info, Work Experience, Education
  - Skills, Projects, Certifications, Awards, Languages
  - Drag-and-drop reordering via dnd-kit
- **Auto Token Refresh**: Axios interceptor handles JWT refresh on 401
- **Responsive Design**: Mobile-friendly with Tailwind CSS

## Pages & Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/login` | Login page |
| `/signup` | Registration page |
| `/oauth/callback` | GitHub OAuth2 callback |
| `/dashboard` | Dashboard home (protected) |
| `/dashboard/personal-info` | Edit personal info |
| `/dashboard/experience` | Manage work experience |
| `/dashboard/education` | Manage education |
| `/dashboard/skills` | Manage skills |
| `/dashboard/projects` | Manage projects |
| `/dashboard/certifications` | Manage certifications |
| `/dashboard/languages` | Manage languages |

## Prerequisites

- Node.js 18+
- npm or yarn
- porto-backend running on `http://localhost:8080`

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8080
```

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend base URL | `http://localhost:8080` |

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

App runs at `http://localhost:5173`.

> Make sure `porto-backend` is running before starting the frontend.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── api/
│   ├── axios.ts              # Axios instance + JWT interceptors
│   └── services/             # API service functions (auth, portfolio, profile, public)
├── components/
│   ├── ui/                   # Reusable UI components (Button, Card, Modal, Input...)
│   ├── dashboard/            # Dashboard layout, sidebar, form sections
│   └── portfolio/            # Portfolio section components (Hero, Experience, Skills...)
├── hooks/                    # Custom hooks (useAuth, useScrollSpy, useIntersection)
├── pages/
│   ├── auth/                 # Login, Signup, OAuthCallback
│   ├── dashboard/            # Dashboard pages
│   └── LandingPage.tsx
├── store/                    # Zustand stores (authStore)
├── types/                    # TypeScript type definitions
└── utils/                    # Utility functions
```

## Build for Production

```bash
npm run build
```

Output is in the `dist/` folder. Serve with any static file server or configure your reverse proxy (nginx, etc.) to point to `dist/`.
