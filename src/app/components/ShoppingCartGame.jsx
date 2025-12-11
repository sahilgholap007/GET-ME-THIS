"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Game constants
const GAME_WIDTH = 700
const GAME_HEIGHT = 350
const CART_WIDTH = 80
const CART_HEIGHT = 50
const ITEM_SIZE = 40
const PARACHUTE_HEIGHT = 30
const GROUND_HEIGHT = 10

// Product types with their emoji representations and point values
const PRODUCTS = [
  { type: "gift", emoji: "🎁", points: 30, color: "#FF6B6B" },
  { type: "shoes", emoji: "👟", points: 40, color: "#4ECDC4" },
  { type: "glasses", emoji: "👓", points: 50, color: "#45B7D1" },
  { type: "bag", emoji: "👜", points: 60, color: "#96CEB4" },
  { type: "watch", emoji: "⌚", points: 80, color: "#FFEAA7" },
  { type: "phone", emoji: "📱", points: 100, color: "#DDA0DD" },
]

// Golden bonus item
const GOLDEN_ITEM = { type: "golden", emoji: "⭐", points: 0, color: "#FFD700" }

export default function ShoppingCartGame() {
  const canvasRef = useRef(null)
  const gameStateRef = useRef({
    cart: { x: GAME_WIDTH / 2 - CART_WIDTH / 2, y: GAME_HEIGHT - CART_HEIGHT - GROUND_HEIGHT },
    items: [],
    particles: [],
    score: 0,
    highScore: 0,
    lives: 3,
    missedCount: 0,
    combo: 0,
    maxCombo: 0,
    isDoublePoints: false,
    doublePointsTimer: 0,
    gameOver: false,
    gameStarted: false,
    difficulty: 1,
    spawnTimer: 0,
    frameCount: 0,
  })

  const [displayState, setDisplayState] = useState({
    score: 0,
    highScore: 0,
    lives: 3,
    combo: 0,
    gameOver: false,
    gameStarted: false,
    isDoublePoints: false,
  })

  const keysRef = useRef({ left: false, right: false })
  const animationRef = useRef(null)
  const lastTimeRef = useRef(0)

  // Initialize high score from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("shoppingCartHighScore")
    if (stored) {
      gameStateRef.current.highScore = Number.parseInt(stored, 10)
      setDisplayState((prev) => ({ ...prev, highScore: Number.parseInt(stored, 10) }))
    }
  }, [])

  // Create a new falling item
  const createItem = useCallback(() => {
    const state = gameStateRef.current
    const isGolden = Math.random() < 0.05 // 5% chance for golden item
    const product = isGolden ? GOLDEN_ITEM : PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)]

    return {
      x: Math.random() * (GAME_WIDTH - ITEM_SIZE * 2) + ITEM_SIZE,
      y: -ITEM_SIZE - PARACHUTE_HEIGHT,
      product,
      speed: 1 + Math.random() * 0.5 + state.difficulty * 0.2,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: 0.02 + Math.random() * 0.02,
      rotation: 0,
    }
  }, [])

  // Create particle effect
  const createParticles = useCallback((x, y, color, count = 8) => {
    const particles = []
    for (let i = 0; i < count; i++) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6 - 2,
        life: 1,
        color,
        size: 3 + Math.random() * 4,
      })
    }
    return particles
  }, [])

  // Draw parachute
  const drawParachute = useCallback((ctx, x, y, color) => {
    // Parachute canopy
    ctx.beginPath()
    ctx.arc(x, y - 15, 20, Math.PI, 0, false)
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = "#ffffff50"
    ctx.lineWidth = 1
    ctx.stroke()

    // Parachute lines
    ctx.beginPath()
    ctx.strokeStyle = "#ffffff80"
    ctx.lineWidth = 1
    ctx.moveTo(x - 18, y - 10)
    ctx.lineTo(x - 5, y + 15)
    ctx.moveTo(x + 18, y - 10)
    ctx.lineTo(x + 5, y + 15)
    ctx.moveTo(x, y - 15)
    ctx.lineTo(x, y + 10)
    ctx.stroke()
  }, [])

  // Draw shopping cart
  const drawCart = useCallback((ctx, x, y) => {
    // Cart body
    ctx.fillStyle = "#333333"
    ctx.beginPath()
    ctx.moveTo(x + 10, y + 10)
    ctx.lineTo(x + 5, y + CART_HEIGHT - 10)
    ctx.lineTo(x + CART_WIDTH - 5, y + CART_HEIGHT - 10)
    ctx.lineTo(x + CART_WIDTH - 10, y + 10)
    ctx.closePath()
    ctx.fill()

    // Cart rim
    ctx.strokeStyle = "#555555"
    ctx.lineWidth = 3
    ctx.stroke()

    // Cart handle
    ctx.beginPath()
    ctx.moveTo(x + CART_WIDTH - 5, y + 15)
    ctx.lineTo(x + CART_WIDTH + 10, y)
    ctx.lineTo(x + CART_WIDTH + 15, y + 5)
    ctx.strokeStyle = "#444444"
    ctx.lineWidth = 4
    ctx.stroke()

    // Wheels
    ctx.fillStyle = "#222222"
    ctx.beginPath()
    ctx.arc(x + 15, y + CART_HEIGHT - 5, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(x + CART_WIDTH - 15, y + CART_HEIGHT - 5, 6, 0, Math.PI * 2)
    ctx.fill()

    // Wheel centers
    ctx.fillStyle = "#444444"
    ctx.beginPath()
    ctx.arc(x + 15, y + CART_HEIGHT - 5, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(x + CART_WIDTH - 15, y + CART_HEIGHT - 5, 2, 0, Math.PI * 2)
    ctx.fill()
  }, [])

  // Main game loop
  const gameLoop = useCallback(
    (timestamp) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      const state = gameStateRef.current

      // Delta time calculation
      const deltaTime = timestamp - lastTimeRef.current
      lastTimeRef.current = timestamp
      const dt = Math.min(deltaTime / 16.67, 2) // Normalize to 60fps, cap at 2x

      // Clear canvas
      ctx.fillStyle = "#0a0a0a"
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

      // Draw ground
      ctx.fillStyle = "#1a1a1a"
      ctx.fillRect(0, GAME_HEIGHT - GROUND_HEIGHT, GAME_WIDTH, GROUND_HEIGHT)

      if (!state.gameStarted || state.gameOver) {
        // Draw cart even when not playing
        drawCart(ctx, state.cart.x, state.cart.y)
        animationRef.current = requestAnimationFrame(gameLoop)
        return
      }

      // Update cart position based on keys
      const cartSpeed = 8 * dt
      if (keysRef.current.left && state.cart.x > 0) {
        state.cart.x -= cartSpeed
      }
      if (keysRef.current.right && state.cart.x < GAME_WIDTH - CART_WIDTH) {
        state.cart.x += cartSpeed
      }

      // Clamp cart position
      state.cart.x = Math.max(0, Math.min(GAME_WIDTH - CART_WIDTH, state.cart.x))

      // Spawn new items
      state.spawnTimer += dt
      const spawnInterval = Math.max(30, 80 - state.difficulty * 5)
      if (state.spawnTimer >= spawnInterval) {
        state.items.push(createItem())
        state.spawnTimer = 0
      }

      // Update double points timer
      if (state.isDoublePoints) {
        state.doublePointsTimer -= dt
        if (state.doublePointsTimer <= 0) {
          state.isDoublePoints = false
          setDisplayState((prev) => ({ ...prev, isDoublePoints: false }))
        }
      }

      // Update and draw items
      state.items = state.items.filter((item) => {
        // Update position with sway
        item.y += item.speed * dt
        item.swayOffset += item.swaySpeed * dt
        const sway = Math.sin(item.swayOffset * 10) * 1.5
        item.rotation = sway * 0.1

        const drawX = item.x + sway
        const drawY = item.y

        // Draw parachute
        drawParachute(ctx, drawX, drawY, item.product.color)

        // Draw item (emoji)
        ctx.save()
        ctx.translate(drawX, drawY + 25)
        ctx.rotate(item.rotation)
        ctx.font = `${ITEM_SIZE - 10}px Arial`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(item.product.emoji, 0, 0)
        ctx.restore()

        // Check collision with cart
        const itemCenterX = drawX
        const itemBottom = drawY + ITEM_SIZE
        const cartTop = state.cart.y
        const cartLeft = state.cart.x + 5
        const cartRight = state.cart.x + CART_WIDTH - 5

        if (
          itemBottom >= cartTop &&
          itemBottom <= cartTop + 20 &&
          itemCenterX >= cartLeft &&
          itemCenterX <= cartRight
        ) {
          // Caught the item!
          if (item.product.type === "golden") {
            // Golden item gives double points for 10 seconds
            state.isDoublePoints = true
            state.doublePointsTimer = 600 // 10 seconds at 60fps
            setDisplayState((prev) => ({ ...prev, isDoublePoints: true }))
          } else {
            const points = item.product.points * (state.isDoublePoints ? 2 : 1)
            state.combo++
            const comboBonus = Math.floor(state.combo / 5) * 10
            state.score += points + comboBonus
            state.maxCombo = Math.max(state.maxCombo, state.combo)
          }

          // Create particles
          state.particles.push(...createParticles(drawX, drawY + 20, item.product.color))

          // Update display
          setDisplayState((prev) => ({
            ...prev,
            score: state.score,
            combo: state.combo,
          }))

          return false
        }

        // Check if item hit the ground
        if (itemBottom >= GAME_HEIGHT - GROUND_HEIGHT) {
          state.combo = 0 // Reset combo
          state.missedCount++

          if (state.missedCount >= 3) {
            state.lives--
            state.missedCount = 0

            if (state.lives <= 0) {
              state.gameOver = true
              if (state.score > state.highScore) {
                state.highScore = state.score
                localStorage.setItem("shoppingCartHighScore", state.score.toString())
              }
              setDisplayState((prev) => ({
                ...prev,
                lives: 0,
                combo: 0,
                gameOver: true,
                highScore: state.highScore,
              }))
            } else {
              setDisplayState((prev) => ({
                ...prev,
                lives: state.lives,
                combo: 0,
              }))
            }
          } else {
            setDisplayState((prev) => ({ ...prev, combo: 0 }))
          }

          return false
        }

        return true
      })

      // Update and draw particles
      state.particles = state.particles.filter((p) => {
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.vy += 0.2 * dt // gravity
        p.life -= 0.02 * dt

        if (p.life > 0) {
          ctx.globalAlpha = p.life
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1
          return true
        }
        return false
      })

      // Draw cart
      drawCart(ctx, state.cart.x, state.cart.y)

      // Increase difficulty over time
      state.frameCount += dt
      if (state.frameCount % 600 === 0) {
        // Every 10 seconds
        state.difficulty = Math.min(state.difficulty + 0.2, 5)
      }

      animationRef.current = requestAnimationFrame(gameLoop)
    },
    [createItem, createParticles, drawCart, drawParachute],
  )

  // Start the game
  const startGame = useCallback(() => {
    const state = gameStateRef.current
    state.cart.x = GAME_WIDTH / 2 - CART_WIDTH / 2
    state.items = []
    state.particles = []
    state.score = 0
    state.lives = 3
    state.missedCount = 0
    state.combo = 0
    state.maxCombo = 0
    state.isDoublePoints = false
    state.doublePointsTimer = 0
    state.gameOver = false
    state.gameStarted = true
    state.difficulty = 1
    state.spawnTimer = 0
    state.frameCount = 0

    setDisplayState({
      score: 0,
      highScore: state.highScore,
      lives: 3,
      combo: 0,
      gameOver: false,
      gameStarted: true,
      isDoublePoints: false,
    })
  }, [])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysRef.current.left = true
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysRef.current.right = true
      }
      if (e.key === " " || e.key === "Enter") {
        if (!gameStateRef.current.gameStarted || gameStateRef.current.gameOver) {
          startGame()
        }
      }
    }

    const handleKeyUp = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysRef.current.left = false
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysRef.current.right = false
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [startGame])

  // Handle touch/mouse input for mobile
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let isDragging = false
    let lastTouchX = 0

    const handleTouchStart = (e) => {
      e.preventDefault()
      isDragging = true
      const touch = e.touches[0]
      const rect = canvas.getBoundingClientRect()
      lastTouchX = touch.clientX - rect.left

      if (!gameStateRef.current.gameStarted || gameStateRef.current.gameOver) {
        startGame()
      }
    }

    const handleTouchMove = (e) => {
      if (!isDragging) return
      e.preventDefault()
      const touch = e.touches[0]
      const rect = canvas.getBoundingClientRect()
      const scaleX = GAME_WIDTH / rect.width
      const touchX = (touch.clientX - rect.left) * scaleX

      gameStateRef.current.cart.x = Math.max(0, Math.min(GAME_WIDTH - CART_WIDTH, touchX - CART_WIDTH / 2))
    }

    const handleTouchEnd = () => {
      isDragging = false
    }

    const handleMouseMove = (e) => {
      if (!gameStateRef.current.gameStarted || gameStateRef.current.gameOver) return
      const rect = canvas.getBoundingClientRect()
      const scaleX = GAME_WIDTH / rect.width
      const mouseX = (e.clientX - rect.left) * scaleX

      gameStateRef.current.cart.x = Math.max(0, Math.min(GAME_WIDTH - CART_WIDTH, mouseX - CART_WIDTH / 2))
    }

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false })
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false })
    canvas.addEventListener("touchend", handleTouchEnd)
    canvas.addEventListener("mousemove", handleMouseMove)

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("touchend", handleTouchEnd)
      canvas.removeEventListener("mousemove", handleMouseMove)
    }
  }, [startGame])

  // Start game loop
  useEffect(() => {
    lastTimeRef.current = performance.now()
    animationRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameLoop])

  return (
    <div className="relative select-none">
      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="rounded-lg border-2 border-white/20 shadow-2xl cursor-none"
        style={{ maxWidth: "100%", height: "auto" }}
      />

      {/* HUD Overlay */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-start pointer-events-none">
        {/* Score */}
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
          <div className="text-white/60 text-[10px] uppercase tracking-wider">Score</div>
          <div className="text-white font-bold text-lg leading-tight">{displayState.score}</div>
        </div>

        {/* Combo */}
        <AnimatePresence>
          {displayState.combo > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/30"
            >
              <div className="text-white font-bold text-sm">x{displayState.combo} COMBO</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lives */}
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
          <div className="text-white/60 text-[10px] uppercase tracking-wider">Lives</div>
          <div className="text-red-400 font-bold text-lg leading-tight">
            {"❤️".repeat(displayState.lives)}
            {"🖤".repeat(3 - displayState.lives)}
          </div>
        </div>
      </div>

      {/* Double Points Indicator */}
      <AnimatePresence>
        {displayState.isDoublePoints && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="absolute top-14 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500/90 to-amber-500/90 backdrop-blur-sm rounded-full px-4 py-1 border border-yellow-300/50"
          >
            <div className="text-black font-bold text-sm flex items-center gap-1">
              <span>2X POINTS</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* High Score */}
      <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20 pointer-events-none">
        <div className="text-yellow-400/80 text-[10px] uppercase tracking-wider">High Score</div>
        <div className="text-yellow-400 font-bold text-sm leading-tight">{displayState.highScore}</div>
      </div>

      {/* Start Screen */}
      <AnimatePresence>
        {!displayState.gameStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center"
          >
            <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} className="text-center">
              <h2 className="text-white text-2xl font-bold mb-2">Shopping Cart Catcher</h2>
              <p className="text-white/70 text-sm mb-4">Catch falling items with your cart!</p>
              <div className="flex justify-center gap-2 mb-4 text-2xl">
                {PRODUCTS.slice(0, 4).map((p, i) => (
                  <span key={i}>{p.emoji}</span>
                ))}
              </div>
              <motion.button
                onClick={startGame}
                className="bg-white text-black font-bold px-6 py-2 rounded-full hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Press SPACE or Tap to Start
              </motion.button>
              <p className="text-white/50 text-xs mt-3">Use Arrow Keys / A-D or Mouse to move</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Screen */}
      <AnimatePresence>
        {displayState.gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center"
          >
            <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} className="text-center">
              <h2 className="text-red-400 text-2xl font-bold mb-2">Game Over</h2>
              <p className="text-white text-lg mb-1">Final Score: {displayState.score}</p>
              {displayState.score >= displayState.highScore && displayState.score > 0 && (
                <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-yellow-400 text-sm mb-2">
                  New High Score!
                </motion.p>
              )}
              <p className="text-white/60 text-sm mb-4">High Score: {displayState.highScore}</p>
              <motion.button
                onClick={startGame}
                className="bg-white text-black font-bold px-6 py-2 rounded-full hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Play Again
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
