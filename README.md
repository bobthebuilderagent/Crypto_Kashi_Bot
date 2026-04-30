# Crypto+Kalshi - Trading Dashboard

A unified crypto trading bot and prediction markets dashboard built with Next.js 16, React 19, and Tailwind CSS.

## Features

- 🏠 **Dashboard Homepage** - Real-time overview of your portfolio and market trends
- 🤖 **Crypto Bot** - Automated trading bot management and monitoring
- 📊 **Prediction Markets** - Browse and participate in crypto prediction markets
- 📈 **Live Ticker** - Real-time cryptocurrency price ticker across top coins
- 🎨 **Dark Theme** - Sleek UI powered by shadcn/ui components
- 📱 **Responsive** - Works on desktop and mobile

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org)
- **UI:** [shadcn/ui](https://ui.shadcn.com), [Tailwind CSS 4](https://tailwindcss.com)
- **Animations:** [Framer Motion](https://www.framer.com/motion)
- **Charts:** [Recharts](https://recharts.org)
- **Icons:** [Lucide React](https://lucide.dev)
- **Components:** Base UI, Date-fns, React Day Picker

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+ 
- [npm](https://npmjs.com) 9+ (or yarn/pnpm/bun)

### Installation

```bash
# Clone the repository
git clone git@github.com:bobthebuilderagent/Crypto_Kalshi_Bot.git
cd Crypto_Kalshi_Bot

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard.

## Project Structure

```
Crypto_Kalshi_Bot/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout (Header, Ticker, Provider)
│   │   ├── page.tsx            # HomePage route
│   │   ├── crypto/page.tsx     # CryptoBotPage route
│   │   └── predictions/page.tsx # PredictionsPage route
│   ├── components/
│   │   ├── Header.tsx          # Top navigation bar
│   │   ├── LiveTicker.tsx      # Real-time price ticker
│   │   ├── Sidebar.tsx         # Side navigation menu
│   │   ├── pages/              # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── CryptoBotPage.tsx
│   │   │   ├── PredictionsPage.tsx
│   │   │   └── KalshiPredictionsPage.tsx
│   │   └── ui/                 # shadcn/ui components (30+)
│   ├── lib/
│   │   ├── providers.tsx       # App-level React context provider
│   │   └── utils.ts            # Shared utility functions
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   └── data/
│       └── mock.ts             # Mock crypto data
├── public/                     # Static assets
├── tailwind.config.ts          # Tailwind configuration
├── next.config.ts              # Next.js configuration
└── tsconfig.json               # TypeScript configuration
```

## Available Scripts

| Script        | Description                      |
|--------------|----------------------------------|
| `npm run dev`   | Start development server at :3000 |
| `npm run build` | Build for production            |
| `npm run start` | Start production server         |
| `npm run lint`  | Run ESLint                      |

## Pages & Routes

| Route             | Page                 | Description                     |
|-------------------|----------------------|---------------------------------|
| `/`               | HomePage             | Main dashboard with portfolio overview |
| `/crypto`         | CryptoBotPage        | AI-powered crypto trading bot      |
| `/predictions`    | PredictionsPage      | Crypto prediction markets          |

## Styling

This project uses Tailwind CSS with shadcn/ui design tokens. The app runs in dark mode by default for a sleek trading aesthetic.

Custom theme variables include a slate-based dark palette with chart colors for data visualization.

## Getting Started (Alternative Package Managers)

```bash
# yarn
yarn dev

# pnpm
pnpm dev

# bun
bun dev
```

## Deploy

Easiest way to deploy is via [Vercel](https://vercel.com/new):

1. Push your code to GitHub
2. Import the repo in Vercel
3. Vercel auto-configures Next.js builds

## License

MIT
