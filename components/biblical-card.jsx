'use client'

import { useEffect, useState } from 'react'
import { Share2 } from 'lucide-react'
import Image from 'next/image'

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
    <div className="w-full animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
          Enseñanza Bíblica del Día
        </h1>
        <p className="text-primary text-lg font-semibold">
          {formatDisplayDate(ephemeris.display_date)}
        </p>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
        <div className="rounded-lg overflow-hidden border-2 border-primary border-opacity-30 h-32 md:h-40 bg-background flex items-center justify-center">
          <Image
            src="/biblical-1.png"
            alt="Biblia sagrada"
            width={300}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="rounded-lg overflow-hidden border-2 border-secondary border-opacity-30 h-32 md:h-40 bg-background flex items-center justify-center">
          <Image
            src="/biblical-2.png"
            alt="Cruz sagrada"
            width={300}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="rounded-lg overflow-hidden border-2 border-accent border-opacity-30 h-32 md:h-40 bg-background flex items-center justify-center">
          <Image
            src="/biblical-3.png"
            alt="Manos rezando"
            width={300}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden animate-soft-glow biblical-glow">
        {/* Date Indicator */}
        <div className="bg-primary bg-opacity-10 border-b border-primary border-opacity-20 px-6 md:px-8 py-4">
          <p className="text-primary font-semibold text-sm tracking-widest">
            {year}
          </p>
        </div>

        {/* Content */}
        <div className="px-6 md:px-8 py-8 space-y-6">
          {/* Title Section */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
              {ephemeris.historical_year ? (
                <>
                  {ephemeris.historical_day}{' '}
                  <span className="text-primary">
                    de {new Date(2024, ephemeris.historical_month - 1, ephemeris.historical_day).toLocaleDateString('es-ES', { month: 'long' })}
                  </span>
                  {' '}de {ephemeris.historical_year}
                </>
              ) : (
                'Reflexión del día'
              )}
            </h2>
          </div>

          {/* Event Text */}
          <div className="bg-background rounded-lg p-6 border border-border border-opacity-50">
            <p className="text-foreground leading-relaxed text-lg min-h-24">
              {eventText}
              {!allTextShown && (
                <span className="animate-pulse">|</span>
              )}
            </p>
          </div>

          {/* Share Button */}
          {allTextShown && (
            <div className="flex justify-center pt-4">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground hover:bg-opacity-90 rounded-lg transition-all duration-300 hover:shadow-lg font-semibold"
              >
                <Share2 size={18} />
                Compartir efeméride
              </button>
            </div>
          )}
        </div>

        {/* Footer Accent */}
        <div className="h-1 bg-primary opacity-30"></div>
      </div>

      {/* Decorative Elements */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}
