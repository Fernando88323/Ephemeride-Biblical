const TIMEZONE = 'America/Mexico_City'
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'
const DEFAULT_MODEL = 'llama-3.1-8b-instant'
const TABLE_NAME = 'ephemerides'

type EphemerisRecord = {
  display_date: string
  day: number
  month: number
  year: number
  event: string
  historical_day: number | null
  historical_month: number | null
  historical_year: number | null
  bible_reference: string | null
  verse_text: string | null
  application: string | null
}

function getEnv(name: string): string {
  const value = Deno.env.get(name)
  if (!value) {
    throw new Error(`Missing required env var: ${name}`)
  }

  return value
}

function getMexicoCityDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const valueByType: Record<string, string> = {}
  for (const part of parts) {
    if (part.type !== 'literal') {
      valueByType[part.type] = part.value
    }
  }

  return {
    year: Number(valueByType.year),
    month: Number(valueByType.month),
    day: Number(valueByType.day),
    dateKey: `${valueByType.year}-${valueByType.month}-${valueByType.day}`,
  }
}

function getDisplayDate(input?: string) {
  if (input && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
    return input
  }

  if (input) {
    const normalized = new Date(input)
    if (!Number.isNaN(normalized.getTime())) {
      return getMexicoCityDateParts(normalized).dateKey
    }
  }

  return getMexicoCityDateParts().dateKey
}

function buildPrompt(displayDate: string) {
  return [
    `Genera un devocional bíblico diario en español para la fecha ${displayDate}.`,
    'Devuelve SOLO JSON válido y sin markdown con estas claves exactas:',
    '{"event":"...","bible_reference":"...","verse_text":"...","application":"...","historical_day":null,"historical_month":null,"historical_year":null}',
    'Estructura del devocional:',
    '- event: un solo párrafo (2-4 frases) que presente un hecho, personaje o enseñanza bíblica relacionada con el día. Tono reverente, claro y cercano.',
    '- bible_reference: la cita bíblica en formato "Libro Capítulo:Versículo" (por ejemplo, "Proverbios 16:18"). Debe ser un versículo real y coherente con el evento.',
    '- verse_text: el texto exacto del versículo citado en español.',
    '- application: un solo párrafo (2-4 frases) que invite al lector a aplicar esa enseñanza en su vida diaria, trabajo, familia o decisiones personales.',
    '- historical_day, historical_month, historical_year: números enteros si el evento ocurrió en una fecha histórica concreta; de lo contrario, null.',
    '- No agregues campos extra ni comentarios.',
  ].join(' ')
}

function parseJsonContent(content: string) {
  const trimmed = content.trim()
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Groq response did not contain JSON.')
  }

  return JSON.parse(trimmed.slice(start, end + 1)) as Record<string, unknown>
}

function validateRecord(input: unknown, displayDate: string): EphemerisRecord {
  if (!input || typeof input !== 'object') {
    throw new Error('Groq did not return a JSON object.')
  }

  const record = input as Record<string, unknown>

  if (typeof record.event !== 'string' || !record.event.trim()) {
    throw new Error('Groq response is missing "event".')
  }

  if (typeof record.bible_reference !== 'string' || !record.bible_reference.trim()) {
    throw new Error('Groq response is missing "bible_reference".')
  }

  if (typeof record.verse_text !== 'string' || !record.verse_text.trim()) {
    throw new Error('Groq response is missing "verse_text".')
  }

  if (typeof record.application !== 'string' || !record.application.trim()) {
    throw new Error('Groq response is missing "application".')
  }

  const parts = getMexicoCityDateParts(new Date(`${displayDate}T12:00:00`))

  const toNullableNumber = (value: unknown) =>
    value === null || typeof value === 'undefined' ? null : Number(value)

  return {
    display_date: displayDate,
    day: parts.day,
    month: parts.month,
    year: parts.year,
    event: record.event.trim(),
    historical_day: toNullableNumber(record.historical_day),
    historical_month: toNullableNumber(record.historical_month),
    historical_year: toNullableNumber(record.historical_year),
    bible_reference: record.bible_reference.trim(),
    verse_text: record.verse_text.trim(),
    application: record.application.trim(),
  }
}

async function generateWithGroq(displayDate: string): Promise<EphemerisRecord> {
  const apiKey = getEnv('GROQ_API_KEY')
  const model = Deno.env.get('GROQ_MODEL') || DEFAULT_MODEL

  const response = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content:
            'Eres un redactor de devocionales bíblicos diarios. Responde únicamente en JSON estricto. Incluye siempre una cita bíblica real con su versículo completo y una aplicación práctica para la vida diaria. El tono debe ser reverente, cercano y útil.',
        },
        {
          role: 'user',
          content: buildPrompt(displayDate),
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Groq error (${response.status}): ${errorText}`)
  }

  const payload = await response.json()
  const content = payload?.choices?.[0]?.message?.content

  if (typeof content !== 'string') {
    throw new Error('Groq response did not include message content.')
  }

  return validateRecord(parseJsonContent(content), displayDate)
}

function generateFallback(displayDate: string): EphemerisRecord {
  const parts = getMexicoCityDateParts(new Date(`${displayDate}T12:00:00`))

  return {
    display_date: displayDate,
    day: parts.day,
    month: parts.month,
    year: parts.year,
    event: `Devocional de respaldo para ${parts.day}/${parts.month}/${parts.year}: un día de reflexión bíblica y esperanza. (fallback tras error en Groq)`,
    historical_day: null,
    historical_month: null,
    historical_year: null,
    bible_reference: 'Salmos 119:105',
    verse_text: 'Lámpara es a mis pies tu palabra, y lumbrera a mi camino.',
    application: 'Hoy podemos pedirle a Dios que su Palabra ilumine nuestras decisiones y nos guíe por el camino correcto.',
  }
}

async function upsertEphemeris(record: EphemerisRecord) {
  const supabaseUrl = getEnv('SUPABASE_URL')
  const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY')

  const response = await fetch(`${supabaseUrl}/rest/v1/${TABLE_NAME}?on_conflict=display_date`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(record),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Supabase insert failed (${response.status}): ${errorText}`)
  }

  return await response.json()
}

Deno.serve(async (request) => {
  try {
    const body = request.method === 'POST' ? await request.json().catch(() => ({})) : {}
    const displayDate = getDisplayDate(body?.display_date)
    const parts = getMexicoCityDateParts(new Date(`${displayDate}T12:00:00`))

    console.log('[generate-next-ephemeris] target date:', displayDate)

    let record: EphemerisRecord
    let source = 'groq'

    try {
      record = await generateWithGroq(displayDate)
    } catch (error) {
      source = 'fallback'
      console.error('[generate-next-ephemeris] groq failed:', error)
      record = generateFallback(displayDate)
    }

    record = {
      ...record,
      day: parts.day,
      month: parts.month,
      year: parts.year,
      display_date: displayDate,
    }

    const inserted = await upsertEphemeris(record)

    return new Response(
      JSON.stringify({
        ok: true,
        source,
        display_date: displayDate,
        record,
        inserted,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('[generate-next-ephemeris] failed:', error)

    return new Response(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
})
