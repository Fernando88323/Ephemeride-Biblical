'use client'

import { useEffect, useState } from 'react'

export default function MenuFooter() {
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowMenu(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  if (!showMenu) return null

  return (
    <div className="mt-8 animate-fade-in space-y-3 border-t border-terminal-green border-opacity-30 pt-6 text-center">
      <div className="text-terminal-green text-xs opacity-70">
        {'═'.repeat(50)}
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="text-terminal-green opacity-75">
          <span className="text-terminal-amber">$</span> Pulsa Ctrl+W para salir
        </div>
        <div className="text-terminal-green opacity-60 text-xs">
          © 2025 <span className="text-terminal-amber">MoureDev</span> by Brais Moure
        </div>
        <div className="text-terminal-green opacity-60 text-xs">
          Desarrollado con <span className="text-terminal-amber">❤</span> desde Galicia para el mundo
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
      `}</style>
    </div>
  )
}
