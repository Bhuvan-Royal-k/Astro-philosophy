import React, { useEffect, useRef, useState, useCallback } from 'react'
import { siteConfig } from '../config/site'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useLanguage } from '../context/LanguageContext'

type FrameConfig = typeof siteConfig.hero.frames
type MobileFrameConfig = NonNullable<typeof siteConfig.hero.frames.mobile>
type ActiveConfig = FrameConfig | MobileFrameConfig

export const CinematicHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const pinWrapperRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fallbackCanvasRef = useRef<HTMLCanvasElement>(null)
  const textGroupRef = useRef<HTMLDivElement>(null)
  const milestoneRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  const prefersReducedMotion = useReducedMotion()
  const { t } = useLanguage()

  const desktopConfig = siteConfig.hero.frames
  const mobileConfig = siteConfig.hero.frames.mobile

  // State to track media availability
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [desktopFramesAvailable, setDesktopFramesAvailable] = useState(false)
  const [mobileFramesAvailable, setMobileFramesAvailable] = useState(false)
  const [_framesLoadedCount, setFramesLoadedCount] = useState(0)

  // Track active sequence mode and viewport orientation
  const [activeSequenceMode, setActiveSequenceMode] = useState<'desktop' | 'mobile'>('desktop')
  const activeSequenceModeRef = useRef<'desktop' | 'mobile'>('desktop')
  const lastOrientationRef = useRef<'portrait' | 'landscape'>('landscape')

  // Caches for preloaded frame images & scroll tracking ref (decoupled from React re-renders)
  const desktopImagesRef = useRef<Map<number, HTMLImageElement>>(new Map())
  const mobileImagesRef = useRef<Map<number, HTMLImageElement>>(new Map())
  const desktopAccessOrderRef = useRef<number[]>([])
  const mobileAccessOrderRef = useRef<number[]>([])

  const lastDrawnFrameRef = useRef<number>(-1)
  const lastDrawnSeqRef = useRef<'desktop' | 'mobile'>('desktop')
  const currentProgressRef = useRef<number>(0)

  const isVideoMode = siteConfig.hero.mode === 'video'
  const isFrameMode = siteConfig.hero.mode === 'frame-sequence'

  // Viewport orientation detection helper
  const isPortraitViewport = useCallback(() => {
    if (typeof window === 'undefined') return false
    return window.innerHeight > window.innerWidth || window.innerWidth < 768
  }, [])

  // Helper to construct frame URL from config
  const constructFrameUrl = useCallback((index: number, config: ActiveConfig) => {
    const padded = String(index).padStart(config.padLength, '0')
    return `${config.dir}/${config.prefix}${padded}${config.extension}`
  }, [])

  // Get currently active sequence config
  const getActiveSequence = useCallback((): { config: ActiveConfig; isMobile: boolean } => {
    const isMobileSeq = activeSequenceModeRef.current === 'mobile' && Boolean(mobileConfig) && mobileFramesAvailable
    return {
      config: isMobileSeq && mobileConfig ? mobileConfig : desktopConfig,
      isMobile: isMobileSeq,
    }
  }, [desktopConfig, mobileConfig, mobileFramesAvailable])

  // Memory manager: maintains an LRU cache on mobile to prevent WebKit texture downsampling
  const trackFrameAccess = useCallback((frameIdx: number, isMobileSeq: boolean) => {
    const queue = isMobileSeq ? mobileAccessOrderRef.current : desktopAccessOrderRef.current
    const imagesMap = isMobileSeq ? mobileImagesRef.current : desktopImagesRef.current

    const pos = queue.indexOf(frameIdx)
    if (pos > -1) {
      queue.splice(pos, 1)
    }
    queue.push(frameIdx)

    // On mobile screens, enforce an active decoded working set cap (~48 frames, ~380MB).
    const isMobileScreen = typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window)
    if (isMobileScreen) {
      const MOBILE_RAM_LIMIT = 48
      const currentDrawn = lastDrawnFrameRef.current
      while (imagesMap.size > MOBILE_RAM_LIMIT && queue.length > 0) {
        let furthestIdx = -1
        let maxDist = -1
        let queuePosToEvict = -1

        for (let i = 0; i < Math.min(queue.length, 24); i++) {
          const candidate = queue[i]
          const dist = Math.abs(candidate - currentDrawn)
          if (dist > maxDist) {
            maxDist = dist
            furthestIdx = candidate
            queuePosToEvict = i
          }
        }

        if (queuePosToEvict !== -1 && furthestIdx !== -1) {
          queue.splice(queuePosToEvict, 1)
          const evictedImg = imagesMap.get(furthestIdx)
          if (evictedImg) {
            evictedImg.src = '' // Release uncompressed GPU bitmap
            imagesMap.delete(furthestIdx)
          }
        } else {
          break
        }
      }
    }
  }, [])

  /* -------------------------------------------------------------
   * PROCEDURAL TEMPLE CANVAS FALLBACK (Active when media not yet loaded)
   * South Indian Dravidian Temple & Celestial Zodiac that smoothly
   * zooms from cosmic stars into sacred sanctum at full native DPR resolution.
   * ------------------------------------------------------------- */
  const drawProceduralFallback = useCallback((progress: number) => {
    const canvas = fallbackCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    if (width === 0 || height === 0) return

    ctx.clearRect(0, 0, width, height)

    // Cosmic Background Gradient
    const bgGrad = ctx.createRadialGradient(
      width * 0.5,
      height * (0.35 + progress * 0.15),
      10,
      width * 0.5,
      height * 0.5,
      Math.max(width, height)
    )
    bgGrad.addColorStop(0, '#17152F')
    bgGrad.addColorStop(0.55, '#0C1026')
    bgGrad.addColorStop(1, '#04060F')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, width, height)

    // Celestial Starfield & Zodiac Particles
    const starCount = 85
    for (let i = 0; i < starCount; i++) {
      const seedX = (Math.sin(i * 99 + 1) * 0.5 + 0.5) * width
      const seedY = (Math.cos(i * 33 + 2) * 0.5 + 0.5) * height
      const y = (seedY + progress * (i % 3 === 0 ? 120 : 60)) % height
      const x = seedX
      const size = (i % 5 === 0 ? 2.2 : 1.2) * (1 - progress * 0.3)
      const starAlpha = (Math.sin(i + progress * 8) * 0.3 + 0.7) * (1 - progress * 0.4)

      ctx.fillStyle = i % 2 === 0 ? `rgba(223, 194, 131, ${starAlpha})` : `rgba(244, 239, 228, ${starAlpha})`
      ctx.beginPath()
      ctx.arc(x, y, Math.max(0.6, size), 0, Math.PI * 2)
      ctx.fill()
    }

    // Concentric Celestial Zodiac Mandala Rings
    const centerX = width * 0.5
    const centerY = height * (0.42 + progress * 0.12)
    const mandalaScale = 1 + progress * 1.8
    const mandalaAlpha = Math.max(0, 1 - progress * 1.3)

    if (mandalaAlpha > 0.01) {
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(progress * 0.4)
      ctx.globalAlpha = mandalaAlpha

      // Outer Zodiac Ring
      ctx.strokeStyle = '#C6A15B'
      ctx.lineWidth = 1.2
      ctx.setLineDash([4, 6])
      ctx.beginPath()
      ctx.arc(0, 0, 140 * mandalaScale, 0, Math.PI * 2)
      ctx.stroke()

      // Middle Ring with 12 Rasi Cardinal Ticks
      ctx.strokeStyle = '#DFC283'
      ctx.lineWidth = 0.8
      ctx.setLineDash([])
      ctx.beginPath()
      ctx.arc(0, 0, 100 * mandalaScale, 0, Math.PI * 2)
      ctx.stroke()

      for (let r = 0; r < 12; r++) {
        const angle = (r * Math.PI * 2) / 12
        const x1 = Math.cos(angle) * 94 * mandalaScale
        const y1 = Math.sin(angle) * 94 * mandalaScale
        const x2 = Math.cos(angle) * 106 * mandalaScale
        const y2 = Math.sin(angle) * 106 * mandalaScale
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      // Sacred 8-Pointed Star
      ctx.strokeStyle = 'rgba(198, 161, 91, 0.45)'
      ctx.fillStyle = 'rgba(23, 21, 47, 0.3)'
      ctx.beginPath()
      for (let s = 0; s < 16; s++) {
        const radius = (s % 2 === 0 ? 70 : 35) * mandalaScale
        const angle = (s * Math.PI * 2) / 16
        const sx = Math.cos(angle) * radius
        const sy = Math.sin(angle) * radius
        if (s === 0) ctx.moveTo(sx, sy)
        else ctx.lineTo(sx, sy)
      }
      ctx.closePath()
      ctx.stroke()
      ctx.fill()
      ctx.restore()
    }

    // DRAVIDIAN TEMPLE ARCHITECTURE
    ctx.save()
    const templeScale = 0.85 + progress * 2.2
    const templeY = height * (0.88 - progress * 0.4)
    ctx.translate(centerX, templeY)
    ctx.scale(templeScale, templeScale)

    // Base Temple Stone Plinth
    ctx.fillStyle = '#080B1A'
    ctx.strokeStyle = '#C6A15B'
    ctx.lineWidth = 1.5

    // Multi-tiered Gopuram silhouette
    const tiers = 6
    for (let t = 0; t < tiers; t++) {
      const tierWidth = 180 - t * 24
      const tierHeight = 22
      const ty = -120 - t * 24

      ctx.fillStyle = t % 2 === 0 ? 'rgba(12, 16, 38, 0.95)' : 'rgba(23, 21, 47, 0.9)'
      ctx.beginPath()
      ctx.roundRect(-tierWidth * 0.5, ty, tierWidth, tierHeight, 2)
      ctx.fill()
      ctx.strokeStyle = 'rgba(198, 161, 91, 0.5)'
      ctx.lineWidth = 1
      ctx.stroke()

      const kuduCount = 4 + (tiers - t)
      for (let k = 0; k < kuduCount; k++) {
        const kx = -tierWidth * 0.4 + (k / (kuduCount - 1)) * tierWidth * 0.8
        ctx.fillStyle = 'rgba(223, 194, 131, 0.4)'
        ctx.beginPath()
        ctx.arc(kx, ty + tierHeight * 0.5, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Top Kalasams
    const topY = -120 - tiers * 24
    ctx.fillStyle = '#DFC283'
    ctx.strokeStyle = '#C6A15B'
    ctx.lineWidth = 1.2
    for (let f = -1; f <= 1; f++) {
      const fx = f * 12
      ctx.beginPath()
      ctx.moveTo(fx, topY)
      ctx.lineTo(fx + 3, topY - 14)
      ctx.lineTo(fx, topY - 20)
      ctx.lineTo(fx - 3, topY - 14)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#F4EFE4'
      ctx.beginPath()
      ctx.arc(fx, topY - 22, 1.8, 0, Math.PI * 2)
      ctx.fill()
    }

    // Grand Entrance Corridor Pillars
    const pillarWidth = 16
    const pillarHeight = 110
    ctx.fillStyle = '#0F0E20'
    ctx.strokeStyle = '#C6A15B'
    ctx.lineWidth = 1.5

    ctx.fillRect(-75, -pillarHeight, pillarWidth, pillarHeight)
    ctx.strokeRect(-75, -pillarHeight, pillarWidth, pillarHeight)

    ctx.fillRect(75 - pillarWidth, -pillarHeight, pillarWidth, pillarHeight)
    ctx.strokeRect(75 - pillarWidth, -pillarHeight, pillarWidth, pillarHeight)

    // Central Temple Sanctum Doorway
    const doorWidth = 70
    const doorHeight = 90
    ctx.fillStyle = '#04060F'
    ctx.beginPath()
    ctx.roundRect(-doorWidth * 0.5, -doorHeight, doorWidth, doorHeight, [16, 16, 0, 0])
    ctx.fill()
    ctx.strokeStyle = 'rgba(223, 194, 131, 0.8)'
    ctx.lineWidth = 2
    ctx.stroke()

    // Inner Sanctum Warm Gold Glow
    const sanctumGlowIntensity = Math.min(1, 0.35 + progress * 0.8)
    const sanctumGlow = ctx.createRadialGradient(0, -doorHeight * 0.55, 5, 0, -doorHeight * 0.55, 65)
    sanctumGlow.addColorStop(0, `rgba(244, 239, 228, ${sanctumGlowIntensity * 0.95})`)
    sanctumGlow.addColorStop(0.35, `rgba(223, 194, 131, ${sanctumGlowIntensity * 0.85})`)
    sanctumGlow.addColorStop(0.7, `rgba(198, 161, 91, ${sanctumGlowIntensity * 0.45})`)
    sanctumGlow.addColorStop(1, 'rgba(8, 11, 26, 0)')

    ctx.fillStyle = sanctumGlow
    ctx.beginPath()
    ctx.arc(0, -doorHeight * 0.55, 65, 0, Math.PI * 2)
    ctx.fill()

    // Sacred Flame Lamp
    const flameY = -doorHeight * 0.45
    ctx.fillStyle = '#F4EFE4'
    ctx.beginPath()
    ctx.ellipse(0, flameY, 4, 8 + Math.sin(progress * 20) * 1.5, 0, 0, Math.PI * 2)
    ctx.fill()

    // Pilgrim Silhouette ascending the sacred stone steps
    const pilgrimScale = 1 - progress * 0.25
    const pilgrimY = -8 - progress * 24
    ctx.fillStyle = '#080B1A'
    ctx.strokeStyle = 'rgba(198, 161, 91, 0.5)'
    ctx.lineWidth = 1

    ctx.beginPath()
    ctx.arc(0, pilgrimY - 24 * pilgrimScale, 4 * pilgrimScale, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(-5 * pilgrimScale, pilgrimY)
    ctx.lineTo(-2 * pilgrimScale, pilgrimY - 18 * pilgrimScale)
    ctx.lineTo(2 * pilgrimScale, pilgrimY - 18 * pilgrimScale)
    ctx.lineTo(5 * pilgrimScale, pilgrimY)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    ctx.restore()

    // Vignette Border
    const vignette = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      Math.min(width, height) * 0.4,
      width * 0.5,
      height * 0.5,
      Math.max(width, height) * 0.8
    )
    vignette.addColorStop(0, 'rgba(8, 11, 26, 0)')
    vignette.addColorStop(1, 'rgba(4, 6, 15, 0.85)')
    ctx.fillStyle = vignette
    ctx.fillRect(0, 0, width, height)
  }, [])

  // Lookahead/lookbehind window preloader around active frame
  const preloadWindowAround = useCallback((centerIdx: number, config: ActiveConfig, isMobileSeq: boolean) => {
    const imagesMap = isMobileSeq ? mobileImagesRef.current : desktopImagesRef.current
    const start = Math.max(config.startIndex, centerIdx - 4)
    const end = Math.min(config.totalFrames, centerIdx + 8)

    for (let i = start; i <= end; i++) {
      if (!imagesMap.has(i)) {
        const img = new Image()
        img.src = constructFrameUrl(i, config)
        img.onload = () => {
          imagesMap.set(i, img)
          trackFrameAccess(i, isMobileSeq)
        }
      }
    }
  }, [constructFrameUrl, trackFrameAccess])

  /* -------------------------------------------------------------
   * FRAME-SEQUENCE CANVAS DRAWING (High Quality Bicubic Resampling)
   * ------------------------------------------------------------- */
  const drawFrameToCanvas = useCallback(
    (frameIndex: number, force = false, explicitConfig?: { config: ActiveConfig; isMobile: boolean }) => {
      const { config, isMobile: isMobileSeq } = explicitConfig || getActiveSequence()
      const imagesMap = isMobileSeq ? mobileImagesRef.current : desktopImagesRef.current
      const seqKey = isMobileSeq ? 'mobile' : 'desktop'

      if (!force && lastDrawnFrameRef.current === frameIndex && lastDrawnSeqRef.current === seqKey) {
        return
      }

      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      let img = imagesMap.get(frameIndex)

      // If targeted frame is not yet in memory or still loading, request it and find nearest available
      if (!img || !img.complete || img.naturalWidth === 0) {
        if (!img) {
          const newImg = new Image()
          newImg.src = constructFrameUrl(frameIndex, config)
          newImg.onload = () => {
            imagesMap.set(frameIndex, newImg)
            trackFrameAccess(frameIndex, isMobileSeq)
            if (lastDrawnFrameRef.current === frameIndex) {
              drawFrameToCanvas(frameIndex, true, { config, isMobile: isMobileSeq })
            }
          }
        }

        // Find nearest loaded frame to prevent visual blanking while scrubbing
        let closestIdx = -1
        let minDistance = Infinity
        imagesMap.forEach((cachedImg, idx) => {
          if (cachedImg.complete && cachedImg.naturalWidth > 0) {
            const dist = Math.abs(idx - frameIndex)
            if (dist < minDistance) {
              minDistance = dist
              closestIdx = idx
            }
          }
        })
        if (closestIdx !== -1) {
          img = imagesMap.get(closestIdx)
        }
      }

      // If mobile sequence frame is missing/not loaded, check if desktop has a frame to display
      if ((!img || !img.complete || img.naturalWidth === 0) && isMobileSeq) {
        const desktopImg = desktopImagesRef.current.get(frameIndex)
        if (desktopImg && desktopImg.complete && desktopImg.naturalWidth > 0) {
          img = desktopImg
        }
      }

      if (!img || !img.complete || img.naturalWidth === 0) return

      lastDrawnFrameRef.current = frameIndex
      lastDrawnSeqRef.current = seqKey
      trackFrameAccess(frameIndex, isMobileSeq)
      preloadWindowAround(frameIndex, config, isMobileSeq)

      const canvasWidth = canvas.width
      const canvasHeight = canvas.height
      if (canvasWidth === 0 || canvasHeight === 0) return

      const imgWidth = img.naturalWidth
      const imgHeight = img.naturalHeight
      if (imgWidth === 0 || imgHeight === 0) return

      // Smart object-cover preservation: keep temple and pilgrim centered in view
      const imgRatio = imgWidth / imgHeight
      const canvasRatio = canvasWidth / canvasHeight

      let renderWidth = canvasWidth
      let renderHeight = canvasHeight
      let offsetX = 0
      let offsetY = 0

      if (canvasRatio > imgRatio) {
        // Screen is wider than image
        renderHeight = canvasWidth / imgRatio
        offsetY = (canvasHeight - renderHeight) / 2
      } else {
        // Screen is taller than image (portrait mobile)
        renderWidth = canvasHeight * imgRatio
        // Center horizontal axis on temple sanctum & ascending pilgrim
        offsetX = (canvasWidth - renderWidth) / 2
      }

      // Set high quality bicubic resampling on backing rasterizer
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      // Snap coordinates to exact integer pixels to eliminate subpixel anti-aliasing blur
      const drawX = Math.round(offsetX)
      const drawY = Math.round(offsetY)
      const drawW = Math.round(renderWidth)
      const drawH = Math.round(renderHeight)

      // Clear background only if drawn rectangle does not completely cover canvas
      if (drawX > 0 || drawY > 0 || drawX + drawW < canvasWidth || drawY + drawH < canvasHeight) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH)
    },
    [getActiveSequence, constructFrameUrl, trackFrameAccess, preloadWindowAround]
  )

  /* -------------------------------------------------------------
   * SEQUENCE AVAILABILITY & VIEWPORT INITIALIZATION
   * Tests mobile sequence asset availability and initializes mode
   * ------------------------------------------------------------- */
  useEffect(() => {
    if (!isFrameMode) return
    let isCancelled = false

    // Initial orientation check
    if (typeof window !== 'undefined') {
      const isPortrait = window.innerHeight > window.innerWidth || window.innerWidth < 768
      lastOrientationRef.current = isPortrait ? 'portrait' : 'landscape'
    }

    // 1. Always verify desktop sequence presence (frame 1)
    const testDesktopImg = new Image()
    testDesktopImg.src = constructFrameUrl(desktopConfig.startIndex, desktopConfig)
    testDesktopImg.onload = () => {
      if (isCancelled) return
      setDesktopFramesAvailable(true)
      desktopImagesRef.current.set(desktopConfig.startIndex, testDesktopImg)
      trackFrameAccess(desktopConfig.startIndex, false)
      setFramesLoadedCount((prev) => prev + 1)

      // If active sequence is desktop, draw initial frame
      if (activeSequenceModeRef.current === 'desktop') {
        const targetIndex = Math.min(
          desktopConfig.totalFrames,
          Math.max(
            desktopConfig.startIndex,
            Math.floor(currentProgressRef.current * (desktopConfig.totalFrames - desktopConfig.startIndex)) + desktopConfig.startIndex
          )
        )
        drawFrameToCanvas(targetIndex, true, { config: desktopConfig, isMobile: false })
      }
    }
    testDesktopImg.onerror = () => {
      if (isCancelled) return
      setDesktopFramesAvailable(false)
    }

    // 2. Check if mobile sequence assets are present (probe with HEAD request to prevent SPA text/html 200 false positives)
    if (mobileConfig) {
      const mobileFirstUrl = constructFrameUrl(mobileConfig.startIndex, mobileConfig)

      fetch(mobileFirstUrl, { method: 'HEAD' })
        .then((res) => {
          if (isCancelled) return
          const contentType = res.headers.get('content-type') || ''
          const isRealImage = res.ok && !contentType.includes('text/html') && (contentType.includes('image') || contentType.includes('octet-stream'))

          if (!isRealImage) {
            setMobileFramesAvailable(false)
            activeSequenceModeRef.current = 'desktop'
            setActiveSequenceMode('desktop')
            return
          }

          const testMobileImg = new Image()
          testMobileImg.src = mobileFirstUrl
          testMobileImg.onload = () => {
            if (isCancelled) return
            if (testMobileImg.naturalWidth > 0 && testMobileImg.naturalHeight > 0) {
              setMobileFramesAvailable(true)
              mobileImagesRef.current.set(mobileConfig.startIndex, testMobileImg)
              trackFrameAccess(mobileConfig.startIndex, true)

              // If currently in portrait/mobile viewport, switch to mobile sequence
              const isPortrait = isPortraitViewport()
              if (isPortrait) {
                activeSequenceModeRef.current = 'mobile'
                setActiveSequenceMode('mobile')
                const targetIndex = Math.min(
                  mobileConfig.totalFrames,
                  Math.max(
                    mobileConfig.startIndex,
                    Math.floor(currentProgressRef.current * (mobileConfig.totalFrames - mobileConfig.startIndex)) + mobileConfig.startIndex
                  )
                )
                drawFrameToCanvas(targetIndex, true, { config: mobileConfig, isMobile: true })
              }
            } else {
              setMobileFramesAvailable(false)
            }
          }
          testMobileImg.onerror = () => {
            if (isCancelled) return
            setMobileFramesAvailable(false)
            activeSequenceModeRef.current = 'desktop'
            setActiveSequenceMode('desktop')
          }
        })
        .catch(() => {
          if (isCancelled) return
          setMobileFramesAvailable(false)
          activeSequenceModeRef.current = 'desktop'
          setActiveSequenceMode('desktop')
        })
    }

    return () => {
      isCancelled = true
    }
  }, [isFrameMode, desktopConfig, mobileConfig, constructFrameUrl, trackFrameAccess, isPortraitViewport, drawFrameToCanvas])

  /* -------------------------------------------------------------
   * PROGRESSIVE FRAME PRELOADER
   * Warms browser HTTP disk cache and decodes sequence without blowing RAM
   * ------------------------------------------------------------- */
  useEffect(() => {
    if (!isFrameMode || (!desktopFramesAvailable && !mobileFramesAvailable)) return

    let isCancelled = false
    const isMobileSeq = activeSequenceMode === 'mobile' && mobileFramesAvailable && Boolean(mobileConfig)
    const targetConfig = isMobileSeq && mobileConfig ? mobileConfig : desktopConfig
    const imagesMap = isMobileSeq ? mobileImagesRef.current : desktopImagesRef.current

    const isMobileDevice = typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window)
    let nextIndexToLoad = targetConfig.startIndex + 1
    const concurrency = isMobileDevice ? 3 : 6

    const loadWorker = () => {
      if (isCancelled || nextIndexToLoad > targetConfig.totalFrames) return
      const idx = nextIndexToLoad++
      const url = constructFrameUrl(idx, targetConfig)

      if (isMobileDevice) {
        // Warm up browser HTTP disk cache without holding 240 uncompressed GPU bitmaps
        fetch(url, { cache: 'force-cache' })
          .then(() => {
            if (isCancelled) return
            setFramesLoadedCount((prev) => prev + 1)
            loadWorker()
          })
          .catch(() => {
            if (isCancelled) return
            loadWorker()
          })
      } else {
        const img = new Image()
        img.src = url
        img.onload = () => {
          if (isCancelled) return
          imagesMap.set(idx, img)
          trackFrameAccess(idx, isMobileSeq)
          setFramesLoadedCount((prev) => prev + 1)
          loadWorker()
        }
        img.onerror = () => {
          if (isCancelled) return
          loadWorker()
        }
      }
    }

    for (let c = 0; c < concurrency; c++) {
      loadWorker()
    }

    return () => {
      isCancelled = true
    }
  }, [
    isFrameMode,
    desktopFramesAvailable,
    mobileFramesAvailable,
    activeSequenceMode,
    desktopConfig,
    mobileConfig,
    constructFrameUrl,
    trackFrameAccess,
  ])

  /* -------------------------------------------------------------
   * CANVAS RESIZE & VIEWPORT ORIENTATION CHANGE HANDLING
   * ------------------------------------------------------------- */
  useEffect(() => {
    let resizeTimer: number | null = null

    const handleResize = () => {
      const container = pinWrapperRef.current || containerRef.current
      if (!container) return

      const clientWidth = container.clientWidth
      const clientHeight = container.clientHeight
      if (clientWidth === 0 || clientHeight === 0) return

      // Check for orientation change
      const currentOrientation: 'portrait' | 'landscape' = clientHeight > clientWidth || clientWidth < 768 ? 'portrait' : 'landscape'
      const orientationFlipped = currentOrientation !== lastOrientationRef.current
      lastOrientationRef.current = currentOrientation

      // If orientation flipped, evaluate if active sequence should switch
      if (orientationFlipped) {
        const shouldBeMobile = currentOrientation === 'portrait' && Boolean(mobileConfig) && mobileFramesAvailable
        const newMode = shouldBeMobile ? 'mobile' : 'desktop'

        if (newMode !== activeSequenceModeRef.current) {
          activeSequenceModeRef.current = newMode
          setActiveSequenceMode(newMode)
        }
      }

      // Account for devicePixelRatio with high-density retina support capped safely
      const rawDpr = window.devicePixelRatio || 1
      const dpr = Math.min(Math.max(rawDpr, 1), 3)

      let backingWidth = Math.round(clientWidth * dpr)
      let backingHeight = Math.round(clientHeight * dpr)

      // Cap max texture dimension to 2560px to control mobile memory and canvas buffer allocation
      const MAX_TEXTURE_DIM = 2560
      const maxDim = Math.max(backingWidth, backingHeight)
      if (maxDim > MAX_TEXTURE_DIM) {
        const scale = MAX_TEXTURE_DIM / maxDim
        backingWidth = Math.round(backingWidth * scale)
        backingHeight = Math.round(backingHeight * scale)
      }

      // 1. Update Fallback Canvas
      if (fallbackCanvasRef.current) {
        const fc = fallbackCanvasRef.current
        fc.style.width = `${clientWidth}px`
        fc.style.height = `${clientHeight}px`
        if (fc.width !== backingWidth || fc.height !== backingHeight) {
          fc.width = backingWidth
          fc.height = backingHeight
        }
        drawProceduralFallback(currentProgressRef.current)
      }

      // 2. Update Main Frame-Sequence Canvas
      if (canvasRef.current) {
        const c = canvasRef.current
        c.style.width = `${clientWidth}px`
        c.style.height = `${clientHeight}px`
        const sizeChanged = c.width !== backingWidth || c.height !== backingHeight
        if (sizeChanged) {
          c.width = backingWidth
          c.height = backingHeight
        }

        // Re-draw current active frame at new resolution
        const { config, isMobile } = getActiveSequence()
        const targetIndex = Math.min(
          config.totalFrames,
          Math.max(config.startIndex, Math.floor(currentProgressRef.current * (config.totalFrames - config.startIndex)) + config.startIndex)
        )
        drawFrameToCanvas(targetIndex, true, { config, isMobile })
      }
    }

    const debouncedResize = () => {
      if (resizeTimer !== null) {
        window.cancelAnimationFrame(resizeTimer)
      }
      resizeTimer = window.requestAnimationFrame(() => {
        handleResize()
      })
    }

    handleResize()

    // Observe container size directly and listen to window resize & orientationchange
    const container = pinWrapperRef.current || containerRef.current
    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined' && container) {
      resizeObserver = new ResizeObserver(() => {
        debouncedResize()
      })
      resizeObserver.observe(container)
    }

    window.addEventListener('resize', debouncedResize)
    window.addEventListener('orientationchange', debouncedResize)

    return () => {
      if (resizeTimer !== null) {
        window.cancelAnimationFrame(resizeTimer)
      }
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      window.removeEventListener('resize', debouncedResize)
      window.removeEventListener('orientationchange', debouncedResize)
    }
  }, [drawProceduralFallback, drawFrameToCanvas, getActiveSequence, mobileConfig, mobileFramesAvailable])

  /* -------------------------------------------------------------
   * GSAP SCROLLTRIGGER JOURNEY ORCHESTRATION (Smooth 60/120fps Scrubbing)
   * ------------------------------------------------------------- */
  useEffect(() => {
    const container = containerRef.current
    const pinWrapper = pinWrapperRef.current
    if (!container || !pinWrapper) return

    // If reduced motion is requested, show static sanctum arrival view
    if (prefersReducedMotion) {
      drawProceduralFallback(0.7)
      return
    }

    const scrollMultiplier = isVideoMode
      ? siteConfig.hero.video.scrollDistanceMultiplier
      : siteConfig.hero.frames.scrollDistanceMultiplier

    const totalScrollDistance = window.innerHeight * scrollMultiplier

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: `+=${totalScrollDistance}`,
        pin: pinWrapper,
        pinSpacing: true,
        scrub: 0.6, // Smooth scrubbing
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress
          currentProgressRef.current = progress

          // 1. VIDEO SCRUBBING
          if (isVideoMode && videoRef.current && videoRef.current.duration) {
            const video = videoRef.current
            const targetTime = progress * video.duration
            if (!isNaN(targetTime) && isFinite(targetTime)) {
              video.currentTime = targetTime
            }
          }

          // 2. FRAME SEQUENCE SCRUBBING
          if (isFrameMode && (desktopFramesAvailable || mobileFramesAvailable)) {
            const { config, isMobile } = getActiveSequence()
            const { startIndex, totalFrames } = config
            const targetIndex = Math.min(
              totalFrames,
              Math.max(startIndex, Math.floor(progress * (totalFrames - startIndex)) + startIndex)
            )
            drawFrameToCanvas(targetIndex, false, { config, isMobile })
          }

          // 3. PROCEDURAL FALLBACK SCRUBBING (if media is missing or loading)
          if (!videoLoaded || videoError || (isFrameMode && !desktopFramesAvailable && !mobileFramesAvailable)) {
            drawProceduralFallback(progress)
          }

          // 4. OVERLAY FADE ANIMATION
          if (textGroupRef.current) {
            const textAlpha = Math.max(0, 1 - progress * 2.2)
            const textY = -progress * 80
            textGroupRef.current.style.opacity = String(textAlpha)
            textGroupRef.current.style.transform = `translateY(${textY}px)`
          }

          // Scroll indicator fades out quickly on first scroll
          if (scrollIndicatorRef.current) {
            const indAlpha = Math.max(0, 1 - progress * 4)
            scrollIndicatorRef.current.style.opacity = String(indAlpha)
          }

          // Sanctum Milestone reveals when approaching temple interior (0.6 - 0.95)
          if (milestoneRef.current) {
            let mAlpha = 0
            if (progress > 0.55 && progress < 0.95) {
              mAlpha = Math.sin(((progress - 0.55) / 0.4) * Math.PI)
            }
            milestoneRef.current.style.opacity = String(mAlpha)
          }
        },
      })

      return () => {
        st.kill()
      }
    }, container)

    return () => {
      ctx.revert()
    }
  }, [
    isVideoMode,
    isFrameMode,
    videoLoaded,
    videoError,
    desktopFramesAvailable,
    mobileFramesAvailable,
    prefersReducedMotion,
    drawProceduralFallback,
    drawFrameToCanvas,
    getActiveSequence,
  ])

  // Video metadata & error listeners
  const handleVideoLoadedMetadata = () => {
    setVideoLoaded(true)
    setVideoError(false)
  }

  const handleVideoError = () => {
    setVideoError(true)
    setVideoLoaded(false)
  }

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full bg-[#080B1A] text-[#F4EFE4] overflow-hidden"
      aria-label="Cinematic Temple Journey"
    >
      {/* Pinned Viewport Container (100svh mobile / 100vh desktop) */}
      <div
        ref={pinWrapperRef}
        className="relative w-full h-[100svh] h-screen overflow-hidden flex items-center justify-center select-none"
      >
        {/* Layer 1: HTML5 Video Element (Video Mode) */}
        {isVideoMode && (
          <video
            ref={videoRef}
            src={siteConfig.hero.video.src}
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={handleVideoLoadedMetadata}
            onError={handleVideoError}
            className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${
              videoLoaded && !videoError ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        )}

        {/* Layer 2: Frame-Sequence Canvas (Frame Mode) - Decoupled from CSS double-scaling */}
        {isFrameMode && (
          <canvas
            ref={canvasRef}
            className={`block absolute inset-0 w-full h-full z-0 transition-opacity duration-1000 ${
              desktopFramesAvailable || mobileFramesAvailable ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        )}

        {/* Layer 3: High-Fidelity Procedural Cosmic Temple Fallback Canvas */}
        <canvas
          ref={fallbackCanvasRef}
          className={`block absolute inset-0 w-full h-full z-0 transition-opacity duration-1000 ${
            (isVideoMode && (!videoLoaded || videoError)) || (isFrameMode && !desktopFramesAvailable && !mobileFramesAvailable)
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Soft celestial sky tint behind text — lets temple, gopuram and pilgrim remain clear */}
        <div className="absolute top-0 left-0 right-0 h-[46vh] pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(8,11,26,0.65)_0%,rgba(8,11,26,0.22)_55%,transparent_100%)] z-10" />

        {/* Cinematic Vignette & Atmospheric Shadows */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#080B1A] via-transparent to-[#080B1A]/20 z-10" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_45%,rgba(8,11,26,0.45)_100%)] z-10" />

        {/* Layer 4: Refined Editorial Hero Typography */}
        <div
          ref={textGroupRef}
          className="absolute top-0 left-0 right-0 z-20 max-w-2xl mx-auto px-5 text-center flex flex-col items-center pointer-events-none pt-[13svh] sm:pt-[11vh] md:pt-[12.5vh] transition-transform will-change-transform"
        >
          {/* Understated Editorial Eyebrow (Warm Ivory with subtle shadow for high contrast) */}
          <div className="inline-flex items-center space-x-2.5 mb-2 sm:mb-3">
            <div className="w-4 sm:w-6 h-[1px] bg-[#F4EFE4]/35" />
            <span className="text-[10px] sm:text-xs font-sans font-medium tracking-[0.32em] uppercase text-[#F4EFE4] drop-shadow-[0_1px_6px_rgba(4,6,15,0.95)]">
              {t.hero.eyebrow}
            </span>
            <div className="w-4 sm:w-6 h-[1px] bg-[#F4EFE4]/35" />
          </div>

          {/* Primary Cinematic Heading: Warm ivory #FFF8EB with responsive clamp and layered shadow */}
          <h1 className="text-[clamp(1.6rem,3.2vw,2.8rem)] font-cinzel font-medium tracking-[0.18em] text-[#FFF8EB] mb-2.5 sm:mb-3.5 leading-tight drop-shadow-[0_2px_12px_rgba(4,6,15,0.95)] drop-shadow-[0_0_22px_rgba(4,6,15,0.7)]">
            {t.hero.title}
          </h1>

          {/* Concise Supporting Line: Brighter ivory #F4EFE4 for crisp readability */}
          <p className="max-w-md text-xs sm:text-sm md:text-base font-serif-body italic tracking-wide text-[#F4EFE4]/95 leading-relaxed drop-shadow-[0_1px_8px_rgba(4,6,15,0.95)] px-3">
            {t.hero.tagline}
          </p>
        </div>

        {/* Sanctum Arrival Milestone (Visible during deeper scroll progress) */}
        <div
          ref={milestoneRef}
          className="absolute z-20 bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 text-center pointer-events-none opacity-0 transition-opacity duration-300 w-full px-4"
        >
          <div className="inline-flex flex-col items-center space-y-1.5">
            <span className="text-[10.5px] sm:text-xs font-cinzel tracking-[0.25em] uppercase text-[#FFF8EB] drop-shadow-[0_2px_10px_rgba(4,6,15,0.95)]">
              {t.hero.arrivalMilestone}
            </span>
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#C6A15B]/60 to-transparent" />
          </div>
        </div>

        {/* Subtle, Integrated Editorial Scroll Indicator */}
        <div
          ref={scrollIndicatorRef}
          className="absolute z-20 bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1.5 pointer-events-none transition-opacity duration-300"
        >
          <span className="text-[8.5px] sm:text-[9px] font-sans tracking-[0.3em] uppercase text-[#F4EFE4]/75 font-medium drop-shadow-[0_1px_4px_rgba(4,6,15,0.9)]">
            {t.hero.scrollHint}
          </span>
          <div className="w-[1px] h-6 sm:h-7 bg-gradient-to-b from-[#C6A15B]/70 via-[#C6A15B]/30 to-transparent" />
        </div>
      </div>
    </section>
  )
}

export default CinematicHero
