'use client'

import { motion, useMotionValue } from 'framer-motion'
import { useEffect } from 'react'

const FRAME_COUNT = 6
const FRAME_WIDTH = 92
const FRAME_HEIGHT = 137

interface CrowdyIdleProps {
  width?: number
  height?: number
  /** 한 사이클의 총 재생 시간(초) (기본값: 0.8초) */
  duration?: number
  spriteType?: 'idle' | 'like'
}

export default function CrowdyIdle({
  width = FRAME_WIDTH,
  height = FRAME_HEIGHT,
  duration = 0.8,
  spriteType = 'idle',
}: CrowdyIdleProps) {
  const bgX = useMotionValue(0)
  const spriteSrc = spriteType === 'idle' ? '/Crowdy_idle.png' : '/Crowdy_like.png'

  useEffect(() => {
    let frame = 0
    const interval = setInterval(
      () => {
        frame = (frame + 1) % FRAME_COUNT
        bgX.set(-width * frame)
      },
      (duration * 1000) / FRAME_COUNT,
    )

    return () => clearInterval(interval)
  }, [width, duration, bgX])

  return (
    <motion.div
      style={{
        width,
        height,
        backgroundImage: `url(${spriteSrc})`,
        backgroundSize: `${FRAME_COUNT * width}px ${height}px`,
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        backgroundPositionX: bgX,
      }}
    />
  )
}
