'use client'

import { useEffect, useState } from 'react'

export default function MenuFooter() {
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowMenu(true), 6000)
    return () => clearTimeout(timer)
  }, [])

  if (!showMenu) return null

  return (
    <footer className="mt-16 animate-fade-in-up py-12 border-t border-gray-200">
      <div className="max-w-3xl mx-auto px-4 space-y-8">
        {/* Main Content */}
        <div className="text-center space-y-4">
          <p className="text-lg text-foreground font-semibold leading-relaxed">
            Expande tu conocimiento con enseñanzas bíblicas diarias
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Desarrollado por</span>
            <span className="font-semibold text-primary">Fernando Gutiérrez</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"></div>

        {/* Version */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground tracking-wider uppercase font-semibold">
            Sistema de Efemérides Bíblicas v1.0
          </p>
        </div>
      </div>
    </footer>
  )
}
