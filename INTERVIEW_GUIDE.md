# Interview Guide: Inspection Monster Hunt

## One-Sentence Pitch

Inspection Monster Hunt is a React mini-game that teaches first-time homebuyers how to prioritize home inspection findings, protect their budget, and make a focused seller negotiation request.

## Why This Fits Nest Navigate

Nest Navigate helps first-time buyers understand the homebuying journey through interactive, gamified learning. This game matches that mission because it turns a stressful and information-heavy part of buying a home into a playable decision loop.

Instead of reading a long inspection checklist, the player learns by doing: they inspect a house, identify which issues matter most, avoid cosmetic distractions, and choose a negotiation strategy. The game keeps the lesson approachable with friendly visuals, repair monsters, a guide character, progress meters, Nest Coins, and a summary report.

The core learning concept is clear: not every inspection finding should carry the same weight. A first-time buyer should learn to prioritize safety, structure, moisture, exterior risk, and budget impact before negotiating.

## Why It Is Useful For New Buyers

First-time buyers often do not know how to interpret an inspection report. They may overreact to minor cosmetic issues or miss the importance of safety, moisture, electrical, roof, and structural problems.

This game helps them practice three real buyer skills:

1. Spot priority issues.
2. Separate deal-changing risks from cosmetic noise.
3. Build a focused repair request or seller credit strategy.

By the end, a player understands that inspection is not about finding every flaw. It is about turning uncertainty into specific next steps before closing.

## Assignment Alignment

| PDF Requirement | How This Project Meets It |
| --- | --- |
| Original game, not flashcards/trivia/Monopoly | Uses a repair-monster strategy loop on a home floor plan. |
| Frontend-heavy React prototype | Built with React, Vite, and plain CSS. |
| No backend or external APIs | All state is browser-only React state. |
| Start screen | Introduces the concept and starts the house selection flow. |
| Core game loop | Choose a house, defeat repair monsters, select findings, negotiate, see results. |
| Scoring/progress | Tokens, findings, request value, incoming attack, deal-health meters, seller comfort, Nest Coins. |
| End state | Final inspection report with score, grade, seller response, and follow-up count. |
| Basic responsiveness | CSS grid and media queries support laptop and smaller screens. |
| README design brief | README includes the required 150-300 word game concept and required sections. |

## Game Workflow

1. Start Screen
   The player sees the game concept and starts the experience.

2. House Selection
   The player chooses one of three houses:
   - Starter Cottage
   - Older Bungalow
   - Luxury Flip

3. Inspection Hunt
   The selected house image appears as the play area. Repair monsters sit on the floor plan. Each monster represents a possible inspection issue.

4. Deal Health Pressure
   Active monsters reduce buyer confidence, budget safety, and deal health. Higher-priority issues create more pressure.

5. Tools
   The player can use three tools:
   - Flashlight Sweep: reveals one hidden issue.
   - Contractor Estimate: strengthens one defeated issue with better cost confidence.
   - Agent Call: highlights the most important active issue and restores some confidence.

6. Findings List
   Defeated monsters become findings. The player can select up to three findings for the repair request.

7. Seller Negotiation
   The player chooses one negotiation strategy:
   - Ask for repairs
   - Ask for closing credit
   - Ask for price cut

8. Result Screen
   The game shows a grade, score, Nest Coins, seller response, deal health, missed major issues, and the final repair request.

## Game Rules

- Each house gives the player a limited number of inspection tokens.
- Each repair monster has a priority based on severity:
  - Critical: highest-risk safety, structural, or major repair issues.
  - High: serious moisture, exterior, roof, or documentation concerns.
  - Medium: meaningful but smaller repair concerns.
  - Low: cosmetic or lower-urgency items.
- Some monsters are hidden until revealed by another finding or the Flashlight Sweep tool.
- The player should defeat the most important monsters first.
- The player may select only three findings for negotiation.
- Cosmetic or low-priority items reduce the quality of the final request.
- Contractor estimates improve negotiation strength.
- Seller response depends on issue severity, evidence, request size, strategy, house difficulty, and remaining deal health.

## What The Player Learns

The player learns that a good inspection response is not "ask for everything." A strong buyer focuses on the issues that could change the deal:

- Safety concerns
- Structural movement
- Moisture or roof issues
- Electrical risk
- Exterior water damage
- Budget-impacting repairs

The player also learns that negotiation strategy matters. A seller may respond differently to a repair request, closing credit, or price reduction.

## Code Structure

### `src/App.jsx`

This is the main game file. It contains:

- Game data:
  - `houses`: house levels, images, repair issues, hidden issues, token counts, and starting health.
  - `tools`: inspection tools and cooldown rules.
  - `negotiationStrategies`: repair, credit, and price-cut options.

- Helper functions:
  - `createClue`: normalizes issue data.
  - `getPriority`: converts severity into Critical, High, Medium, or Low.
  - `visibleCluesFor`: controls hidden issue visibility.
  - `calculateDamage`: calculates pressure from active monsters.
  - `buildInspectionReport`: builds the post-hunt report.
  - `calculateNegotiation`: determines seller response and expected value.
  - `getGrade`: assigns final labels like Risk Hunter or Smart Negotiator.

- React components:
  - `StartScreen`: intro and call to action.
  - `LevelSelect`: house selection cards.
  - `GameScreen`: main inspection gameplay state.
  - `HouseBoard`: floor-plan image, repair monsters, guide character, and battle feedback.
  - `ToolPanel`: tool buttons and cooldown text.
  - `DiscoveryLog`: defeated monsters and selected repair findings.
  - `NegotiationScreen`: seller strategy choice.
  - `ResultScreen`: final grade and summary.

### `src/index.css`

This file handles layout, visual styling, responsive behavior, monster shapes, deal-health meters, cards, floor-plan image sizing, and animation.

Important CSS pieces:

- `.house-map`: keeps each house image at the correct aspect ratio.
- `.hotspot`: positions repair monsters over the floor plan.
- `.monster-body`: draws the small monster shape.
- `.battle-burst`: shows defeat feedback.
- `.health-grid` and `.health-meter`: show buyer confidence, budget safety, and deal health.
- `.strategy-grid`: styles the negotiation choices.

### `public/images`

The game uses local images only:

- `strater cottage.png`
- `older bungalow.png`
- `luxury flip.png`
- `detective.png`
- `nest-logo.png`

No external APIs are used.

## React State Workflow

The main state lives in `GameScreen`:

- `tokens`: how many inspection actions remain.
- `discovered`: which monsters were defeated.
- `revealed`: which hidden monsters are now visible.
- `selected`: which findings are in the repair request.
- `estimated`: which findings have contractor support.
- `stats`: buyer confidence, budget safety, and deal health.
- `cooldowns`: tool availability.
- `highlightedId`: which monster the agent highlighted.
- `battle`: temporary defeat animation location.
- `coach`: user-facing feedback text.

When a player clicks a monster:

1. The game checks token cost and whether the monster is already cleared.
2. The monster is added to `discovered`.
3. Related hidden monsters may be added to `revealed`.
4. Deal-health pressure is recalculated.
5. The finding appears in the repair request list.
6. The coach message updates.

When the player submits findings:

1. `buildInspectionReport` creates a structured report.
2. `NegotiationScreen` lets the player choose a strategy.
3. `calculateNegotiation` produces seller response, comfort score, and expected value.
4. `ResultScreen` shows the final grade and teaching summary.

## Why The Design Is Interview-Ready

This project shows product thinking and engineering execution:

- Product: The mechanic matches the home inspection concept.
- UX: The player gets feedback through meters, labels, tool cooldowns, selected cards, and a final report.
- Engineering: The app is self-contained, data-driven, component-based, and uses clear React state.
- Communication: README explains the concept, local setup, choices, next steps, and known issues.

## Things To Say In The Interview

- "I wanted the mechanic to be native to inspections: limited attention, hidden issues, prioritization, and negotiation."
- "The repair monsters are not random enemies. They represent risk categories a buyer needs to learn to rank."
- "The game teaches one main idea: inspection findings are not equal."
- "I used React state instead of a state library because the prototype is frontend-only and the state model is still manageable."
- "I kept all data local so it satisfies the no-backend and no-external-API requirement."
- "If I had more time, I would add custom monster art per issue, keyboard polish, sound effects, and possibly Phaser for sprite movement."

## Final Submission Checklist

- Run `npm run lint`.
- Run `npm run build`.
- Play through one full house from start to result.
- Commit the latest changes.
- Push to a public GitHub repository.
- Deploy to Vercel, Netlify, Railway, or GitHub Pages.
- Add the deployed URL to README under `Deployment`.
