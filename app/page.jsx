'use client'

import { useEffect, useState } from 'react'
import { getTodayEphemeris } from '@/lib/ephemerides'
import BiblicalCard from '@/components/biblical-card'
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
        <div className="absolute inset-0 -z-10">
          <div className="gradient-orb" style={{
            width: '400px',
            height: '400px',
            top: '-100px',
            right: '-100px'
          }} />
          <div className="gradient-orb" style={{
            width: '300px',
            height: '300px',
            bottom: '-100px',
            left: '-100px'
          }} />
        </div>
        <div className="text-center animate-fade-in-up">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground">Cargando efeméride...</h2>
          <p className="text-muted-foreground mt-2">Conectando con la sabiduría bíblica</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="gradient-orb" style={{
            width: '400px',
            height: '400px',
            top: '-100px',
            right: '-100px'
          }} />
        </div>
        <div className="w-full max-w-2xl bg-card rounded-lg border border-primary border-opacity-20 p-8 text-center animate-fade-in-up">
          <h2 className="text-2xl font-bold text-foreground mb-4">Algo salió mal</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </main>
    )
  }

  if (!ephemeris) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="gradient-orb" style={{
            width: '400px',
            height: '400px',
            top: '-100px',
            right: '-100px'
          }} />
        </div>
        <div className="w-full max-w-2xl bg-card rounded-lg border border-primary border-opacity-20 p-8 text-center animate-fade-in-up">
          <h2 className="text-2xl font-bold text-foreground mb-4">Sin datos hoy</h2>
          <p className="text-muted-foreground">No hay una efeméride disponible para esta fecha. Vuelve mañana.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-8 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="gradient-orb" style={{
          width: '400px',
          height: '400px',
          top: '-100px',
          right: '-100px'
        }} />
        <div className="gradient-orb" style={{
          width: '300px',
          height: '300px',
          bottom: '-100px',
          left: '-100px'
        }} />
      </div>
      
      <div className="w-full max-w-3xl relative z-10 space-y-8">
        <BiblicalCard ephemeris={ephemeris} />
        <MenuFooter />
      </div>
    </main>
  )
}
