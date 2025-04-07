'use client'

import { motion } from 'framer-motion'
import { stringToColor } from '@/lib/stringToColor'

const FollowPointer = ({
  info,
  x,
  y
}: {
  info: { name: string; email: string; avatar: string }
  x: number
  y: number
}) => {
  const color = stringToColor(info.email || 'test@gmail.com')
  const yOffset = -35 // Moves the name slightly above the cursor



  return (
    <motion.div
      className="h-4 w-4 rounded-full absolute z-50"
      style={{
        top: y,
        left: x,
        pointerEvents: 'none'
      }}
      initial={{ scale: 1, opacity: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
    >
      {/* SVG Cursor with a ring effect */}
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        {/* Outer ring */}
        <circle cx="20" cy="20" r="10" stroke={color} strokeWidth="3" fill="none" />
        {/* Inner dot */}
        <circle cx="20" cy="20" r="5" fill={color} />
      </svg>

      {/* Name tag slightly above the cursor */}
      <motion.div
        className="absolute px-2 py-1 bg-white text-black font-semibold whitespace-nowrap min-w-max text-xs rounded-full shadow-md"
        style={{
        //   transform: `translate(-50%, ${yOffset}px)`,
          border: `1px solid ${color}`
        // backgroundColor:color
        }}
        initial={{ opacity: 0, scale: 0.5}}
        animate={{ opacity: 1, scale: 1}}
        exit={{ opacity: 0, scale: 0.5 }}
      >
        {info.name || info.email}
      </motion.div>
    </motion.div>
  )
}

export default FollowPointer
