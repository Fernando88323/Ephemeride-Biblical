"use client";

import { useEffect, useState } from "react";
import { getTodayEphemeris } from "@/lib/ephemerides";
import BiblicalCard from "@/components/biblical-card";
import MenuFooter from "@/components/menu-footer";

export default function Page() {
  const [ephemeris, setEphemeris] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadEphemeris() {
      try {
        const data = await getTodayEphemeris();
        if (!cancelled) {
          setEphemeris(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo cargar la efeméride.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadEphemeris();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-12">
        <div className="w-full max-w-md text-center animate-fade-in-up space-y-5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Cargando efeméride
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Conectando con la sabiduría bíblica
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-12">
        <div className="w-full max-w-2xl bg-red-50 rounded-2xl border border-red-200 p-6 sm:p-10 md:p-12 text-center animate-fade-in-up space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Algo salió mal
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex w-full justify-center px-6 py-3 sm:w-auto bg-primary text-white font-semibold rounded-xl hover:bg-secondary transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </main>
    );
  }

  if (!ephemeris) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-12">
        <div className="w-full max-w-2xl bg-card rounded-2xl border border-gray-200 p-6 sm:p-10 md:p-12 text-center animate-fade-in-up space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Sin datos hoy
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            No hay una efeméride disponible para esta fecha. Vuelve mañana para
            descubrir más.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-7">
          <div className="space-y-3 text-center md:text-left">
            <p className="text-primary font-semibold text-sm tracking-widest uppercase">
              Sistema de Efemérides
            </p>
            {/* <h1 className="text-3xl sm:text-[2rem] font-bold text-foreground">
              Biblia Diaria
            </h1> */}
            {/*             <p className="mx-auto max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed md:mx-0">
              Una lectura diaria clara y centrada para descubrir cada efeméride
              bíblica con comodidad desde el móvil.
            </p> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-14">
        <div className="w-full max-w-3xl">
          <BiblicalCard ephemeris={ephemeris} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0">
        <MenuFooter />
      </div>
    </main>
  );
}
