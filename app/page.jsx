'use client'

import { useEffect, useState } from 'react'
import { getTodayEphemeris } from '@/lib/ephemerides'
import TerminalDisplay from '@/components/terminal-display'
import MenuFooter from '@/components/menu-footer'

export default function Page() {
  const [ephemeris, setEphemeris] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadEphemeris() {
      try {
        const data = await getTodayEphemeris()
        if (!cancelled) {
          setEphemeris(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'No se pudo cargar la efeméride.')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadEphemeris()

    return () => {
      cancelled = true
    }
  }, [])

  if (isLoading) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 overflow-hidden">
        <div className="fixed inset-0 -z-10" style={{
          background: 'linear-gradient(135deg, rgba(0, 255, 0, 0.05) 0%, rgba(15, 15, 15, 0) 25%, rgba(0, 212, 255, 0.03) 50%, rgba(15, 15, 15, 0) 75%, rgba(0, 255, 0, 0.05) 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradientFlow 15s ease infinite'
        }} />
        <div className="text-terminal-green terminal-glow-strong text-center">
          <p className="text-lg">$ CARGANDO EFEMÉRIDE...</p>
          <div className="mt-4 inline-block animate-blink">_</div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 overflow-hidden">
        <div className="fixed inset-0 -z-10" style={{
          background: 'linear-gradient(135deg, rgba(0, 255, 0, 0.05) 0%, rgba(15, 15, 15, 0) 25%, rgba(0, 212, 255, 0.03) 50%, rgba(15, 15, 15, 0) 75%, rgba(0, 255, 0, 0.05) 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradientFlow 15s ease infinite'
        }} />
        <div className="w-full max-w-2xl border-2 border-terminal-green bg-terminal-dark/95 p-6 text-terminal-green terminal-glow">
          <div className="text-terminal-amber">$ ERROR AL LEER SUPABASE</div>
          <div className="mt-4 text-sm">{error}</div>
        </div>
      </main>
    )
  }

  if (!ephemeris) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 overflow-hidden">
        <div className="fixed inset-0 -z-10" style={{
          background: 'linear-gradient(135deg, rgba(0, 255, 0, 0.05) 0%, rgba(15, 15, 15, 0) 25%, rgba(0, 212, 255, 0.03) 50%, rgba(15, 15, 15, 0) 75%, rgba(0, 255, 0, 0.05) 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradientFlow 15s ease infinite'
        }} />
        <div className="w-full max-w-2xl border-2 border-terminal-green bg-terminal-dark/95 p-6 text-terminal-green terminal-glow">
          <div className="text-terminal-amber">$ NO HAY EFEMÉRIDE PARA HOY</div>
          <div className="mt-4 text-sm">Aún no existe un registro en Supabase para la fecha actual.</div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-8 overflow-hidden">
      <div className="fixed inset-0 -z-10" style={{
        background: 'linear-gradient(135deg, rgba(0, 255, 0, 0.05) 0%, rgba(15, 15, 15, 0) 25%, rgba(0, 212, 255, 0.03) 50%, rgba(15, 15, 15, 0) 75%, rgba(0, 255, 0, 0.05) 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientFlow 15s ease infinite'
      }} />
      
      <div className="w-full max-w-2xl relative z-10">
        <TerminalDisplay ephemeris={ephemeris} />
        <MenuFooter />
      </div>

      <style jsx>{`
        @keyframes gradientFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </main>
  )
}
