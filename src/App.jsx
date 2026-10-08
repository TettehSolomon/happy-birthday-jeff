import { useCallback, useEffect, useRef, useState } from 'react'
import { cards, DWELL_MS } from './data/cards.js'
import Card from './components/Card.jsx'
import './styles/app.css'

// How far (px) a horizontal drag must travel to count as a swipe.
const SWIPE_THRESHOLD = 45

export default function App() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  // +1 = moving forward (card slides in from the right), -1 = backward.
  const [direction, setDirection] = useState(1)
  const gesture = useRef(null)

  const advance = useCallback(() => {
    setDirection(1)
    setIndex((i) => (i + 1) % cards.length)
  }, [])

  const retreat = useCallback(() => {
    setDirection(-1)
    setIndex((i) => (i - 1 + cards.length) % cards.length)
  }, [])

  // The Cards autoplay loops forever — there is no "end" to rest on.
  useEffect(() => {
    if (!playing) return
    const t = setTimeout(advance, DWELL_MS)
    return () => clearTimeout(t)
  }, [playing, index, advance])

  // Track the start of a touch/mouse gesture so pointer-up can tell a
  // horizontal swipe apart from a plain tap.
  const onPointerDown = (e) => {
    if (e.target.closest('.play-btn')) return
    gesture.current = { x: e.clientX, y: e.clientY }
  }

  const onPointerUp = (e) => {
    if (e.target.closest('.play-btn')) return
    const start = gesture.current
    gesture.current = null
    if (!start) return

    const dx = e.clientX - start.x
    const dy = e.clientY - start.y

    // A mostly-horizontal drag past the threshold is a swipe: left →
    // next card, right → previous. Anything else is treated as a tap,
    // which pauses the reel (same as before).
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? advance() : retreat()
    } else {
      setPlaying(false)
    }
  }

  return (
    <div className="app" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
      <Card card={cards[index]} direction={direction} />

      <div className="ui-top">
        <div className="story-bar">
          {cards.map((card, i) => (
            <div key={card.id} className="story-segment">
              {i < index && <div className="story-fill" style={{ width: '100%' }} />}
              {i === index && (
                <div
                  key={`${card.id}-${index}`}
                  className="story-fill story-fill--active"
                  style={{
                    animationDuration: `${DWELL_MS}ms`,
                    animationPlayState: playing ? 'running' : 'paused',
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="episode-tag">Happy Birthday · Armani of Lagos 🎉</div>
      </div>

      <div className="ui-bottom">
        <button
          className="play-btn"
          onClick={(e) => {
            e.stopPropagation()
            setPlaying((p) => !p)
          }}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? '❙❙' : '▶'}
        </button>
      </div>
    </div>
  )
}
