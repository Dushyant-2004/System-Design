# AI System Design Simulator

A production-ready platform that generates complete system architecture designs using AI. Enter any system design problem (e.g., "Design Instagram", "Design Netflix") and get a structured breakdown with interactive architecture diagrams.

## Features

- **AI-Powered Generation** — Uses Groq API (LLaMA 3.3 70B) for expert-level system design
- **Interactive Architecture Diagrams** — React Flow-based zoomable, draggable node graphs
- **Complete Analysis** — Microservices, databases, APIs, caching, scaling, infrastructure
- **Design History** — MongoDB-backed dashboard with search and pagination
- **Modern Dark UI** — Glass morphism, gradient accents, Framer Motion animations
- **Production-Ready** — Rate limiting, error handling, validation, graceful shutdown

## Tech Stack

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Frontend   | Next.js 14 (App Router), TypeScript, Tailwind   |
| Diagrams   | React Flow                                      |
| Animations | Framer Motion                                   |
| Backend    | Node.js, Express                                |
| Database   | MongoDB + Mongoose                              |
| AI         | Groq API (LLaMA 3.3 70B)                        |

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── server.js          # Express server entry
│   │   ├── config/db.js       # MongoDB connection
│   │   ├── models/Design.js   # Mongoose schema
│   │   ├── routes/designs.js  # REST API routes
│   │   ├── services/groqService.js  # Groq AI integration
│   │   └── middleware/errorHandler.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── layout.tsx         # Root layout + dark theme
│   │   ├── page.tsx           # Home / Generator
│   │   ├── dashboard/page.tsx # Design history
│   │   └── design/[id]/page.tsx # Design detail view
│   ├── components/
│   │   ├── ArchitectureDiagram.tsx  # React Flow diagram
│   │   ├── DesignForm.tsx
│   │   ├── DesignCard.tsx
│   │   ├── DesignDetailSections.tsx
│   │   ├── Navbar.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── PageTransition.tsx
│   ├── lib/api.ts             # API client + types
│   └── package.json
└── README.md
```

## Setup

### Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env — set GROQ_API_KEY and MONGODB_URI
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

### Environment Variables

**Backend (`backend/.env`)**

| Variable       | Description              | Default                                         |
| -------------- | ------------------------ | ----------------------------------------------- |
| `PORT`         | Server port              | `5000`                                          |
| `MONGODB_URI`  | MongoDB connection URI   | `mongodb://localhost:27017/system-design-simulator` |
| `GROQ_API_KEY` | Your Groq API key        | —                                               |
| `NODE_ENV`     | Environment              | `development`                                   |
| `FRONTEND_URL` | CORS origin              | `http://localhost:3000`                          |

**Frontend (`frontend/.env.local`)**

| Variable              | Description         | Default                        |
| --------------------- | ------------------- | ------------------------------ |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api`   |

## API Endpoints

| Method | Endpoint            | Description                |
| ------ | ------------------- | -------------------------- |
| GET    | `/api/health`       | Health check               |
| POST   | `/api/designs`      | Generate new system design |
| GET    | `/api/designs`      | List all designs (paginated) |
| GET    | `/api/designs/:id`  | Get single design          |
| DELETE | `/api/designs/:id`  | Delete a design            |

## License

MIT
