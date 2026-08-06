/* "use client";

import { useEffect, useState } from "react";

export default function MenuFooter() {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowMenu(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!showMenu) return null;

  return (
    <footer className="mt-6 animate-fade-in">
      <div className="surface-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-sm font-medium text-terminal-green">Sistema de Efemérides Bíblicas</p>
          <p className="mt-1 text-xs text-terminal-green/70">Experiencia diaria inspirada en apps devocionales modernas.</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center text-xs sm:w-auto">
          <div className="rounded-xl border border-terminal-blue/30 bg-terminal-blue/10 px-3 py-2 text-terminal-blue">
            <div className="font-semibold">Diario</div>
            <div className="mt-0.5 text-terminal-blue/80">Nuevo cada día</div>
          </div>
          <div className="rounded-xl border border-terminal-amber/30 bg-terminal-amber/10 px-3 py-2 text-terminal-amber">
            <div className="font-semibold">Bíblico</div>
            <div className="mt-0.5 text-terminal-amber/80">Contexto histórico</div>
          </div>
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
    </footer>
  );
}
 */

"use client";

import { useEffect, useState } from "react";

export default function MenuFooter() {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowMenu(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  if (!showMenu) return null;

  return (
    <footer className="mt-16 animate-fade-in-up py-12 border-t border-gray-200">
      <div className="max-w-3xl mx-auto px-4 space-y-8">
        {/* Main Content */}
        <div className="text-center space-y-4">
          <p className="text-lg text-foreground font-semibold leading-relaxed">
            Expande tu conocimiento con enseñanzas bíblicas diarias
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-sm text-foreground">
            <span>Desarrollado por</span>
            <span className="font-semibold text-primary">
              Fernando Gutiérrez
            </span>
            {/*<span className="hidden md:inline">|</span>
             <span className="md:hidden">·</span>
             <span className="font-semibold text-primary">
              <a
                href="https://github.com/Fernando88323/Ephemeride-Biblical/"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </span> */}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-40"></div>

        {/* Version */}
        <div className="text-center">
          <p className="text-xs text-foreground tracking-wider uppercase font-semibold opacity-70">
            Sistema de Devocionales Diarios v1.0
          </p>
          <p className="text-xs text-foreground tracking-wider uppercase font-semibold opacity-70">
            @2026 Copyright. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
