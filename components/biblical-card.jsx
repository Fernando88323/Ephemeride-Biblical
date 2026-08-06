"use client";

import { useEffect, useState } from "react";
import { BookOpen, MessageCircle, Share2, CircleCheckBig } from "lucide-react";

// funcion para formatear la fecha de visualización
function formatDisplayDate(displayDate) {
  if (!displayDate) return "";

  const parts = displayDate.split("-");
  if (parts.length !== 3) return displayDate;

  const [year, month, day] = parts.map(Number);
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return displayDate;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  const days = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  const dayName = days[date.getUTCDay()];
  const monthName = months[date.getUTCMonth()];

  return `${dayName.charAt(0).toUpperCase()}${dayName.slice(1)}, ${day} de ${monthName} de ${year}`;
}

export default function BiblicalCard({ ephemeris }) {
  const [eventText, setEventText] = useState("");
  const [allTextShown, setAllTextShown] = useState(false);
  const [whatsAppStatusMessage, setWhatsAppStatusMessage] = useState("");

  useEffect(() => {
    if (!ephemeris) return;

    setEventText("");
    setAllTextShown(false);

    const event = ephemeris.event || "";
    let charIndex = 0;
    const eventTimer = setInterval(() => {
      if (charIndex <= event.length) {
        setEventText(event.substring(0, charIndex));
        charIndex++;
      } else {
        setAllTextShown(true);
        clearInterval(eventTimer);
      }
    }, 12);

    return () => clearInterval(eventTimer);
  }, [ephemeris]);

  const shareableText = () => {
    const lines = [
      `*Efeméride Bíblica - ${formatDisplayDate(ephemeris.display_date)}*`,
      "",
      ephemeris.event,
      "",
      `📖 ${ephemeris.bible_reference}`,
      `"${ephemeris.verse_text}"`,
      "",
      `🙏 Aplicación:`,
      ephemeris.application,
    ].filter(Boolean);
    return lines.join("\n");
  };

  // Función para manejar la acción de compartir
  const handleShare = () => {
    const text = shareableText();
    if (navigator.share) {
      navigator.share({
        title: "Efeméride Bíblica",
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  // Función para manejar la acción de compartir en WhatsApp
  const handleWhatsAppShare = () => {
    const text = shareableText();
    const pageUrl = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${pageUrl}`)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (!ephemeris) return null;

  const year = ephemeris.display_date
    ? ephemeris.display_date.split("-")[0]
    : "";
  const historicalMonth = Number(ephemeris.historical_month);
  const historicalDay = Number(ephemeris.historical_day);
  const historicalMonthName =
    Number.isInteger(historicalMonth) && Number.isInteger(historicalDay)
      ? new Date(
          Date.UTC(2024, historicalMonth - 1, historicalDay),
        ).toLocaleDateString("es-ES", { month: "long", timeZone: "UTC" })
      : "";

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in-up space-y-6 md:space-y-7">
      <div className="space-y-3 text-center md:text-left">
        {/* <h1 className="text-3xl sm:text-4xl md:text-[2.85rem] font-bold text-foreground leading-tight">
          Efeméride Bíblica
        </h1> */}
        {/*  <p className="border border-primary rounded-2xl p-4 text-primary font-semibold text-sm tracking-widest">
          <span>
            <strong>Fecha actual: </strong>
          </span>
          {formatDisplayDate(ephemeris.display_date)}
        </p> */}
      </div>

      <div className="bg-card rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-border">
        <div className="bg-gradient-to-br from-primary to-secondary p-6 sm:p-8 md:p-10 text-primary-foreground">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4">
              <BookOpen size={32} className="shrink-0 opacity-90" />
              <h2 className="text-2xl sm:text-3xl md:text-[2rem] font-bold leading-tight">
                {ephemeris.historical_year ? (
                  <>
                    {ephemeris.historical_day} de {historicalMonthName}
                    <br />
                    {ephemeris.historical_year}
                  </>
                ) : (
                  "Devocional Diario"
                )}
              </h2>
            </div>
            <p className="text-primary-foreground/90 font-semibold text-sm tracking-widest shrink-0">
              {formatDisplayDate(ephemeris.display_date)}
            </p>
          </div>
        </div>

        <div className="px-5 sm:px-8 md:px-10 py-8 sm:py-10 md:py-12 space-y-7">
          <div className="space-y-4">
            <p className="mx-auto max-w-2xl text-left text-lg sm:text-xl md:text-[1.35rem] leading-relaxed text-foreground font-medium">
              {eventText}
              {!allTextShown && (
                <span className="inline-block ml-1 w-1 h-8 bg-primary animate-pulse"></span>
              )}
            </p>
          </div>

          {ephemeris.bible_reference && (
            <div className="animate-fade-in-up space-y-6">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6 space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <BookOpen size={18} />
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Cita bíblica
                  </p>
                </div>
                <p className="text-lg sm:text-xl font-bold text-foreground">
                  {ephemeris.bible_reference}
                </p>
                <p className="text-base text-left sm:text-lg italic leading-relaxed text-foreground/85">
                  &ldquo;{ephemeris.verse_text}&rdquo;
                </p>
              </div>

              {ephemeris.application && (
                <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-3">
                  <div className="flex items-center gap-2 text-primary">
                    <CircleCheckBig size={18} />
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      Aplicación para hoy
                    </p>
                  </div>
                  <p className="text-base text-left sm:text-lg leading-relaxed text-foreground/90">
                    {ephemeris.application}
                  </p>
                </div>
              )}
            </div>
          )}

          {allTextShown && (
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center md:justify-end gap-3 sm:gap-4 pt-6 border-t border-border">
              <button
                onClick={handleShare}
                className="flex w-full sm:w-auto items-center justify-center border-2 border-primary gap-2 px-6 sm:px-8 py-3 bg-primary hover:bg-secondary text-primary-foreground font-semibold rounded-xl transition-all duration-300 hover:shadow-lg active:scale-95"
              >
                <Share2 size={20} />
                Compartir
              </button>
              {/* Buton de compartir directamente en whatsapp */}
              {/* <button
                onClick={handleWhatsAppShare}
                className="flex w-full sm:w-auto items-center justify-center border-2 border-primary gap-2 px-6 sm:px-8 py-3 text-primary font-semibold rounded-xl hover:bg-secondary hover:shadow-lg transition-all duration-300 active:scale-95"
              >
                <MessageCircle size={20} />
                WhatsApp
              </button> */}
            </div>
          )}
          {allTextShown && whatsAppStatusMessage && (
            <p className="text-sm text-center md:text-right text-muted-foreground">
              {whatsAppStatusMessage}
            </p>
          )}
        </div>
      </div>

      {/*    <div className="mt-7 flex flex-wrap items-center justify-center gap-3 border-t pt-5">
        <span className="border rounded-md px-4 py-2 font-medium">
          Vuelve mañana para otra efeméride
        </span>
      </div> */}

      {/* Stats Section */}
      {/* <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="bg-card rounded-xl p-6 text-center border border-border hover:border-primary hover:shadow-md transition-all">
          <p className="text-primary font-bold text-2xl">
            {ephemeris.day || "--"}
          </p>
          <p className="text-foreground text-sm mt-2 font-medium">Día</p>
        </div>
        <div className="bg-card rounded-xl p-6 text-center border border-border hover:border-primary hover:shadow-md transition-all">
          <p className="text-primary font-bold text-2xl">
            {ephemeris.month || "--"}
          </p>
          <p className="text-foreground text-sm mt-2 font-medium">Mes</p>
        </div>
        <div className="bg-card rounded-xl p-6 text-center border border-border hover:border-primary hover:shadow-md transition-all">
          <p className="text-primary font-bold text-2xl">{year}</p>
          <p className="text-foreground text-sm mt-2 font-medium">Año</p>
        </div>
      </div> */}
    </div>
  );
}
