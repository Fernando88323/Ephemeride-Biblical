'use client'

import { useEffect, useState } from 'react'
import { Share2 } from 'lucide-react'

function formatDisplayDate(displayDate) {
  if (!displayDate) return ''

  const parts = displayDate.split('-')
  if (parts.length !== 3) return displayDate

  const date = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`)
  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  
  const dayName = days[date.getDay()]
  const monthName = months[date.getMonth()]
  
  return `${dayName}, ${parts[2]} de ${monthName} de ${parts[0]}`
}

export default function TerminalDisplay({ ephemeris }) {
  const [eventText, setEventText] = useState('')
  const [allTextShown, setAllTextShown] = useState(false)

  useEffect(() => {
    if (!ephemeris) return

    setEventText('')
    setAllTextShown(false)

    const event = ephemeris.event || ''
    let charIndex = 0
    const eventTimer = setInterval(() => {
      if (charIndex <= event.length) {
        setEventText(event.substring(0, charIndex))
        charIndex++
      } else {
        setAllTextShown(true)
        clearInterval(eventTimer)
      }
    }, 15)

    return () => clearInterval(eventTimer)
  }, [ephemeris])

  const handleShare = () => {
    const text = `${ephemeris.event}\n\nEfeméride Bíblica - ${formatDisplayDate(ephemeris.display_date)}`
    if (navigator.share) {
      navigator.share({
        title: 'Efeméride Bíblica',
        text: text,
      })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  if (!ephemeris) return null

  return (
    <div className="relative overflow-hidden w-full">
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

      {/* Terminal Header */}
      <div className="border-2 border-terminal-green bg-terminal-dark/95 overflow-hidden shadow-2xl terminal-glow backdrop-blur-sm">
        {/* Title Bar */}
        <div className="bg-terminal-green bg-opacity-10 px-4 py-2 border-b border-terminal-green border-opacity-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-terminal-green"></div>
            <span className="text-xs text-terminal-green">code-history v0.1.0</span>
          </div>
          <div className="text-xs text-terminal-green">⏱ {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
        </div>

        <div className="p-6 space-y-4">
          {/* Command prompt */}
          <div className="space-y-1 text-sm">
            <div className="text-terminal-green">
              <span className="text-terminal-amber">user</span>
              <span className="text-terminal-green">@mouredev:~$ ./code-history --day</span>
            </div>
          </div>

          {/* System initialization messages */}
          <div className="space-y-1 text-xs my-4">
            <div className="text-terminal-green flex items-center gap-2">
              <span className="text-terminal-green">●</span>
              <span>Iniciando sistema de efemérides de programación...</span>
            </div>
            <div className="text-terminal-green flex items-center gap-2">
              <span className="text-terminal-green">●</span>
              <span>Conectando con la base de datos... <span className="text-terminal-amber font-bold">[OK]</span></span>
            </div>
            <div className="text-terminal-green flex items-center gap-2">
              <span className="text-terminal-green">●</span>
              <span>Cargando datos históricos... <span className="text-terminal-amber font-bold">[OK]</span></span>
            </div>
            <div className="text-terminal-green flex items-center gap-2">
              <span className="text-terminal-green">●</span>
              <span>Sistema listo. Descubre la historia de la programación día a día.</span>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-terminal-green border-opacity-30 my-4"></div>

          {/* Current date */}
          <div className="text-terminal-amber text-sm flex items-center gap-2">
            <span>📅</span>
            <span>Fecha actual: {formatDisplayDate(ephemeris.display_date)}</span>
          </div>

          {/* Separator */}
          <div className="border-t border-terminal-green border-opacity-30 my-4"></div>

          {/* Ephemeris box */}
          <div className="border-2 border-terminal-green rounded p-4 space-y-3">
            <div className="flex items-center gap-2 text-terminal-green font-bold">
              <span className="text-terminal-amber">&lt;&gt;</span>
              <span>EFEMÉRIDE DEL DÍA</span>
            </div>

            <div className="text-terminal-amber text-xs">
              {ephemeris.display_date ? ephemeris.display_date.split('-')[0] : ''}:
            </div>

            <div className="text-terminal-green text-sm leading-relaxed min-h-12">
              {eventText}
              {!allTextShown && <span className="animate-blink">_</span>}
            </div>

            {/* Share button */}
            {allTextShown && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 border border-terminal-green text-terminal-green hover:bg-terminal-green hover:bg-opacity-10 hover:text-terminal-green transition-colors rounded text-sm"
                >
                  <Share2 size={16} />
                  Compartir
                </button>
              </div>
            )}
          </div>

          {/* Command prompt at end */}
          <div className="text-terminal-green text-sm mt-6">
            <span className="text-terminal-amber">user</span>
            <span className="text-terminal-green">@mouredev:~$ </span>
            <span className="animate-blink">_</span>
          </div>
        </div>
      </div>
    </div>
  )
}
