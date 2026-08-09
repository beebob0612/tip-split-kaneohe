# Tip Split — Kickin' Kajun (Kāneʻohe)

Standalone tip payout calculator, replacing the shared Google Sheet.

## Logic
- House fee = round((Service Charge + Credit Card Tip) × 10%)
- Distributable pool = Service Charge + Credit Card Tip − House Fee + Cash Tip
- Server payout (each) = round(pool × 80% ÷ server count)
- Cook payout (each) = round(pool × 20% ÷ cook count)

## Dev
```
npm install
npm run dev
```

## Deploy
Push to GitHub, then import into Vercel (framework: Vite). No env vars or backend needed — pure client-side calculation, installable as a home-screen app on iPhone.
