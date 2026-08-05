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
  
  return `${dayName.charAt(0).toUpperCase()}${dayName.slice(1)}, ${parts[2]} de ${monthName}`
}

export default function BiblicalCard({ ephemeris }) {
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
    }, 20)

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

  const year = ephemeris.display_date ? ephemeris.display_date.split('-')[0] : ''

  return (
    <div className="w-full animate-fade-in-up space-y-8">
      {/* Top Section */}
      <div className="space-y-3">
        <p className="text-primary font-semibold text-sm tracking-widest uppercase">
          {formatDisplayDate(ephemeris.display_date)}
        </p>
        <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
          Efeméride Bíblica
        </h1>
      </div>

      {/* Main Card - YouVersion Style */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary to-secondary p-8 md:p-12 text-white space-y-4">
          <p className="text-white text-opacity-90 text-sm font-semibold uppercase tracking-widest">
            Año {year}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            {ephemeris.historical_year ? (
              <>
                {ephemeris.historical_day} de {new Date(2024, ephemeris.historical_month - 1, ephemeris.historical_day).toLocaleDateString('es-ES', { month: 'long' })}
                <br />
                {ephemeris.historical_year}
              </>
            ) : (
              'Reflexión Especial'
            )}
          </h2>
        </div>

        {/* Content Section */}
        <div className="px-8 md:px-12 py-10 md:py-14 space-y-8">
          {/* Main Text */}
          <div className="space-y-4">
            <p className="text-xl md:text-2xl leading-relaxed text-foreground font-medium">
              {eventText}
              {!allTextShown && (
                <span className="inline-block ml-1 w-1 h-8 bg-primary animate-pulse"></span>
              )}
            </p>
          </div>

          {/* Action Buttons */}
          {allTextShown && (
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-secondary text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg active:scale-95"
              >
                <Share2 size={20} />
                Compartir
              </button>
              <button
                className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all duration-300"
              >
                Guardar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="bg-card rounded-xl p-6 text-center border border-gray-200">
          <p className="text-primary font-bold text-2xl">{year}</p>
          <p className="text-muted-foreground text-sm mt-2">Año</p>
        </div>
        <div className="bg-card rounded-xl p-6 text-center border border-gray-200">
          <p className="text-primary font-bold text-2xl">{ephemeris.historical_day || '--'}</p>
          <p className="text-muted-foreground text-sm mt-2">Día</p>
        </div>
        <div className="bg-card rounded-xl p-6 text-center border border-gray-200">
          <p className="text-primary font-bold text-2xl">{ephemeris.historical_month || '--'}</p>
          <p className="text-muted-foreground text-sm mt-2">Mes</p>
        </div>
      </div>
    </div>
  )
}
