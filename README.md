# Inspection Detective

## Game Concept

Inspection Detective teaches first-time homebuyers how to think during a home inspection. Many buyers treat inspection as a pass/fail event, but the real skill is knowing which findings change the deal: safety hazards, structural movement, moisture, roof life, plumbing, and expensive near-term repairs. This mini-game turns that stressful walkthrough into a focused detective activity.

The player explores a cutaway house with a flashlight-style inspection view and spends limited inspection tokens on suspicious spots. Each revealed finding includes a visual evidence snapshot, severity, estimated repair cost, and a short inspector note. Some findings are serious negotiation items while others are cosmetic red herrings. After investigating, the player chooses up to three issues to include in a repair-credit or specialist-follow-up request. The mechanic is native to the concept: a real inspection is not about memorizing facts, it is about noticing clues, prioritizing limited attention, and deciding what belongs in negotiation.

After completing the round, the player understands that cosmetic issues are different from deal-shaping risks, and that inspection protects the buyer by turning uncertainty into specific next steps. It is fun because it feels like a hidden-object investigation: sweep the house, spend tokens carefully, reveal surprises, avoid red herrings, build a repair request, and earn Nest Coins from the final inspection report.

The design keeps the lesson tight while still feeling playful, visual, and more active than a quiz. The detective guide and evidence-card treatment are inspired by Nest Navigate's friendly mascot, cutaway home, two-minute lessons, progress tracking, and coins.

## How to Run Locally

```bash
npm install
npm run dev
```

Open the local URL Vite prints in the terminal, usually `http://localhost:5173`.

## Tech Choices

This prototype uses React with Vite and plain CSS. React state is enough for the game loop: start screen, house inspection, finding selection, scoring, and result screen. I kept it self-contained with no backend, no API calls, and no extra state library so the code stays easy to review.

The UI borrows Nest Navigate's product language: short lessons, readiness progress, Nest Coins, and friendly coaching rather than dense financial instruction.

## What I'd Do With More Time

I would add more houses with different risk profiles, richer room art, drag-to-zoom inspection tools, personalized difficulty based on buyer stage, and a small neighborhood map where each house teaches one buyer decision. Phaser could make the inspection feel even more tactile with animated hotspot discoveries, character movement, and celebratory coin feedback.

## Known Issues

The prototype includes one complete round rather than a library of levels. The inspection findings and repair estimates are simplified for learning clarity and should not be treated as financial advice or a substitute for a licensed inspector.
