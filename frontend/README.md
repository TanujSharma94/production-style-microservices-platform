# ShopHub Frontend

Next.js frontend for the ShopHub e-commerce platform.

## Setup

1. Copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_API_URL`
   to your backend URL.
2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`
4. Open `http://localhost:3000`

## Requirements

- Node.js 20+
- Backend API running (see `../backend/README.md`)

## Structure

- `src/app` — pages (App Router)
- `src/components` — shared UI components
- `src/context` — Auth and Cart state
- `src/lib` — API client and formatting helpers
