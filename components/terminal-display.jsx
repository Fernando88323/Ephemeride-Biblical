'use client'

import { useEffect, useState } from 'react'

function formatDisplayDate(displayDate) {
  if (!displayDate) return ''

  const parts = displayDate.split('-')
  if (parts.length !== 3) return displayDate

  return `${parts[2]}/${parts[1]}/${parts[0]}`
}

export default function TerminalDisplay({ ephemeris }) {
  const [displayText, setDisplayText] = useState('')
  const [eventText, setEventText] = useState('')

  useEffect(() => {
    if (!ephemeris) return

    setDisplayText('')
    setEventText('')

    let charIndex = 0
    const prompt = '> EFEMÉRIDE BÍBLICA DEL DÍA'
    const promptTimer = setInterval(() => {
      if (charIndex <= prompt.length) {
        setDisplayText(prompt.substring(0, charIndex))
        charIndex++
      } else {
        clearInterval(promptTimer)
      }
    }, 50)

    return () => clearInterval(promptTimer)
  }, [ephemeris])

  useEffect(() => {
    if (!ephemeris) return

    const event = ephemeris.event || ''
    let charIndex = 0
    const eventTimer = setInterval(() => {
      if (charIndex <= event.length) {
        setEventText(event.substring(0, charIndex))
        charIndex++
      } else {
        clearInterval(eventTimer)
      }
    }, 15)

    return () => clearInterval(eventTimer)
  }, [ephemeris])

  if (!ephemeris) return null

  return (
    <div className="relative overflow-hidden">
      <div className="gradient-orb animate-orb-float-1" style={{
        width: '300px',
        height: '300px',
        top: '-100px',
        right: '-50px',
        background: 'radial-gradient(circle, rgba(0, 255, 0, 0.25) 0%, transparent 70%)'
      }} />
      <div className="gradient-orb animate-orb-float-2" style={{
        width: '250px',
        height: '250px',
        bottom: '-80px',
        left: '-50px',
        background: 'radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%)'
      }} />

      <div className="border-2 border-terminal-green bg-terminal-dark/95 p-6 font-mono shadow-2xl terminal-glow backdrop-blur-sm">
        <div className="mb-4 border-b border-terminal-green pb-2">
          <div className="flex items-center justify-between text-sm text-terminal-amber">
            <span>BIBLIA.SYS v1.0 [Terminal BÍBLICO]</span>
            <span className="text-terminal-green">●</span>
          </div>
        </div>

        <div className="mb-6 min-h-6 text-terminal-green">
          <span>{displayText}</span>
          {displayText.length < 26 && <span className="animate-blink">_</span>}
        </div>

        <div className="mb-4 text-xl font-bold text-terminal-green terminal-glow">
          EFEMÉRIDE DEL DÍA
        </div>

        {ephemeris.display_date && (
          <div className="mb-4 text-sm text-terminal-amber">
            [FECHA: {formatDisplayDate(ephemeris.display_date)}]
          </div>
        )}

        <div className="mb-6 border-t border-terminal-green border-opacity-30 pt-4 text-sm leading-relaxed text-terminal-green">
          {eventText}
          {eventText.length < (ephemeris.event || '').length && <span className="animate-blink">_</span>}
        </div>

        {(ephemeris.historical_day || ephemeris.historical_month || ephemeris.historical_year) && (
          <div className="rounded border border-terminal-green border-opacity-30 bg-terminal-dark p-4 text-xs text-terminal-amber">
            <div className="mb-1 uppercase">📖 Referencia Histórica</div>
            <div>
              {ephemeris.historical_day || '--'}/{ephemeris.historical_month || '--'}/{ephemeris.historical_year || '--'}
            </div>
          </div>
        )}

        <div className="mt-8 border-t border-terminal-green border-opacity-30 pt-4 text-xs text-terminal-amber">
          <span className="text-terminal-green">$</span> Vuelve mañana para otra efeméride bíblica
        </div>
      </div>
    </div>
  )
}
