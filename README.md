# Inspection Monster Hunt

## Game Concept

Inspection Monster Hunt teaches first-time homebuyers how to prioritize home inspection findings before negotiation. Many buyers see inspection as a list of scary problems, but the real skill is deciding which issues affect safety, budget, and the deal. In this game, repair risks appear as priority monsters inside an illustrated home. The player spends limited inspection tokens, uses tools like a flashlight sweep, contractor estimate, and agent call, and clears monsters in the order that best protects the buyer.

The core mechanic is built around inspection tradeoffs: every active monster attacks buyer confidence, budget safety, and deal health until it is cleared. Some issues are obvious, some are hidden behind related clues, and some are cosmetic distractions. After the hunt, the player chooses up to three findings for a seller negotiation and selects a strategy: repair request, closing credit, or price cut.

The learning outcome is that inspection is not about finding everything or asking for every small flaw. It is about separating cosmetic noise from deal-shaping risk, building evidence, and making a focused repair request. It is fun because it feels like a light strategy/hidden-object game with urgency, tools, visual feedback, and a seller response at the end.

## How to Run Locally

```bash
npm install
npm run dev
```

Open the local URL Vite prints in the terminal, usually `http://localhost:5173`.

## Tech Choices

This prototype uses React, Vite, and plain CSS. All state lives in React: screen flow, selected house, cleared monsters, hidden reveals, tool cooldowns, deal-health meters, negotiation strategy, and final scoring. There is no backend, database, auth, or external API.

I skipped Phaser for this version because the core assignment prioritizes a tight, working React prototype. The game still uses visual game elements through CSS animation, an illustrated house map, clickable monsters, and result feedback.

## What I'd Do With More Time

I would add custom monster art for each issue type, a stronger animated battle sequence, sound effects, keyboard accessibility polish, and a simple shareable result screen. Phaser would be a good next step for sprite movement and particle effects once the core learning loop is locked.

## Known Issues

Repair estimates are simplified for educational gameplay and are not financial, legal, or inspection advice. The prototype is responsive for laptop and basic mobile layouts, but the best experience is on a laptop browser.

## Deployment

The assignment asks for a public deployed URL. This project is ready for Vercel, Netlify, Railway, or GitHub Pages, but the deployment URL should be added here after publishing.
