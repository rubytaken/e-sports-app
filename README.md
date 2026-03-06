# e-scores -- Live Esports Tracker

A modern, real-time esports tracking application built with Next.js. Browse live matches, tournaments, teams, players and news across all major competitive titles.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

---

## Features

- **Live Match Tracking** -- Real-time scores with 15-second auto-refresh
- **Tournament Browser** -- Active, upcoming and past tournaments with tier filtering (S/A/B/C/D)
- **Team Profiles** -- Rosters, match history, win rates and tournament records
- **Player Profiles** -- Career stats, current team, match history
- **Match Details** -- Game-by-game scores, streams, opponent info
- **Esports News** -- Aggregated news feed with search
- **Global Search** -- Ctrl+K quick search across teams, players, tournaments and matches with category tabs, recent search history and keyword highlighting
- **Game Filtering** -- Filter all content by game (CS2, Dota 2, LoL, Valorant, etc.)
- **Multi-language** -- English, Turkish, German, Spanish, French
- **Dark/Light Theme** -- System-aware with manual toggle
- **Responsive** -- Mobile-first design with adaptive layouts

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript 5.9 |
| UI | React 19, Tailwind CSS 4 |
| Components | Radix UI Primitives |
| Animations | Framer Motion |
| Data Fetching | TanStack React Query |
| Icons | Lucide React |
| Validation | Zod |
| APIs | PandaScore, NewsAPI |

## Project Structure

```
esports-app/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage dashboard
│   ├── matches/            # Match listings & detail
│   ├── tournaments/        # Tournament listings, detail & registration
│   ├── teams/              # Team listings & detail
│   ├── players/            # Player listings & detail
│   ├── news/               # News feed
│   └── api/                # API route handlers (proxies)
│       ├── pandascore/     # PandaScore API proxy
│       └── news/           # NewsAPI proxy
├── components/
│   ├── layout/             # Header, Footer
│   ├── shared/             # Reusable components (search, pagination, filters...)
│   ├── match/              # Match card
│   ├── tournament/         # Tournament card
│   └── news/               # News card
├── hooks/                  # Custom React hooks
│   ├── use-debounce.ts
│   ├── use-game-filter.ts
│   ├── use-locale.tsx
│   └── use-theme.ts
├── lib/
│   ├── api/                # API client, types, React Query hooks
│   ├── constants.ts        # App configuration
│   ├── i18n.ts             # Translations (5 locales)
│   └── utils.ts            # Utility functions
└── public/                 # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/rubytaken/e-sports-app.git
cd e-sports-app

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
PANDASCORE_API_TOKEN=your_pandascore_api_token
NEWS_API_KEY=your_newsapi_key
```

| Variable | Description | Get it from |
|---|---|---|
| `PANDASCORE_API_TOKEN` | API token for esports data | [pandascore.co](https://pandascore.co/) |
| `NEWS_API_KEY` | API key for news feed | [newsapi.org](https://newsapi.org/) |

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm run start
```

## API Architecture

All external API calls are proxied through Next.js API routes to protect API tokens:

```
Client  -->  /api/pandascore/*  -->  api.pandascore.co
Client  -->  /api/news          -->  newsapi.org
```

Data fetching uses TanStack React Query with configured stale times:

| Data Type | Stale Time | Refetch Interval |
|---|---|---|
| Live matches | 15s | 15s |
| Upcoming matches | 1min | 1min |
| Past matches | 5min | -- |
| Tournaments | 2min | -- |
| Team/Player detail | 5min | -- |
| Videogames list | 1hr | -- |

## License

This project is for educational and portfolio purposes.

## Author

**Emre Tosman** -- [@rubytaken](https://github.com/rubytaken)
