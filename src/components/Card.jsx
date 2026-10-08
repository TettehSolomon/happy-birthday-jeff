import { motion, AnimatePresence } from 'framer-motion'

const BASE = import.meta.env.BASE_URL

// Tilt/rotate feel carried over from the CSS carousel this reel is based
// on: the card rides in tilted from the bottom-right, straightens to
// center, then rotates out to the bottom-left as the next one arrives —
// while a blurred, slowly-settling copy of the same image drifts behind it.
const cardVariants = {
  enter: { opacity: 0, x: 110, rotateZ: 22, transformOrigin: '150% 200%' },
  center: { opacity: 1, x: 0, rotateZ: 0, transformOrigin: '50% 200%' },
  exit: { opacity: 0, x: -110, rotateZ: -22, transformOrigin: '-50% 200%' },
}

export default function Card({ card }) {
  const src = `${BASE}art/${card.image}`
  const isSignature = card.signature

  return (
    <div className={`card-scene${isSignature ? ' card-scene--signature' : ''}`}>
      <AnimatePresence>
        <motion.div
          key={`${card.id}-bg`}
          className={`card-bg${isSignature ? ' card-bg--signature' : ''}`}
          style={isSignature ? undefined : { backgroundImage: `url('${src}')` }}
          initial={{ opacity: 0, scale: 1.18 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      <div className="card-box-anchor">
        <AnimatePresence>
          <motion.div
            key={card.id}
            className={`card-box${isSignature ? ' card-box--signature' : ''}`}
            style={isSignature ? undefined : { backgroundImage: `url('${src}')` }}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.7, ease: [0.36, 0, 0.69, 1] }}
          >
            {isSignature ? (
              <div className="card-signature">
                <img className="card-signature__logo" src={src} alt="Blue Ink Apartments" />
                <p className="card-signature__caption">{card.verse}</p>
                <div className="card-signature__hearts">{card.ref}</div>
              </div>
            ) : (
              <>
                <div className="card-overlay" />
                <div className="card-info">
                  <div className="card-theme">{card.theme}</div>
                  <p className="card-verse">&ldquo;{card.verse}&rdquo;</p>
                  <div className="card-ref">{card.ref}</div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
