import { useMemo, useState } from 'react'

const clues = [
  {
    id: 'panel',
    room: 'Basement',
    label: 'Warm electrical panel',
    x: 19,
    y: 72,
    cost: 2,
    severity: 5,
    repair: 4200,
    type: 'Safety',
    photoType: 'electrical',
    note: 'Warm panels can signal overloaded circuits or unsafe wiring. This is worth specialist follow-up.',
  },
  {
    id: 'crack',
    room: 'Basement',
    label: 'Stair-step foundation crack',
    x: 38,
    y: 78,
    cost: 2,
    severity: 5,
    repair: 6800,
    type: 'Structural',
    photoType: 'foundation',
    note: 'Patterned cracks can point to movement. A buyer should not treat this like cosmetic paint damage.',
  },
  {
    id: 'stain',
    room: 'Kitchen',
    label: 'Ceiling water stain',
    x: 52,
    y: 31,
    cost: 1,
    severity: 4,
    repair: 3100,
    type: 'Moisture',
    photoType: 'water',
    note: 'Water stains may mean an active roof, plumbing, or ventilation issue. Ask what caused it.',
  },
  {
    id: 'sink',
    room: 'Kitchen',
    label: 'Slow sink leak',
    x: 72,
    y: 52,
    cost: 1,
    severity: 3,
    repair: 850,
    type: 'Plumbing',
    photoType: 'plumbing',
    note: 'Small leaks are common, but they can create cabinet damage and mold if ignored.',
  },
  {
    id: 'roof',
    room: 'Exterior',
    label: 'Curling roof shingles',
    x: 67,
    y: 16,
    cost: 2,
    severity: 4,
    repair: 5200,
    type: 'Roof',
    photoType: 'roof',
    note: 'A tired roof can become a major near-term cost. It belongs in the negotiation conversation.',
  },
  {
    id: 'window',
    room: 'Bedroom',
    label: 'Painted-shut window',
    x: 31,
    y: 43,
    cost: 1,
    severity: 2,
    repair: 450,
    type: 'Usability',
    photoType: 'window',
    note: 'This matters for safety and ventilation, but it is less urgent than structural or electrical risk.',
  },
  {
    id: 'tile',
    room: 'Bathroom',
    label: 'Loose bathroom tile',
    x: 82,
    y: 37,
    cost: 1,
    severity: 2,
    repair: 700,
    type: 'Surface',
    photoType: 'tile',
    note: 'Loose tile is worth noting, especially near water, but it is usually not the top negotiation item.',
  },
  {
    id: 'paint',
    room: 'Living Room',
    label: 'Scuffed wall paint',
    x: 47,
    y: 60,
    cost: 1,
    severity: 1,
    repair: 180,
    type: 'Cosmetic',
    photoType: 'paint',
    note: 'Cosmetic wear is normal. Spending negotiation energy here can distract from bigger buyer risks.',
  },
]

const maxTokens = 8
const requestLimit = 3

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function StartScreen({ onStart }) {
  return (
    <main className="start-screen">
      <img src="/images/nest-logo.png" alt="Nest Navigate" className="logo" />
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Home inspection mini-game</p>
          <h1>Inspection Detective</h1>
          <p className="subtitle">
            Explore a house, spend limited inspection tokens, uncover hidden
            repair risks, and choose what belongs in your negotiation request.
          </p>
          <button className="main-button" onClick={onStart}>
            Start Inspection
          </button>
        </div>

        <div className="house-visual" aria-hidden="true">
          <div className="roof-shape"></div>
          <div className="house-cutaway">
            <div>Kitchen</div>
            <div>Bedroom</div>
            <div>Bath</div>
            <div>Basement</div>
          </div>
          <DetectiveMascot />
        </div>
      </section>
    </main>
  )
}

function DetectiveMascot() {
  return (
    <div className="detective-mascot" aria-hidden="true">
      <div className="detective-hat"></div>
      <div className="detective-head">
        <span></span>
        <span></span>
      </div>
      <div className="detective-coat">
        <i></i>
      </div>
      <div className="detective-glass"></div>
    </div>
  )
}

function EvidenceImage({ clue }) {
  return (
    <div className={`evidence-image evidence-${clue.photoType}`} aria-hidden="true">
      <div className="evidence-wall"></div>
      <div className="evidence-detail detail-one"></div>
      <div className="evidence-detail detail-two"></div>
      <span>{clue.room}</span>
    </div>
  )
}

function HouseBoard({ detectivePosition, discovered, onInspect, tokens }) {
  const [beam, setBeam] = useState({ x: 50, y: 50 })

  function moveBeam(event) {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100

    setBeam({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    })
  }

  return (
    <section className="house-board" aria-label="Inspectable house">
      <div
        className="house-map"
        onMouseMove={moveBeam}
        onPointerMove={moveBeam}
        style={{ '--beam-x': `${beam.x}%`, '--beam-y': `${beam.y}%` }}
      >
        <div className="flashlight-beam" aria-hidden="true"></div>
        <div className="room room-kitchen">Kitchen</div>
        <div className="room room-bedroom">Bedroom</div>
        <div className="room room-bath">Bath</div>
        <div className="room room-living">Living</div>
        <div className="room room-basement">Basement</div>
        <div className="room room-yard">Exterior</div>
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
        {clues.map((clue) => {
          const found = discovered.includes(clue.id)

          return (
            <button
              className={`hotspot severity-${clue.severity} ${
                clue.severity <= 2 ? 'is-red-herring' : ''
              } ${found ? 'is-found' : ''}`}
              disabled={found || tokens < clue.cost}
              key={clue.id}
              onClick={() => onInspect(clue)}
              style={{ left: `${clue.x}%`, top: `${clue.y}%` }}
              aria-label={`Inspect ${clue.room}`}
            >
              {found ? (clue.severity <= 2 ? 'C' : '!') : clue.cost}
            </button>
          )
        })}
      </div>
    </section>
  )
}

function DiscoveryLog({ discovered, selected, onToggle }) {
  const foundClues = clues.filter((clue) => discovered.includes(clue.id))

  return (
    <section className="discovery-log" aria-label="Inspection discoveries">
      <div className="section-heading">
        <span>Findings</span>
        <h2>Build your repair request</h2>
      </div>
      {foundClues.length === 0 ? (
        <div className="empty-log">
          <strong>No findings yet</strong>
          <p>Inspect suspicious spots in the house to reveal what matters.</p>
        </div>
      ) : (
        foundClues.map((clue) => {
          const chosen = selected.includes(clue.id)
          const disabled = !chosen && selected.length >= requestLimit

          return (
            <button
              className={`finding-card ${chosen ? 'is-selected' : ''}`}
              disabled={disabled}
              key={clue.id}
              onClick={() => onToggle(clue.id)}
            >
              <EvidenceImage clue={clue} />
              <div>
                <span>{clue.type}</span>
                <strong>{clue.label}</strong>
              </div>
              <p>{clue.note}</p>
              <small>
                {clue.severity <= 2 ? 'Red herring' : `Severity ${clue.severity}/5`} • Est. {formatMoney(clue.repair)}
              </small>
            </button>
          )
        })
      )}
    </section>
  )
}

function GameScreen({ onFinish }) {
  const [tokens, setTokens] = useState(maxTokens)
  const [discovered, setDiscovered] = useState([])
  const [selected, setSelected] = useState([])
  const [detectivePosition, setDetectivePosition] = useState({ x: 50, y: 58 })
  const [coach, setCoach] = useState({
    title: 'Start with the suspicious spots',
    text: 'You have limited inspection tokens. Spend more on clues that could hide expensive safety, roof, water, or structural issues.',
  })

  const readiness = Math.round(((maxTokens - tokens) / maxTokens) * 100)
  const selectedRepairValue = useMemo(
    () =>
      selected.reduce((total, clueId) => {
        const clue = clues.find((entry) => entry.id === clueId)
        return total + clue.repair
      }, 0),
    [selected],
  )

  function inspect(clue) {
    if (tokens < clue.cost || discovered.includes(clue.id)) return

    setTokens((current) => current - clue.cost)
    setDiscovered((current) => [...current, clue.id])
    setDetectivePosition({ x: clue.x, y: clue.y })
    setCoach({
      title: `${clue.room}: ${clue.label}`,
      text: clue.note,
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
    const selectedClues = selected.map((clueId) =>
      clues.find((clue) => clue.id === clueId),
    )
    const riskScore = selectedClues.reduce(
      (total, clue) => total + clue.severity * 12,
      0,
    )
    const cosmeticPenalty = selectedClues.some((clue) => clue.severity <= 1)
      ? 12
      : 0
    const missedMajor = clues.filter(
      (clue) => clue.severity >= 4 && !selected.includes(clue.id),
    ).length
    const score = Math.max(
      0,
      Math.min(100, riskScore - cosmeticPenalty - missedMajor * 8),
    )

    onFinish({
      score,
      selectedClues,
      discoveredCount: discovered.length,
      selectedRepairValue,
      followUpCount: missedMajor,
      coins: 45 + score,
    })
  }

  return (
    <main className="game-screen">
      <header className="game-header">
        <div>
          <p className="eyebrow">Personalized neighborhood: Inspection lane</p>
          <h1>Inspect the house</h1>
          <p className="subtitle">
            Sweep the house with your flashlight, spend inspection tokens on
            suspicious spots, then choose up to three issues for negotiation.
          </p>
        </div>
        <div className="guide-card">
          <DetectiveMascot />
          <div>
            <span>Agent Nia</span>
            <p>Find deal-changing risks, then ignore the cosmetic noise.</p>
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

      <section className="inspection-hud">
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
      </section>

      <section className="play-tip" aria-label="How to inspect">
        <span>Detective tip</span>
        <p>
          Numbered spots cost inspection tokens. Exclamation marks are serious
          findings; C marks cosmetic red herrings that can distract from bigger risks.
        </p>
      </section>

      <div className="inspection-layout">
        <HouseBoard
          detectivePosition={detectivePosition}
          discovered={discovered}
          onInspect={inspect}
          tokens={tokens}
        />
        <DiscoveryLog
          discovered={discovered}
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
        Submit Repair Request
      </button>
    </main>
  )
}

function ResultScreen({ result, onReplay }) {
  const won = result.score >= 72
  const topFindings = result.selectedClues
    .map((clue) => `${clue.label} (${formatMoney(clue.repair)})`)
    .join(', ')

  return (
    <main className="result-screen">
      <img src="/images/nest-logo.png" alt="Nest Navigate" className="logo" />
      <section className="result-card">
        <p className="eyebrow">Inspection report</p>
        <h1>{won ? 'Sharp buyer instincts' : 'Needs a second look'}</h1>
        <div className="score-orbit">
          <span>{result.score}%</span>
          <small>{result.coins} Nest Coins</small>
        </div>
        <p className="subtitle">
          You found {result.discoveredCount} issues and built a repair request
          worth {formatMoney(result.selectedRepairValue)}.
        </p>
        <div className="lesson-recap">
          <strong>Your request</strong>
          <p>{topFindings || 'No issues selected.'}</p>
        </div>
        <div className="comparison-grid" aria-label="Inspection learning summary">
          <div>
            <span>Best buyer move</span>
            <strong>Prioritize risk</strong>
            <p>Safety, structure, roof, and moisture usually matter more than cosmetics.</p>
          </div>
          <div>
            <span>Still needs follow-up</span>
            <strong>{result.followUpCount}</strong>
            <p>Some major findings may need a specialist even if they are not in the top request.</p>
          </div>
          <div className="best-choice">
            <span>What this teaches</span>
            <strong>Negotiate wisely</strong>
            <p>Inspection is not about finding everything. It is about knowing what changes the deal.</p>
          </div>
        </div>
        <button className="main-button" onClick={onReplay}>
          Inspect Again
        </button>
      </section>
    </main>
  )
}

function App() {
  const [screen, setScreen] = useState('start')
  const [result, setResult] = useState(null)

  function finishGame(nextResult) {
    setResult(nextResult)
    setScreen('result')
    window.scrollTo({ top: 0, left: 0 })
  }

  function replay() {
    setResult(null)
    setScreen('game')
    window.scrollTo({ top: 0, left: 0 })
  }

  return (
    <div className="app">
      {screen === 'start' && <StartScreen onStart={() => setScreen('game')} />}
      {screen === 'game' && <GameScreen onFinish={finishGame} />}
      {screen === 'result' && result && (
        <ResultScreen result={result} onReplay={replay} />
      )}
    </div>
  )
}

export default App
