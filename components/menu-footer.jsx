'use client'

import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'

export default function MenuFooter() {
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowMenu(true), 6000)
    return () => clearTimeout(timer)
  }, [])

  if (!showMenu) return null

  return (
    <div className="mt-12 animate-fade-in-up text-center space-y-4 pt-8 border-t border-border border-opacity-50">
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">
          Expande tu conocimiento con enseñanzas bíblicas diarias
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>© 2025 Enseñanzas Bíblicas</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Desarrollado por</span>
          <span className="text-primary font-semibold">Fernando Gutiérrez</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Con</span>
          <Heart size={14} className="text-primary fill-primary" />
          <span>para la comunidad</span>
        </div>
      </div>
    </div>
  )
}
