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
    <div className="mt-12 animate-fade-in-up text-center space-y-2 pt-8 border-t border-primary border-opacity-20">
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">
          Expande tu conocimiento con enseñanzas bíblicas diarias
        </p>
        <p className="text-xs text-muted-foreground">
          Desarrollado por Fernando Gutiérrez
        </p>
        <p className="text-xs text-muted-foreground font-semibold">
          Sistema de Efemérides Bíblicas v1.0
        </p>
      </div>
    </div>
  )
}
