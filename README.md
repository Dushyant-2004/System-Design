# SysDesign AI

An AI-powered system design generator that creates complete, production-grade architectures from plain English descriptions. Built as a single Next.js application deployable to Vercel.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

## Features

- **AI-Powered Generation** — Groq API (LLaMA 3.3 70B) generates expert-level system designs in seconds
- **Dynamic Architecture Diagrams** — React Flow-based interactive diagrams that adapt to each system's unique flow, services, databases, and infrastructure
- **Download to PDF** — Export architecture diagrams as PDF with one click
- **8 Architecture Sections** — Microservices, databases, APIs, caching, load balancing, scaling, infrastructure, system flow
- **Design History** — MongoDB-backed dashboard with search and pagination
- **Modern Dark UI** — Glass morphism, gradient accents, animated globe, Framer Motion transitions
- **Serverless API Routes** — No separate backend; everything runs as Next.js App Router API routes
- **Vercel-Ready** — Single deploy, cached MongoDB connections for serverless

## Tech Stack

| Layer      | Technology                                         |
| ---------- | -------------------------------------------------- |
| Framework  | Next.js 15 (App Router), TypeScript                |
| Styling    | Tailwind CSS                                       |
| Diagrams   | React Flow                                         |
| Animations | Framer Motion, GSAP                                |
| Database   | MongoDB Atlas + Mongoose (serverless-cached)        |
| AI         | Groq API (LLaMA 3.3 70B)                           |
| PDF Export | html-to-image + jsPDF                              |
| Deployment | Vercel                                             |

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx                # Root layout + dark theme
│   ├── page.tsx                  # Home — hero, globe, generator form
│   ├── globals.css               # Global styles
│   ├── dashboard/page.tsx        # Design history with search
│   ├── design/[id]/page.tsx      # Design detail — diagram & breakdown
│   └── api/
│       ├── health/route.ts       # GET /api/health
│       ├── designs/route.ts      # GET & POST /api/designs
│       └── designs/[id]/route.ts # GET & DELETE /api/designs/:id
├── components/
│   ├── ArchitectureDiagram.tsx   # React Flow diagram + PDF export
│   ├── DesignForm.tsx            # Design prompt input
│   ├── DesignCard.tsx            # Dashboard design card
│   ├── DesignDetailSections.tsx  # Tabbed architecture breakdown
│   ├── Globe.tsx                 # 3D globe (cobe)
│   ├── Navbar.tsx                # Navigation bar
│   ├── LoadingSpinner.tsx        # Loading state
│   ├── PageTransition.tsx        # Page transitions
│   └── Preloader.tsx             # Initial load animation
├── lib/
│   ├── api.ts                    # Frontend API client + TypeScript types
│   ├── db.ts                     # Cached serverless MongoDB connection
│   ├── models/Design.ts          # Mongoose schema
│   └── services/groqService.ts   # Groq AI service
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas URI (or local MongoDB)
- Groq API key — free at [console.groq.com](https://console.groq.com)

### Setup

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/system-design-simulator
GROQ_API_KEY=gsk_your_key_here
```

Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable       | Description                  | Required |
| -------------- | ---------------------------- | -------- |
| `MONGODB_URI`  | MongoDB connection string    | Yes      |
| `GROQ_API_KEY` | Groq API key for AI generation | Yes    |

## API Routes

All API routes are serverless Next.js App Router handlers:

| Method   | Route               | Description                  |
| -------- | ------------------- | ---------------------------- |
| `GET`    | `/api/health`       | Health check                 |
| `POST`   | `/api/designs`      | Generate new system design   |
| `GET`    | `/api/designs`      | List designs (paginated)     |
| `GET`    | `/api/designs/:id`  | Get a single design          |
| `DELETE` | `/api/designs/:id`  | Delete a design              |

## Deploy to Vercel

1. Push the repo to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Set **Root Directory** to `frontend`
4. Add environment variables: `MONGODB_URI` and `GROQ_API_KEY`
5. Deploy

## License

MIT
