import { useEffect, useMemo, useState } from 'react'

const requestLimit = 3

const tools = [
  {
    id: 'flashlight',
    name: 'Flashlight Sweep',
    cooldown: 3,
    text: 'Reveal one hidden monster before it surprises the buyer.',
  },
  {
    id: 'contractor',
    name: 'Contractor Estimate',
    cooldown: 3,
    text: 'Add a stronger cost estimate to one defeated monster.',
  },
  {
    id: 'agent',
    name: 'Agent Call',
    cooldown: 2,
    text: 'Highlight the most important active monster and steady the deal.',
  },
]

const negotiationStrategies = [
  {
    id: 'repair',
    name: 'Ask for repairs',
    tone: 'Firm and practical',
    modifier: 10,
    payout: 0.9,
    text: 'Best when safety, moisture, structure, or exterior issues are in the request.',
  },
  {
    id: 'credit',
    name: 'Ask for closing credit',
    tone: 'Flexible',
    modifier: 16,
    payout: 0.75,
    text: 'Often easier for sellers than coordinating repairs before closing.',
  },
  {
    id: 'price',
    name: 'Ask for price cut',
    tone: 'Aggressive',
    modifier: -2,
    payout: 1.05,
    text: 'Potentially valuable, but easier for the seller to push back on.',
  },
]

const houses = [
  {
    id: 'starter',
    name: 'Starter Cottage',
    image: '/images/strater cottage.png',
    aspectRatio: '1199 / 1312',
    listing: '$338k',
    difficulty: 1,
    tokens: 9,
    summary: 'A clean first home with a few hidden repair monsters.',
    startingHealth: {
      confidence: 96,
      budget: 94,
      deal: 92,
    },
    clues: [
      createClue({
        id: 'starter-sink',
        room: 'Kitchen',
        label: 'Slow sink leak',
        boardX: 29,
        boardY: 10,
        severity: 3,
        repair: 850,
        type: 'Plumbing',
        evidencePosition: '24% 14%',
        attack: { confidence: 2, budget: 3, deal: 1 },
        note: 'Small leaks are common, but they can create cabinet damage and mold if ignored.',
      }),
      createClue({
        id: 'starter-stain',
        room: 'Kitchen',
        label: 'Ceiling water stain',
        boardX: 34,
        boardY: 4,
        severity: 4,
        repair: 3100,
        type: 'Moisture',
        evidencePosition: '34% 9%',
        attack: { confidence: 4, budget: 5, deal: 3 },
        note: 'Water stains may mean an active roof, plumbing, or ventilation issue. Ask what caused it.',
      }),
      createClue({
        id: 'starter-mold',
        room: 'Kitchen',
        label: 'Possible cabinet mold',
        boardX: 23,
        boardY: 22,
        severity: 4,
        repair: 2400,
        type: 'Moisture',
        evidencePosition: '25% 18%',
        attack: { confidence: 4, budget: 4, deal: 3 },
        hidden: true,
        revealAfter: 'starter-sink',
        note: 'A leak can hide secondary damage. Buyers should ask whether moisture reached cabinet materials.',
      }),
      createClue({
        id: 'starter-tile',
        room: 'Bathroom',
        label: 'Loose bathroom tile',
        boardX: 58,
        boardY: 18,
        severity: 2,
        repair: 700,
        type: 'Surface',
        evidencePosition: '54% 16%',
        attack: { confidence: 1, budget: 2, deal: 1 },
        note: 'Loose tile is worth noting near water, but it is usually not the top negotiation item.',
      }),
      createClue({
        id: 'starter-window',
        room: 'Bedroom',
        label: 'Painted-shut window',
        boardX: 74,
        boardY: 10,
        severity: 2,
        repair: 450,
        type: 'Usability',
        evidencePosition: '83% 17%',
        attack: { confidence: 1, budget: 1, deal: 1 },
        note: 'This matters for safety and ventilation, but it is less urgent than structural or electrical risk.',
      }),
      createClue({
        id: 'starter-paint',
        room: 'Living Room',
        label: 'Scuffed wall paint',
        boardX: 28,
        boardY: 60,
        severity: 1,
        repair: 180,
        type: 'Cosmetic',
        evidencePosition: '28% 61%',
        attack: { confidence: 1, budget: 0, deal: 1 },
        note: 'Cosmetic wear is normal. Spending negotiation energy here can distract from bigger buyer risks.',
      }),
      createClue({
        id: 'starter-balcony',
        room: 'Balcony',
        label: 'Soft balcony decking',
        boardX: 8,
        boardY: 52,
        severity: 4,
        repair: 5200,
        type: 'Exterior',
        evidencePosition: '8% 52%',
        attack: { confidence: 4, budget: 5, deal: 3 },
        note: 'Soft decking can hide water damage. It belongs in the negotiation conversation.',
      }),
    ],
  },
  {
    id: 'bungalow',
    name: 'Older Bungalow',
    image: '/images/older bungalow.png',
    aspectRatio: '1285 / 1224',
    listing: '$412k',
    difficulty: 2,
    tokens: 10,
    summary: 'A charming older home where safety monsters hit harder.',
    startingHealth: {
      confidence: 94,
      budget: 90,
      deal: 88,
    },
    clues: [
      createClue({
        id: 'bungalow-panel',
        room: 'Entry',
        label: 'Warm electrical panel',
        boardX: 53,
        boardY: 84,
        severity: 5,
        repair: 4200,
        type: 'Safety',
        evidencePosition: '50% 82%',
        attack: { confidence: 6, budget: 5, deal: 4 },
        note: 'Warm panels can signal overloaded circuits or unsafe wiring. This is worth specialist follow-up.',
      }),
      createClue({
        id: 'bungalow-crack',
        room: 'Exterior Wall',
        label: 'Stair-step foundation crack',
        boardX: 70,
        boardY: 91,
        severity: 5,
        repair: 6800,
        type: 'Structural',
        evidencePosition: '70% 90%',
        evidenceSize: '230% auto',
        attack: { confidence: 6, budget: 7, deal: 5 },
        note: 'Patterned cracks can point to movement. A buyer should not treat this like cosmetic paint damage.',
      }),
      createClue({
        id: 'bungalow-stain',
        room: 'Kitchen',
        label: 'Ceiling water stain',
        boardX: 34,
        boardY: 4,
        severity: 4,
        repair: 3100,
        type: 'Moisture',
        evidencePosition: '34% 9%',
        attack: { confidence: 4, budget: 5, deal: 3 },
        note: 'Water stains may mean an active roof, plumbing, or ventilation issue. Ask what caused it.',
      }),
      createClue({
        id: 'bungalow-roof',
        room: 'Exterior Wall',
        label: 'Roof leak trail',
        boardX: 41,
        boardY: 6,
        severity: 5,
        repair: 7600,
        type: 'Roof',
        evidencePosition: '36% 6%',
        evidenceSize: '220% auto',
        attack: { confidence: 7, budget: 7, deal: 5 },
        hidden: true,
        revealAfter: 'bungalow-stain',
        note: 'A ceiling stain can be the visible clue for a larger roof issue.',
      }),
      createClue({
        id: 'bungalow-window',
        room: 'Bedroom',
        label: 'Painted-shut window',
        boardX: 74,
        boardY: 10,
        severity: 2,
        repair: 450,
        type: 'Usability',
        evidencePosition: '83% 17%',
        attack: { confidence: 1, budget: 1, deal: 1 },
        note: 'Useful to repair, but not usually the strongest negotiation anchor.',
      }),
      createClue({
        id: 'bungalow-tile',
        room: 'Bathroom',
        label: 'Loose bathroom tile',
        boardX: 58,
        boardY: 18,
        severity: 2,
        repair: 700,
        type: 'Surface',
        evidencePosition: '54% 16%',
        attack: { confidence: 1, budget: 2, deal: 1 },
        note: 'Tile near water deserves attention, but look for what caused it before negotiating hard.',
      }),
      createClue({
        id: 'bungalow-paint',
        room: 'Living Room',
        label: 'Scuffed wall paint',
        boardX: 28,
        boardY: 60,
        severity: 1,
        repair: 180,
        type: 'Cosmetic',
        evidencePosition: '28% 61%',
        attack: { confidence: 1, budget: 0, deal: 1 },
        note: 'This is a low-priority monster. It should not crowd out safety or structure.',
      }),
    ],
  },
  {
    id: 'flip',
    name: 'Luxury Flip',
    image: '/images/luxury flip.png',
    aspectRatio: '1402 / 1122',
    listing: '$489k',
    difficulty: 3,
    tokens: 11,
    summary: 'A polished home with pretty finishes and sneaky hidden monsters.',
    startingHealth: {
      confidence: 92,
      budget: 88,
      deal: 86,
    },
    clues: [
      createClue({
        id: 'flip-panel',
        room: 'Entry',
        label: 'Unpermitted panel work',
        boardX: 53,
        boardY: 84,
        severity: 5,
        repair: 6400,
        type: 'Safety',
        evidencePosition: '50% 82%',
        attack: { confidence: 7, budget: 7, deal: 5 },
        note: 'Electrical work without clear permits can create safety and resale problems.',
      }),
      createClue({
        id: 'flip-permit',
        room: 'Entry',
        label: 'Missing renovation permits',
        boardX: 58,
        boardY: 88,
        severity: 4,
        repair: 3800,
        type: 'Documentation',
        evidencePosition: '50% 82%',
        attack: { confidence: 5, budget: 4, deal: 5 },
        hidden: true,
        revealAfter: 'flip-panel',
        note: 'Pretty finishes do not replace documentation. Permit questions belong in the offer file.',
      }),
      createClue({
        id: 'flip-crack',
        room: 'Exterior Wall',
        label: 'Patched foundation crack',
        boardX: 70,
        boardY: 91,
        severity: 5,
        repair: 6800,
        type: 'Structural',
        evidencePosition: '70% 90%',
        evidenceSize: '230% auto',
        attack: { confidence: 6, budget: 7, deal: 5 },
        note: 'A patched crack still needs explanation. Repairs should come with records.',
      }),
      createClue({
        id: 'flip-balcony',
        room: 'Balcony',
        label: 'Soft balcony decking',
        boardX: 8,
        boardY: 52,
        severity: 4,
        repair: 5200,
        type: 'Exterior',
        evidencePosition: '8% 52%',
        attack: { confidence: 4, budget: 5, deal: 3 },
        note: 'Soft exterior materials can hide water damage below the surface.',
      }),
      createClue({
        id: 'flip-stain',
        room: 'Kitchen',
        label: 'Fresh paint over stain',
        boardX: 34,
        boardY: 4,
        severity: 4,
        repair: 3100,
        type: 'Moisture',
        evidencePosition: '34% 9%',
        attack: { confidence: 5, budget: 5, deal: 3 },
        note: 'A new finish can hide an old problem. Ask what was repaired and why.',
      }),
      createClue({
        id: 'flip-appliance',
        room: 'Kitchen',
        label: 'Loose appliance install',
        boardX: 18,
        boardY: 19,
        severity: 3,
        repair: 950,
        type: 'Installation',
        evidencePosition: '18% 17%',
        attack: { confidence: 2, budget: 3, deal: 2 },
        note: 'Small installation mistakes can point to rushed flip work elsewhere.',
      }),
      createClue({
        id: 'flip-cosmetic',
        room: 'Bedroom',
        label: 'Uneven touch-up paint',
        boardX: 78,
        boardY: 68,
        severity: 1,
        repair: 220,
        type: 'Cosmetic',
        evidencePosition: '80% 67%',
        attack: { confidence: 1, budget: 0, deal: 1 },
        note: 'Cosmetic imperfections are visible, but they rarely change the deal.',
      }),
      createClue({
        id: 'flip-drain',
        room: 'Bathroom',
        label: 'Slow shower drain',
        boardX: 58,
        boardY: 18,
        severity: 3,
        repair: 1100,
        type: 'Plumbing',
        evidencePosition: '54% 16%',
        attack: { confidence: 3, budget: 3, deal: 2 },
        hidden: true,
        note: 'Hidden plumbing symptoms are easy to miss when finishes look new.',
      }),
    ],
  },
]

function createClue(clue) {
  return {
    cost: clue.severity >= 4 ? 2 : 1,
    hidden: false,
    evidenceSize: '250% auto',
    ...clue,
  }
}

function clamp(value) {
  return Math.min(100, Math.max(0, Math.round(value)))
}

function tickCooldowns(current, override = {}) {
  return {
    flashlight: Math.max(0, current.flashlight - 1),
    contractor: Math.max(0, current.contractor - 1),
    agent: Math.max(0, current.agent - 1),
    ...override,
  }
}

function getPriority(clue) {
  if (clue.severity >= 5) {
    return { key: 'critical', label: 'Critical', name: 'critical' }
  }

  if (clue.severity >= 4) {
    return { key: 'high', label: 'High', name: 'high-priority' }
  }

  if (clue.severity >= 3) {
    return { key: 'medium', label: 'Medium', name: 'medium-priority' }
  }

  return { key: 'low', label: 'Low', name: 'low-priority' }
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function visibleCluesFor(house, revealed) {
  return house.clues.filter((clue) => !clue.hidden || revealed.includes(clue.id))
}

function calculateDamage(clues) {
  return clues.reduce(
    (total, clue) => ({
      confidence: total.confidence + clue.attack.confidence,
      budget: total.budget + clue.attack.budget,
      deal: total.deal + clue.attack.deal,
    }),
    { confidence: 0, budget: 0, deal: 0 },
  )
}

function averageHealth(stats) {
  return Math.round((stats.confidence + stats.budget + stats.deal) / 3)
}

function getGrade(result) {
  const selectedCritical = result.selectedClues.filter((clue) => clue.severity >= 5).length
  const lowPriorityCount = result.selectedClues.filter((clue) => clue.severity <= 2).length

  if (lowPriorityCount >= 2) {
    return {
      title: 'Cosmetic Chaser',
      text: 'You spent too much negotiation energy on small repair monsters.',
    }
  }

  if (result.negotiation.response === 'Accepted' && selectedCritical >= 2) {
    return {
      title: 'Risk Hunter',
      text: 'You focused on the repair monsters that could actually change the deal.',
    }
  }

  if (result.healthAverage >= 78 && result.negotiation.response !== 'Rejected') {
    return {
      title: 'Budget Protector',
      text: 'You kept the buyer stable while still making a strong request.',
    }
  }

  if (result.discoveredCount >= result.house.clues.length - 1) {
    return {
      title: 'Monster Slayer',
      text: 'You found almost every house monster before negotiating.',
    }
  }

  if (result.negotiation.response === 'Rejected') {
    return {
      title: 'Over-Negotiator',
      text: 'The request had leverage, but the seller thought it went too far.',
    }
  }

  return {
    title: 'Smart Negotiator',
    text: 'You made a focused repair request and protected the buyer.',
  }
}

function buildInspectionReport({ house, discovered, selected, estimated, stats }) {
  const selectedClues = selected.map((clueId) =>
    house.clues.find((clue) => clue.id === clueId),
  )
  const selectedRepairValue = selectedClues.reduce(
    (total, clue) => total + clue.repair,
    0,
  )
  const riskScore = selectedClues.reduce(
    (total, clue) => total + clue.severity * 13,
    0,
  )
  const estimateBonus = selectedClues.filter((clue) => estimated.includes(clue.id)).length * 7
  const cosmeticPenalty = selectedClues.filter((clue) => clue.severity <= 1).length * 14
  const missedMajor = house.clues.filter(
    (clue) => clue.severity >= 4 && !selected.includes(clue.id),
  ).length
  const healthAverage = averageHealth(stats)
  const score = clamp(
    riskScore + estimateBonus + healthAverage * 0.22 - cosmeticPenalty - missedMajor * 8,
  )

  return {
    house,
    selectedClues,
    selectedRepairValue,
    discoveredCount: discovered.length,
    estimated,
    missedMajor,
    healthAverage,
    stats,
    score,
  }
}

function calculateNegotiation(report, strategy) {
  const selectedSeverity = report.selectedClues.reduce(
    (total, clue) => total + clue.severity * 12,
    0,
  )
  const estimateBonus = report.selectedClues.filter((clue) =>
    report.estimated.includes(clue.id),
  ).length * 9
  const lowPenalty = report.selectedClues.filter((clue) => clue.severity <= 2).length * 9
  const askPressure = Math.round((report.selectedRepairValue / 1000) * (strategy.id === 'price' ? 2.5 : 1.5))
  const sellerScore = clamp(
    selectedSeverity +
      estimateBonus +
      strategy.modifier +
      report.healthAverage * 0.2 -
      lowPenalty -
      askPressure -
      report.house.difficulty * 7,
  )

  const response =
    sellerScore >= 72 ? 'Accepted' : sellerScore >= 46 ? 'Countered' : 'Rejected'
  const credit =
    response === 'Accepted'
      ? Math.round(report.selectedRepairValue * strategy.payout)
      : response === 'Countered'
        ? Math.round(report.selectedRepairValue * strategy.payout * 0.55)
        : 0
  const score = clamp(report.score * 0.72 + sellerScore * 0.28)

  return {
    response,
    sellerScore,
    credit,
    score,
    strategy,
  }
}

async function submitAttempt(result) {
  const payload = {
    houseId: result.house.id,
    houseName: result.house.name,
    score: result.score,
    points: result.coins,
    grade: result.grade.title,
    sellerResponse: result.negotiation.response,
    strategy: result.negotiation.strategy.name,
    selectedFindings: result.selectedClues.map((clue) => ({
      id: clue.id,
      label: clue.label,
      severity: clue.severity,
      repair: clue.repair,
      type: clue.type,
    })),
    missedMajor: result.missedMajor,
    healthAverage: result.healthAverage,
  }

  try {
    await fetch('/api/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    // The game still works locally even when the serverless API is unavailable.
  }
}

function DetectiveMascot() {
  return (
    <img
      src="/images/detective.png"
      alt=""
      className="detective-mascot"
      aria-hidden="true"
    />
  )
}

function BrandMark() {
  return (
    <div className="brand-mark" aria-label="Inspection Monster Hunt">
      <span>IMH</span>
      <strong>Inspection Monster Hunt</strong>
    </div>
  )
}

function StartScreen({ onStart }) {
  return (
    <main className="start-screen">
      <BrandMark />
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">First-time buyer mini game</p>
          <h1>Inspection Monster Hunt</h1>
          <p className="subtitle">
            Defeat priority repair monsters, manage buyer confidence, use tools,
            uncover hidden issues, and negotiate with the seller after the hunt.
          </p>
          <button className="main-button" onClick={onStart}>
            Choose a House
          </button>
        </div>

        <div className="house-visual" aria-hidden="true">
          <img
            src={houses[0].image}
            alt=""
            className="hero-house-image"
          />
          <DetectiveMascot />
        </div>
      </section>
    </main>
  )
}

function LevelSelect({ completed, onSelect }) {
  return (
    <main className="level-select-screen">
      <BrandMark />
      <section className="route-header">
        <p className="eyebrow">Inspection lanes</p>
        <h1>Choose a House</h1>
        <p className="subtitle">
          Each home has different monster pressure, hidden issues, and seller difficulty.
        </p>
      </section>

      <section className="house-level-grid" aria-label="House levels">
        {houses.map((house, index) => {
          const result = completed[house.id]

          return (
            <article className="house-level-card" key={house.id}>
              <img src={house.image} alt="" />
              <span>Level {index + 1}</span>
              <h2>{house.name}</h2>
              <p>{house.summary}</p>
              <div className="house-level-stats">
                <strong>{house.listing}</strong>
                <strong>{house.tokens} tokens</strong>
                <strong>Difficulty {house.difficulty}</strong>
              </div>
              {result && (
                <div className="result-strip">
                  Best: {result.score}% | {result.grade.title}
                </div>
              )}
              <button className="main-button" onClick={() => onSelect(index)}>
                Start Level
              </button>
            </article>
          )
        })}
      </section>
    </main>
  )
}

function EvidenceImage({ clue, house }) {
  return (
    <div
      className="evidence-image"
      style={{
        '--evidence-position': clue.evidencePosition,
        '--evidence-size': clue.evidenceSize,
        backgroundImage: `linear-gradient(180deg, rgba(20, 33, 61, 0.04), rgba(20, 33, 61, 0.34)), url("${house.image}")`,
      }}
      aria-hidden="true"
    >
      <div className="evidence-scene">
        <strong>{clue.room}</strong>
        <span>{clue.label}</span>
      </div>
    </div>
  )
}

function HealthMeter({ label, value }) {
  return (
    <div className={`health-meter ${value < 35 ? 'is-danger' : ''}`}>
      <div>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <i style={{ width: `${value}%` }}></i>
    </div>
  )
}

function HouseBoard({
  battle,
  detectivePosition,
  discovered,
  highlightedId,
  house,
  onInspect,
  tokens,
  visibleClues,
}) {
  return (
    <section className="house-board" aria-label="Inspectable house">
      <div className="house-map" style={{ aspectRatio: house.aspectRatio }}>
        <img
          src={house.image}
          alt=""
          className="floor-plan-image"
        />

        {visibleClues.map((clue) => {
          const found = discovered.includes(clue.id)
          const priority = getPriority(clue)

          return (
            <button
              key={clue.id}
              className={`hotspot priority-${priority.key} severity-${clue.severity} ${
                clue.severity <= 2 ? 'is-red-herring' : ''
              } ${found ? 'is-found' : ''} ${
                highlightedId === clue.id ? 'is-highlighted' : ''
              }`}
              disabled={found || tokens < clue.cost}
              onClick={() => onInspect(clue)}
              style={{ left: `${clue.boardX}%`, top: `${clue.boardY}%` }}
              aria-label={`Defeat ${priority.name} ${clue.label} monster in ${clue.room}`}
            >
              <span className="monster-body" aria-hidden="true">
                <span className="monster-horn horn-left"></span>
                <span className="monster-horn horn-right"></span>
                <span className="monster-eye eye-left"></span>
                <span className="monster-eye eye-right"></span>
                <span className="monster-mouth"></span>
              </span>
              <span className="priority-badge">
                {found ? 'Cleared' : priority.label}
              </span>
            </button>
          )
        })}

        <div
          className="map-detective"
          aria-hidden="true"
          style={{
            left: `${detectivePosition.x}%`,
            top: `${detectivePosition.y}%`,
          }}
        >
          <DetectiveMascot />
        </div>

        {battle && (
          <div
            className="battle-burst"
            style={{ left: `${battle.x}%`, top: `${battle.y}%` }}
          >
            Defeated
          </div>
        )}
      </div>
    </section>
  )
}

function ToolPanel({ cooldowns, onUseTool }) {
  return (
    <section className="tool-panel" aria-label="Inspection tools">
      {tools.map((tool) => {
        const cooldown = cooldowns[tool.id]

        return (
          <button
            key={tool.id}
            className="tool-button"
            disabled={cooldown > 0}
            onClick={() => onUseTool(tool)}
          >
            <span>{tool.name}</span>
            <small>{cooldown > 0 ? `Cooldown ${cooldown}` : tool.text}</small>
          </button>
        )
      })}
    </section>
  )
}

function DiscoveryLog({ discovered, estimated, house, selected, onToggle }) {
  const foundClues = discovered.map((clueId) =>
    house.clues.find((clue) => clue.id === clueId),
  )

  return (
    <section className="discovery-log" aria-label="Inspection discoveries">
      <div className="section-heading">
        <span>Findings</span>
        <h2>Build your repair request</h2>
      </div>

      {foundClues.length === 0 ? (
        <div className="empty-log">
          <strong>No monsters defeated yet</strong>
          <p>Defeat priority monsters in the house to reveal what matters.</p>
        </div>
      ) : (
        foundClues.map((clue) => {
          const chosen = selected.includes(clue.id)
          const disabled = !chosen && selected.length >= requestLimit
          const priority = getPriority(clue)

          return (
            <button
              key={clue.id}
              className={`finding-card ${chosen ? 'is-selected' : ''}`}
              disabled={disabled}
              onClick={() => onToggle(clue.id)}
            >
              <EvidenceImage clue={clue} house={house} />
              <div>
                <span>{priority.label} monster defeated | {clue.type}</span>
                <strong>{clue.label}</strong>
              </div>
              <p>{clue.note}</p>
              <small>
                {clue.severity <= 2 ? 'Red herring' : `Severity ${clue.severity}/5`} | Est.{' '}
                {formatMoney(clue.repair)}
                {estimated.includes(clue.id) ? ' | Contractor checked' : ''}
              </small>
            </button>
          )
        })
      )}
    </section>
  )
}

function GameScreen({ house, onFinish }) {
  const [tokens, setTokens] = useState(house.tokens)
  const [discovered, setDiscovered] = useState([])
  const [revealed, setRevealed] = useState([])
  const [selected, setSelected] = useState([])
  const [estimated, setEstimated] = useState([])
  const [stats, setStats] = useState(house.startingHealth)
  const [cooldowns, setCooldowns] = useState({
    flashlight: 0,
    contractor: 0,
    agent: 0,
  })
  const [highlightedId, setHighlightedId] = useState('')
  const [battle, setBattle] = useState(null)
  const [coach, setCoach] = useState({
    title: 'Start with the biggest monsters',
    text: 'Critical and high-priority monsters attack the buyer fastest. Tools can reveal, estimate, or highlight the right target.',
  })

  const visibleClues = useMemo(() => visibleCluesFor(house, revealed), [house, revealed])
  const activeClues = visibleClues.filter((clue) => !discovered.includes(clue.id))
  const incomingDamage = calculateDamage(activeClues)
  const readiness = Math.round(((house.tokens - tokens) / house.tokens) * 100)
  const selectedRepairValue = selected.reduce((total, clueId) => {
    const clue = house.clues.find((entry) => entry.id === clueId)
    return total + clue.repair
  }, 0)

  function applyMonsterPressure(nextDiscovered, nextRevealed, mitigation = 1) {
    const nextVisible = visibleCluesFor(house, nextRevealed)
    const nextActive = nextVisible.filter((clue) => !nextDiscovered.includes(clue.id))
    const damage = calculateDamage(nextActive)

    setStats((current) => ({
      confidence: clamp(current.confidence - damage.confidence * mitigation),
      budget: clamp(current.budget - damage.budget * mitigation),
      deal: clamp(current.deal - damage.deal * mitigation),
    }))
  }

  function inspect(clue) {
    if (tokens < clue.cost || discovered.includes(clue.id)) return

    const priority = getPriority(clue)
    const nextDiscovered = [...discovered, clue.id]
    const chainedReveals = house.clues
      .filter((entry) => entry.hidden && entry.revealAfter === clue.id)
      .map((entry) => entry.id)
    const nextRevealed = Array.from(new Set([...revealed, ...chainedReveals]))

    setTokens((current) => current - clue.cost)
    setDiscovered(nextDiscovered)
    setRevealed(nextRevealed)
    setDetectiveAndBattle(clue)
    setHighlightedId('')
    setCooldowns((current) => tickCooldowns(current))
    applyMonsterPressure(nextDiscovered, nextRevealed)
    setCoach({
      title: `${priority.label} monster defeated: ${clue.room}`,
      text: chainedReveals.length
        ? `${clue.label}. A hidden monster appeared nearby.`
        : `${clue.label}. ${clue.note}`,
    })
  }

  function setDetectiveAndBattle(clue) {
    setBattle(null)
    setTimeout(() => {
      setBattle({ id: clue.id, x: clue.boardX, y: clue.boardY })
    }, 20)
  }

  function useTool(tool) {
    if (cooldowns[tool.id] > 0) return

    if (tool.id === 'flashlight') {
      const hiddenTarget = house.clues
        .filter((clue) => clue.hidden && !revealed.includes(clue.id))
        .sort((a, b) => b.severity - a.severity)[0]

      if (!hiddenTarget) {
        setCoach({
          title: 'Flashlight sweep clear',
          text: 'No hidden monsters remain in this house.',
        })
        return
      }

      const nextRevealed = [...revealed, hiddenTarget.id]
      setRevealed(nextRevealed)
      setHighlightedId(hiddenTarget.id)
      setCooldowns((current) => tickCooldowns(current, { flashlight: tool.cooldown }))
      applyMonsterPressure(discovered, nextRevealed, 0.6)
      setCoach({
        title: `Hidden monster revealed: ${hiddenTarget.room}`,
        text: `${hiddenTarget.label}. Defeat it before it drains the deal.`,
      })
      return
    }

    if (tool.id === 'contractor') {
      const target = discovered
        .map((clueId) => house.clues.find((clue) => clue.id === clueId))
        .filter((clue) => !estimated.includes(clue.id))
        .sort((a, b) => b.severity - a.severity)[0]

      if (!target) {
        setCoach({
          title: 'Contractor needs a target',
          text: 'Defeat a monster first, then use the estimate to strengthen negotiation leverage.',
        })
        return
      }

      setEstimated((current) => [...current, target.id])
      setStats((current) => ({
        confidence: clamp(current.confidence + 4),
        budget: clamp(current.budget + 8),
        deal: current.deal,
      }))
      setCooldowns((current) => tickCooldowns(current, { contractor: tool.cooldown }))
      applyMonsterPressure(discovered, revealed, 0.45)
      setCoach({
        title: `Estimate added: ${target.label}`,
        text: 'Contractor support gives your repair request more credibility.',
      })
      return
    }

    const target = activeClues.sort((a, b) => b.severity - a.severity)[0]

    if (!target) {
      setCoach({
        title: 'No active monsters',
        text: 'Every visible monster is already cleared. Build your repair request.',
      })
      return
    }

    setHighlightedId(target.id)
    setStats((current) => ({
      confidence: clamp(current.confidence + 8),
      budget: current.budget,
      deal: clamp(current.deal + 4),
    }))
    setCooldowns((current) => tickCooldowns(current, { agent: tool.cooldown }))
    applyMonsterPressure(discovered, revealed, 0.45)
    setCoach({
      title: `Agent highlighted: ${target.room}`,
      text: `${target.label} is the strongest active negotiation target.`,
    })
  }

  function toggleRequest(clueId) {
    setSelected((current) => {
      if (current.includes(clueId)) {
        return current.filter((id) => id !== clueId)
      }

      if (current.length >= requestLimit) return current
      return [...current, clueId]
    })
  }

  function finishInspection() {
    onFinish(
      buildInspectionReport({
        house,
        discovered,
        selected,
        estimated,
        stats,
      }),
    )
  }

  return (
    <main className="game-screen">
      <header className="game-header">
        <div>
          <p className="eyebrow">{house.name} | {house.listing}</p>
          <h1>Defeat the House Monsters</h1>
          <p className="subtitle">
            Monsters attack deal health until cleared. Use limited tokens and
            tools to uncover the issues worth negotiating.
          </p>
        </div>

        <div className="guide-card">
          <DetectiveMascot />
          <div>
            <span>Agent Nia</span>
            <p>Defeat dangerous monsters first. Cosmetic ones can wait.</p>
          </div>
        </div>

        <div className="readiness-meter">
          <span>Inspection used</span>
          <strong>{readiness}%</strong>
          <div>
            <i style={{ width: `${readiness}%` }}></i>
          </div>
        </div>
      </header>

      <section className="inspection-hud advanced-hud">
        <div>
          <span>Tokens left</span>
          <strong>{tokens}</strong>
        </div>
        <div>
          <span>Findings</span>
          <strong>{discovered.length}</strong>
        </div>
        <div>
          <span>Request value</span>
          <strong>{formatMoney(selectedRepairValue)}</strong>
        </div>
        <div>
          <span>Incoming attack</span>
          <strong>{incomingDamage.confidence + incomingDamage.budget + incomingDamage.deal}</strong>
        </div>
      </section>

      <section className="health-grid" aria-label="Deal health">
        <HealthMeter label="Buyer confidence" value={stats.confidence} />
        <HealthMeter label="Budget safety" value={stats.budget} />
        <HealthMeter label="Deal health" value={stats.deal} />
      </section>

      <ToolPanel cooldowns={cooldowns} onUseTool={useTool} />

      <section className="play-tip">
        <span>Buyer lesson</span>
        <p>
          Critical and High monsters are the best repair-request targets. Hidden
          monsters can appear after related problems or from the flashlight tool.
          Cosmetic issues are usually weaker negotiation anchors.
        </p>
      </section>

      <div className="inspection-layout">
        <HouseBoard
          battle={battle}
          detectivePosition={battle || { x: 38, y: 25 }}
          discovered={discovered}
          highlightedId={highlightedId}
          house={house}
          onInspect={inspect}
          tokens={tokens}
          visibleClues={visibleClues}
        />
        <DiscoveryLog
          discovered={discovered}
          estimated={estimated}
          house={house}
          selected={selected}
          onToggle={toggleRequest}
        />
      </div>

      <section className="feedback-panel correct" aria-live="polite">
        <span>Inspector note</span>
        <strong>{coach.title}</strong>
        <p>{coach.text}</p>
      </section>

      <button
        className="main-button finish-button"
        disabled={selected.length === 0}
        onClick={finishInspection}
      >
        Go to Negotiation
      </button>
    </main>
  )
}

function NegotiationScreen({ report, onFinish }) {
  const [strategyId, setStrategyId] = useState('credit')
  const strategy = negotiationStrategies.find((entry) => entry.id === strategyId)
  const preview = calculateNegotiation(report, strategy)

  function finishNegotiation() {
    const negotiation = calculateNegotiation(report, strategy)
    const result = {
      ...report,
      negotiation,
      score: negotiation.score,
      coins: 45 + negotiation.score + Math.round(negotiation.credit / 500),
    }

    onFinish({
      ...result,
      grade: getGrade(result),
    })
  }

  return (
    <main className="negotiation-screen">
      <section className="result-card negotiation-card">
        <p className="eyebrow">Final phase</p>
        <h1>Seller Negotiation</h1>
        <p className="subtitle">
          Pick the tone of your repair request. The seller response depends on
          issue priority, supporting estimates, ask size, and remaining deal health.
        </p>

        <div className="lesson-recap">
          <strong>Repair request</strong>
          <p>
            {report.selectedClues
              .map((clue) => `${clue.label} (${formatMoney(clue.repair)})`)
              .join(', ')}
          </p>
        </div>

        <section className="strategy-grid" aria-label="Negotiation strategy">
          {negotiationStrategies.map((entry) => (
            <button
              className={`strategy-card ${entry.id === strategyId ? 'is-selected' : ''}`}
              key={entry.id}
              onClick={() => setStrategyId(entry.id)}
            >
              <span>{entry.tone}</span>
              <strong>{entry.name}</strong>
              <p>{entry.text}</p>
            </button>
          ))}
        </section>

        <div className="seller-preview">
          <div>
            <span>Likely response</span>
            <strong>{preview.response}</strong>
          </div>
          <div>
            <span>Seller comfort</span>
            <strong>{preview.sellerScore}%</strong>
          </div>
          <div>
            <span>Expected value</span>
            <strong>{formatMoney(preview.credit)}</strong>
          </div>
        </div>

        <button className="main-button" onClick={finishNegotiation}>
          Send Request
        </button>
      </section>
    </main>
  )
}

function ResultScreen({ result, onNextHouse, onReplay, hasNextHouse }) {
  const topFindings = result.selectedClues
    .map((clue) => `${clue.label} (${formatMoney(clue.repair)})`)
    .join(', ')

  return (
    <main className="result-screen">
      <BrandMark />

      <section className="result-card">
        <p className="eyebrow">Inspection report</p>
        <h1>{result.grade.title}</h1>

        <div className="score-orbit">
          <span>{result.score}%</span>
          <small>{result.coins} Buyer Points</small>
        </div>

        <p className="subtitle">{result.grade.text}</p>

        <div className="comparison-grid">
          <div>
            <span>Seller response</span>
            <strong>{result.negotiation.response}</strong>
            <p>
              Strategy: {result.negotiation.strategy.name}. Expected value:{' '}
              {formatMoney(result.negotiation.credit)}.
            </p>
          </div>

          <div>
            <span>Deal health</span>
            <strong>{result.healthAverage}%</strong>
            <p>Higher deal health means the buyer stayed calm and financially safer.</p>
          </div>

          <div className="best-choice">
            <span>Still needs follow-up</span>
            <strong>{result.missedMajor}</strong>
            <p>Major monsters not selected may still need specialist review.</p>
          </div>
        </div>

        <div className="lesson-recap">
          <strong>Your request</strong>
          <p>{topFindings || 'No issues selected.'}</p>
        </div>

        <div className="result-actions">
          <button className="main-button" onClick={onReplay}>
            Replay House
          </button>
          {hasNextHouse && (
            <button className="main-button alt-button" onClick={onNextHouse}>
              Next House
            </button>
          )}
        </div>
      </section>
    </main>
  )
}

function App() {
  const [screen, setScreen] = useState('start')
  const [houseIndex, setHouseIndex] = useState(0)
  const [report, setReport] = useState(null)
  const [result, setResult] = useState(null)
  const [completed, setCompleted] = useState({})
  const [backendStatus, setBackendStatus] = useState('')
  const house = houses[houseIndex]

  useEffect(() => {
    let active = true

    fetch('/api/health')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (active && data?.status) {
          setBackendStatus(data.status)
        }
      })
      .catch(() => {
        if (active) {
          setBackendStatus('')
        }
      })

    return () => {
      active = false
    }
  }, [])

  function chooseHouse(index) {
    setHouseIndex(index)
    setReport(null)
    setResult(null)
    setScreen('game')
    window.scrollTo({ top: 0, left: 0 })
  }

  function finishInspection(nextReport) {
    setReport(nextReport)
    setScreen('negotiation')
    window.scrollTo({ top: 0, left: 0 })
  }

  function finishGame(nextResult) {
    setResult(nextResult)
    void submitAttempt(nextResult)
    setCompleted((current) => ({
      ...current,
      [nextResult.house.id]: nextResult,
    }))
    setScreen('result')
    window.scrollTo({ top: 0, left: 0 })
  }

  function replay() {
    chooseHouse(houseIndex)
  }

  function nextHouse() {
    chooseHouse(Math.min(houseIndex + 1, houses.length - 1))
  }

  return (
    <div className="app">
      {screen === 'start' && <StartScreen onStart={() => setScreen('levels')} />}
      {screen === 'levels' && (
        <LevelSelect completed={completed} onSelect={chooseHouse} />
      )}
      {screen === 'game' && (
        <GameScreen key={house.id} house={house} onFinish={finishInspection} />
      )}
      {screen === 'negotiation' && report && (
        <NegotiationScreen report={report} onFinish={finishGame} />
      )}
      {screen === 'result' && result && (
        <ResultScreen
          result={result}
          hasNextHouse={houseIndex < houses.length - 1}
          onNextHouse={nextHouse}
          onReplay={replay}
        />
      )}
      {backendStatus && (
        <div className="backend-pill" aria-live="polite">
          Backend {backendStatus}
        </div>
      )}
    </div>
  )
}

export default App
