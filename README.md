# MindPulse — AI Mental Wellness App

A production-quality AI-powered mental wellness companion built with Next.js 14, Anthropic Claude, and Recharts.

## Features

- **Dashboard** — Animated stat cards, 7-day mood trend (line chart), sleep hours (bar chart), stress sources (donut chart), and recent check-ins
- **Daily Check-in** — Mood selector with emoji buttons, sleep stepper, stress trigger pills, energy level selector, and AI-generated wellness brief with recommendations
- **AI Companion** — Full chat interface with MindPulse AI, typing indicator, suggested prompt chips, and persistent chat history
- **Insights** — AI-generated personalized wellness insights with category tags, refresh on demand, and a Trend of the Week card
- **Goals & Streaks** — Habit tracker with progress bars, 7-day contribution grid, animated streak counter, and 4-7-8 breathing exercise with animated SVG circle

## Tech Stack

- **Next.js 14** App Router (full-stack)
- **Anthropic Claude** (`claude-sonnet-4-20250514`) for all AI features
- **Recharts** for data visualization
- **Framer Motion** for page and element animations
- **Tailwind CSS** + shadcn/ui components
- **react-hot-toast** for notifications
- **localStorage** for check-in history, chat history, and habit state

## Setup

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env.local` file based on `.env.local.example`:

```bash
cp .env.local.example .env.local
```

3. Add your Anthropic API key to `.env.local`:

```
ANTHROPIC_KEY=your_anthropic_key_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `ANTHROPIC_KEY` | Anthropic API key (server-side only) | Yes |

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/checkin` | POST | Analyzes daily check-in data and returns personalized wellness brief |
| `/api/chat` | POST | Powers the AI companion chat with conversation history |
| `/api/insights` | POST | Generates 3 personalized wellness insights from user stats |

## Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add `ANTHROPIC_KEY` environment variable in Vercel project settings
4. Deploy

## Deploy to Netlify

The project includes a `netlify.toml` configuration. Add `ANTHROPIC_KEY` to your Netlify site's environment variables before deploying.
