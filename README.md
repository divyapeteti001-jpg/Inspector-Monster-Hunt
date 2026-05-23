# Inspection Monster Hunt

Inspection Monster Hunt is my React mini game for the Nest Navigate Full Stack Engineering Assignment. The game teaches first-time homebuyers how to read a home inspection report with more confidence and decide which issues are worth bringing into a seller negotiation.

Live app: https://inspector-monster-hunt.vercel.app/

## Game Concept

Buying a first home can be stressful because the inspection report often lists a lot of problems at once. Some findings are serious, like unsafe wiring, roof leaks, moisture damage, foundation cracks, or missing permits. Others are normal wear and tear, like scuffed paint or a loose tile. My game focuses on that decision-making moment.

In Inspection Monster Hunt, inspection problems appear as repair monsters inside different homes. The player chooses a house, inspects visible issues, reveals hidden risks, manages limited inspection tokens, and watches the deal health change based on what is still unresolved. Each monster has a severity level, repair cost, inspection note, and negotiation value. The player cannot clear everything, so they have to decide what matters most.

After the inspection round, the player builds a repair request with up to three findings and chooses a negotiation strategy: repairs, closing credit, or price reduction. The result screen shows how strong the request was, how the seller responded, what value the buyer may recover, and which major issues still need follow-up.

The main learning goal is that a strong inspection response is focused and evidence-based. A buyer should not treat every defect the same. Safety, moisture, structure, roof, electrical, and documentation issues usually matter more than cosmetic problems.

## How to Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the local URL shown in the terminal.

4. Build the production version:

```bash
npm run build
```

5. Run the lint check:

```bash
npm run lint
```

## Tech Choices

I used React with Vite because it is fast to set up and works well for a small interactive prototype. The game state lives in React state, which keeps the project simple and matches the assignment requirement that no backend is needed.

The game uses plain CSS for styling and responsive layout. I chose this so the visual design, animations, house board, meters, cards, and mobile adjustments could stay in one place without adding another styling library. The app is fully self-contained and does not call any external APIs.

Most of the game data is stored as structured JavaScript objects in `src/App.jsx`. That made it easier to build multiple houses, different inspection findings, hidden issues, tool cooldowns, scoring rules, and negotiation outcomes without needing a database.

## What I Would Do With More Time

With more time, I would add more house types and a clearer tutorial round for players who are completely new to inspection reports. I would also add sound effects, stronger animations, and a small glossary for terms like closing credit, repair request, and specialist follow-up.

I would also separate the larger game data and scoring logic into smaller files. For this prototype, I kept the project compact so the full game loop was easier to review, but splitting the data and helper functions would make the app easier to extend.

## Known Issues

The prototype is designed for laptop and standard browser sizes first. It is responsive and usable on smaller screens, but the house hotspots are easiest to play on a larger screen.

The inspection findings and repair values are simplified for gameplay. They are meant to teach prioritization, not replace advice from a real inspector, contractor, or real estate professional.

The app does not save progress after a browser refresh. All progress is kept in the current browser session, which matches the no-backend scope of the assignment.
