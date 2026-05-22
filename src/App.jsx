import { useMemo, useState } from 'react'

const feeCards = [
  {
    id: 'origination',
    label: 'Origination fee',
    amount: '$1,980',
    clue: 'A lender charge for making the loan. Compare it before you commit.',
    category: 'lender',
  },
  {
    id: 'credit',
    label: 'Credit report',
    amount: '$55',
    clue: 'A small lender-side service charge that usually appears early.',
    category: 'lender',
  },
  {
    id: 'title',
    label: 'Title search',
    amount: '$725',
    clue: 'This protects against ownership surprises. Buyers can often shop it.',
    category: 'shop',
  },
  {
    id: 'inspection',
    label: 'Home inspection',
    amount: '$525',
    clue: 'This is your chance to understand the house before closing.',
    category: 'shop',
  },
  {
    id: 'taxes',
    label: 'Property tax escrow',
    amount: '$1,340',
    clue: 'Money collected now so future tax bills do not hit all at once.',
    category: 'prepaid',
  },
  {
    id: 'insurance',
    label: 'Homeowners insurance prepaid',
    amount: '$910',
    clue: 'Paid up front so coverage is active when the loan closes.',
    category: 'prepaid',
  },
]

const categories = [
  {
    id: 'lender',
    title: 'Lender charges',
    detail: 'Fees from the lender or required to process the loan.',
  },
  {
    id: 'shop',
    title: 'Can shop for',
    detail: 'Services where comparing providers may save cash.',
  },
  {
    id: 'prepaid',
    title: 'Prepaids & escrow',
    detail: 'Upfront money for taxes, insurance, and future bills.',
  },
]

const loanChoices = [
  {
    id: 'spark',
    name: 'Spark Bank',
    rate: '6.72%',
    monthly: 2475,
    cashToClose: 18400,
    note: 'Lowest monthly payment, but the cash due at closing is heavy.',
    best: false,
  },
  {
    id: 'nest',
    name: 'Nest Credit Union',
    rate: '6.88%',
    monthly: 2515,
    cashToClose: 15100,
    note: 'Balanced monthly payment and keeps a healthier emergency cushion.',
    best: true,
  },
  {
    id: 'rocket',
    name: 'Rocket Oak Lending',
    rate: '7.05%',
    monthly: 2590,
    cashToClose: 13450,
    note: 'Cheapest to close, but the monthly payment strains the budget.',
    best: false,
  },
]

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
          <p className="eyebrow">Loan estimate mini-game</p>
          <h1>Loan Estimate Decoder</h1>
          <p className="subtitle">
            Sort real-looking loan fees, spot what can be compared, and choose
            the offer that keeps both monthly payment and cash-to-close in range.
          </p>
          <button className="main-button" onClick={onStart}>
            Decode the Estimate
          </button>
        </div>

        <div className="estimate-visual" aria-hidden="true">
          <div className="estimate-sheet">
            <div className="sheet-header">
              <span>Loan Estimate</span>
              <strong>Page 2</strong>
            </div>
            <div className="fee-line wide"></div>
            <div className="fee-line"></div>
            <div className="fee-line short"></div>
            <div className="stamp">Shop?</div>
          </div>
          <div className="coin-burst">+80</div>
        </div>
      </section>
    </main>
  )
}

function CardStack({ placements, activeCard, onSelect, onDragStart }) {
  const remaining = feeCards.filter((card) => !placements[card.id])

  return (
    <section className="card-stack" aria-label="Fee cards">
      <div className="section-heading">
        <span>Step 1</span>
        <h2>Sort each fee</h2>
      </div>
      {remaining.length === 0 ? (
        <div className="empty-stack">
          <strong>Estimate decoded</strong>
          <p>All fee cards are sorted. Now choose the better loan path.</p>
        </div>
      ) : (
        remaining.map((card) => (
          <button
            className={`fee-card ${activeCard === card.id ? 'is-active' : ''}`}
            draggable
            key={card.id}
            onDragStart={(event) => onDragStart(event, card.id)}
            onClick={() => onSelect(card.id)}
          >
            <span>{card.label}</span>
            <strong>{card.amount}</strong>
            <small>{card.clue}</small>
          </button>
        ))
      )}
    </section>
  )
}

function CategoryBoard({ placements, activeCard, onDropCard, onPlace }) {
  return (
    <section className="category-board" aria-label="Sorting categories">
      {categories.map((category) => {
        const sortedCards = feeCards.filter(
          (card) => placements[card.id] === category.id,
        )

        return (
          <button
            className="category-bin"
            disabled={!activeCard}
            key={category.id}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => onDropCard(event, category.id)}
            onClick={() => onPlace(category.id)}
          >
            <span>{category.title}</span>
            <p>{category.detail}</p>
            <strong>{sortedCards.length}</strong>
          </button>
        )
      })}
    </section>
  )
}

function LoanChoice({ choice, disabled, selectedLoan, onSelect }) {
  return (
    <button
      className={`loan-choice ${selectedLoan === choice.id ? 'is-selected' : ''}`}
      disabled={disabled}
      onClick={() => onSelect(choice.id)}
    >
      <div>
        <span>{choice.name}</span>
        <strong>{choice.rate}</strong>
      </div>
      <dl>
        <div>
          <dt>Monthly</dt>
          <dd>{formatMoney(choice.monthly)}</dd>
        </div>
        <div>
          <dt>Cash to close</dt>
          <dd>{formatMoney(choice.cashToClose)}</dd>
        </div>
      </dl>
      <p>{choice.note}</p>
    </button>
  )
}

function GameScreen({ onFinish }) {
  const [placements, setPlacements] = useState({})
  const [activeCard, setActiveCard] = useState(feeCards[0].id)
  const [selectedLoan, setSelectedLoan] = useState('')
  const [feedback, setFeedback] = useState({
    tone: 'neutral',
    title: 'Drag a fee card',
    text: 'Drop it into the Loan Estimate bucket where it belongs. You can also click a card, then click a bucket.',
  })

  const sortedCount = Object.keys(placements).length
  const sortScore = useMemo(
    () =>
      feeCards.reduce(
        (score, card) => score + (placements[card.id] === card.category ? 1 : 0),
        0,
      ),
    [placements],
  )
  const progress = Math.round((sortedCount / feeCards.length) * 100)
  const canChooseLoan = sortedCount === feeCards.length

  function selectNextCard(currentPlacements) {
    const remaining = feeCards.filter((card) => !currentPlacements[card.id])

    setActiveCard(remaining[0]?.id || '')
  }

  function placeSpecificCard(cardId, categoryId) {
    const card = feeCards.find((feeCard) => feeCard.id === cardId)
    if (!card || placements[card.id]) return

    const category = categories.find((entry) => entry.id === categoryId)
    const correctCategory = categories.find((entry) => entry.id === card.category)
    const nextPlacements = { ...placements, [card.id]: categoryId }

    setPlacements(nextPlacements)
    setFeedback(
      categoryId === card.category
        ? {
            tone: 'correct',
            title: `Correct: ${card.label}`,
            text: `${card.label} belongs in ${category.title}. ${card.clue}`,
          }
        : {
            tone: 'miss',
            title: `Not quite: ${card.label}`,
            text: `${card.label} is usually ${correctCategory.title.toLowerCase()}, not ${category.title.toLowerCase()}. ${card.clue}`,
          },
    )
    selectNextCard(nextPlacements)
  }

  function placeCard(categoryId) {
    if (!activeCard) return

    placeSpecificCard(activeCard, categoryId)
  }

  function startDrag(event, cardId) {
    setActiveCard(cardId)
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', cardId)
  }

  function dropCard(event, categoryId) {
    event.preventDefault()
    const cardId = event.dataTransfer.getData('text/plain')

    placeSpecificCard(cardId, categoryId)
  }

  function finishRound() {
    const chosenLoan = loanChoices.find((choice) => choice.id === selectedLoan)
    const loanBonus = chosenLoan?.best ? 30 : 10
    const score = Math.min(100, Math.round((sortScore / feeCards.length) * 70 + loanBonus))

    onFinish({
      score,
      sortScore,
      chosenLoan,
      coins: 40 + score,
      placements,
    })
  }

  return (
    <main className="game-screen">
      <header className="game-header">
        <div>
          <p className="eyebrow">Personalized neighborhood: Closing lane</p>
          <h1>Decode the estimate</h1>
          <p className="subtitle">
            Drag fee cards into the right section, then pick the loan estimate
            that protects the buyer after closing day.
          </p>
        </div>
        <div className="readiness-meter">
          <span>Readiness</span>
          <strong>{progress}%</strong>
          <div>
            <i style={{ width: `${progress}%` }}></i>
          </div>
        </div>
      </header>

      <div className="decoder-layout">
        <CardStack
          activeCard={activeCard}
          placements={placements}
          onDragStart={startDrag}
          onSelect={setActiveCard}
        />
        <CategoryBoard
          activeCard={activeCard}
          placements={placements}
          onDropCard={dropCard}
          onPlace={placeCard}
        />
      </div>

      <section className={`feedback-panel ${feedback.tone}`} aria-live="polite">
        <span>Coach note</span>
        <strong>{feedback.title}</strong>
        <p>{feedback.text}</p>
      </section>

      <section className={`loan-panel ${canChooseLoan ? '' : 'is-muted'}`}>
        <div className="section-heading">
          <span>Step 2</span>
          <h2>Choose the healthier loan</h2>
        </div>
        <div className="loan-grid">
          {loanChoices.map((choice) => (
            <LoanChoice
              choice={choice}
              disabled={!canChooseLoan}
              key={choice.id}
              selectedLoan={selectedLoan}
              onSelect={setSelectedLoan}
            />
          ))}
        </div>
        <button
          className="main-button finish-button"
          disabled={!canChooseLoan || !selectedLoan}
          onClick={finishRound}
        >
          Reveal My Readiness
        </button>
      </section>
    </main>
  )
}

function ResultScreen({ result, onReplay }) {
  const won = result.score >= 75
  const lowestMonthly = loanChoices.reduce((best, choice) =>
    choice.monthly < best.monthly ? choice : best,
  )
  const lowestCash = loanChoices.reduce((best, choice) =>
    choice.cashToClose < best.cashToClose ? choice : best,
  )
  const healthiest = loanChoices.find((choice) => choice.best)
  const lesson =
    'Cash to close is more than the down payment. A smart buyer checks lender charges, shop-able services, prepaids, monthly payment, and emergency cushion together.'

  return (
    <main className="result-screen">
      <img src="/images/nest-logo.png" alt="Nest Navigate" className="logo" />
      <section className="result-card">
        <p className="eyebrow">Decoded report</p>
        <h1>{won ? 'Buyer-ready instincts' : 'Keep decoding'}</h1>
        <div className="score-orbit">
          <span>{result.score}%</span>
          <small>{result.coins} Nest Coins</small>
        </div>
        <p className="subtitle">
          You sorted {result.sortScore} of {feeCards.length} fee cards correctly
          and chose {result.chosenLoan.name}. {result.chosenLoan.best
            ? 'That was the healthiest overall estimate.'
            : 'The better pick was Nest Credit Union because it balanced monthly payment with cash left after closing.'}
        </p>
        <div className="lesson-recap">
          <strong>What this teaches</strong>
          <p>{lesson}</p>
        </div>
        <div className="comparison-grid" aria-label="Loan comparison summary">
          <div>
            <span>Lowest monthly</span>
            <strong>{lowestMonthly.name}</strong>
            <p>{formatMoney(lowestMonthly.monthly)} per month</p>
          </div>
          <div>
            <span>Lowest cash to close</span>
            <strong>{lowestCash.name}</strong>
            <p>{formatMoney(lowestCash.cashToClose)} due at closing</p>
          </div>
          <div className="best-choice">
            <span>Healthiest overall</span>
            <strong>{healthiest.name}</strong>
            <p>Balances payment pressure with post-closing cushion.</p>
          </div>
        </div>
        <button className="main-button" onClick={onReplay}>
          Play Again
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
