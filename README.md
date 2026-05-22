# Loan Estimate Decoder

## Game Concept

Loan Estimate Decoder teaches first-time homebuyers how to read the confusing second page of a Loan Estimate. Many buyers focus only on the down payment or interest rate, then get surprised by lender fees, title services, prepaid insurance, tax escrow, and the final cash-to-close number. This mini-game turns that moment into a fast sorting and decision challenge.

The player receives a stack of real-looking fee cards. Each card has a name, dollar amount, and short clue. The core mechanic is to classify each fee into one of three Loan Estimate buckets: lender charges, services the buyer can shop for, or prepaids and escrow. Once the estimate is decoded, the player compares three loan offers and chooses the healthiest one by weighing monthly payment against cash needed at closing. The game is not a quiz; the interaction mirrors the actual buyer task of making sense of an estimate and spotting which numbers deserve attention.

After completing the round, the player understands that cash to close is more than a down payment, that some fees are more flexible than others, and that the lowest upfront cost or lowest rate is not automatically the best choice. It is fun because it feels like a financial detective puzzle: quick card decisions, visible readiness progress, coach notes after each placement, and a final reveal with Nest Coins and a practical takeaway.

The mechanic is intentionally native to the concept: reading a Loan Estimate is already a sorting and comparison task. The game simply makes that task interactive, low-stakes, and memorable.

## How to Run Locally

```bash
npm install
npm run dev
```

Open the local URL Vite prints in the terminal, usually `http://localhost:5173`.

## Tech Choices

This prototype uses React with Vite and plain CSS. React state is enough for the game loop: start screen, fee sorting, loan selection, scoring, and result screen. I kept it self-contained with no backend, no API calls, and no extra state library so the code stays easy to review.

The UI borrows Nest Navigate's product language: short lessons, readiness progress, Nest Coins, and friendly coaching rather than dense financial instruction.

## What I'd Do With More Time

I would add more Loan Estimate scenarios, personalized difficulty based on buyer stage, and a small neighborhood map where each house teaches one buyer document or decision. Phaser could also make the fee cards feel more tactile with animated sorting trays and coin feedback.

## Known Issues

The prototype includes one complete round rather than a library of levels. The drag-and-drop interaction keeps click-to-place as a fallback for accessibility and trackpad users. The loan numbers are simplified for learning clarity and should not be treated as financial advice.
