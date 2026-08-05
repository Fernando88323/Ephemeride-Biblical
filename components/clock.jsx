'use client'

import { useEffect, useState } from 'react'

export default function Clock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    // Set initial time
    const updateTime = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      setTime(`${hours}:${minutes}:${seconds}`)
    }

    updateTime()

    // Update time every second
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-6 right-6 bg-card border border-primary border-opacity-30 rounded-lg px-4 py-2 backdrop-blur-sm">
      <p className="text-sm font-mono text-primary font-semibold tracking-wider">
        {time || '00:00:00'}
      </p>
    </div>
  )
}
