import React, { useEffect, useState } from 'react'

export const ScrollProgress: React.FC = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let animationFrameId: number

    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight
        if (totalHeight > 0) {
          const currentProgress = (window.scrollY / totalHeight) * 100
          setProgress(Math.min(100, Math.max(0, currentProgress)))
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-[#C6A15B] via-[#DFC283] to-[#C6A15B] shadow-[0_0_8px_rgba(198,161,91,0.6)] transition-all duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
export default ScrollProgress
