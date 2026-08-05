'use client'

import { useEffect, useState } from 'react'

export default function MenuFooter() {
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowMenu(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!showMenu) return null

  return (
    <div className="mt-8 animate-fade-in space-y-2 border-t border-terminal-green border-opacity-30 pt-6 text-center text-xs">
      <div className="text-terminal-amber">
        {'═'.repeat(50)}
      </div>
      <div className="grid grid-cols-2 gap-4 text-terminal-green">
        <div className="rounded border border-terminal-green border-opacity-30 p-2">
          <div className="text-terminal-amber">[F5]</div>
          <div className="text-xs">Recargar página</div>
        </div>
        <div className="rounded border border-terminal-green border-opacity-30 p-2">
          <div className="text-terminal-blue">[ESPACIO]</div>
          <div className="text-xs">Siguiente verso</div>
        </div>
      </div>
      <div className="mt-4 text-terminal-green opacity-50">
        Sistema de Efemérides Bíblicas v1.0
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
