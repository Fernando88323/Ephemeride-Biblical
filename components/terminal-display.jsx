"use client";

import { useEffect, useState } from "react";

function formatDisplayDate(displayDate) {
  if (!displayDate) return "";

  const parts = displayDate.split("-");
  if (parts.length !== 3) return displayDate;

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export default function TerminalDisplay({ ephemeris }) {
  const [displayText, setDisplayText] = useState("");
  const [eventText, setEventText] = useState("");

  useEffect(() => {
    if (!ephemeris) return;

    setDisplayText("");
    setEventText("");

    let charIndex = 0;
    const prompt = "Lectura del día";
    const promptTimer = setInterval(() => {
      if (charIndex <= prompt.length) {
        setDisplayText(prompt.substring(0, charIndex));
        charIndex++;
      } else {
        clearInterval(promptTimer);
      }
    }, 50);

    return () => clearInterval(promptTimer);
  }, [ephemeris]);

  useEffect(() => {
    if (!ephemeris) return;

    const event = ephemeris.event || "";
    let charIndex = 0;
    const eventTimer = setInterval(() => {
      if (charIndex <= event.length) {
        setEventText(event.substring(0, charIndex));
        charIndex++;
      } else {
        clearInterval(eventTimer);
      }
    }, 15);

    return () => clearInterval(eventTimer);
  }, [ephemeris]);

  if (!ephemeris) return null;

  return (
    <article className="relative overflow-hidden rounded-3xl">
      <div
        className="gradient-orb animate-orb-float-1"
        style={{
          width: "300px",
          height: "300px",
          top: "-100px",
          right: "-50px",
          background:
            "radial-gradient(circle, rgba(106, 141, 255, 0.32) 0%, transparent 70%)",
        }}
      />
      <div
        className="gradient-orb animate-orb-float-2"
        style={{
          width: "250px",
          height: "250px",
          bottom: "-80px",
          left: "-50px",
          background:
            "radial-gradient(circle, rgba(94, 233, 255, 0.2) 0%, transparent 70%)",
        }}
      />

      <div className="surface-card p-6 sm:p-8">
        <header className="mb-6 border-b border-terminal-green/15 pb-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="inline-flex rounded-full border border-terminal-blue/35 bg-terminal-blue/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-terminal-blue">
              Historia bíblica
            </div>
            <span className="inline-flex items-center gap-2 text-xs text-terminal-green/65">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Actualizado
            </span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-terminal-green sm:text-3xl">
            Efeméride del día
          </h2>
          {ephemeris.display_date && (
            <p className="mt-2 text-sm text-terminal-green/70">
              {formatDisplayDate(ephemeris.display_date)}
            </p>
          )}
        </header>

        <div className="mb-5 min-h-6 text-sm font-mono text-terminal-blue">
          <span>{displayText}</span>
          {displayText.length < 14 && <span className="animate-blink">_</span>}
        </div>

        <div className="mb-7 rounded-2xl border border-terminal-green/15 bg-terminal-dark/60 p-5 text-base leading-relaxed text-terminal-green/95 sm:text-lg">
          {eventText}
          {eventText.length < (ephemeris.event || "").length && (
            <span className="animate-blink">_</span>
          )}
        </div>

        {(ephemeris.historical_day ||
          ephemeris.historical_month ||
          ephemeris.historical_year) && (
          <div className="rounded-2xl border border-terminal-amber/35 bg-terminal-amber/10 p-4 text-sm text-terminal-amber">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-terminal-amber/85">
              Referencia histórica
            </div>
            <div className="font-medium">
              {ephemeris.historical_day || "--"}/
              {ephemeris.historical_month || "--"}/
              {ephemeris.historical_year || "--"}
            </div>
          </div>
        )}

        <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-terminal-green/15 pt-5">
          <span className="rounded-full border border-terminal-blue/35 bg-terminal-blue/10 px-3 py-1 text-xs font-medium text-terminal-blue">
            Comparte con tu comunidad
          </span>
          <span className="rounded-full border border-terminal-green/20 bg-terminal-green/10 px-3 py-1 text-xs font-medium text-terminal-green/90">
            Vuelve mañana para otra efeméride
          </span>
        </div>
      </div>
    </article>
  );
}
