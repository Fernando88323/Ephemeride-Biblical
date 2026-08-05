import { getMexicoCityDateKey } from './date-utils'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const TABLE_NAME = 'ephemerides'

// Datos de demostración en caso de que Supabase no esté disponible
const DEMO_EPHEMERIS = {
  id: 'demo-001',
  display_date: '2026-08-05',
  day: 5,
  month: 8,
  year: 2026,
  event: 'El 4 de agosto de 1997, Apple anunció oficialmente la adquisición de NeXT, consolidando el retorno de Steve Jobs y sentando las bases tecnológicas de macOS (derivado de NEXTSTEP) que influirían en el desarrollo de software para la plataforma Apple.',
  historical_day: 4,
  historical_month: 8,
  historical_year: 1997,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}

function assertSupabaseConfig() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return false
  }
  return true
}

async function fetchEphemerisByDate(displayDate) {
  // Si Supabase no está configurado, retornar datos de demostración
  if (!assertSupabaseConfig()) {
    console.log('[Demo Mode] Using demo ephemeris data')
    // Si es hoy (o cercano), retornar los datos demo; si no, retornar null
    const today = getMexicoCityDateKey()
    if (displayDate === today || displayDate === '2026-08-05') {
      return DEMO_EPHEMERIS
    }
    return null
  }

  try {
    const url = new URL(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}`)
    url.searchParams.set('select', 'id,display_date,day,month,year,event,historical_day,historical_month,historical_year,created_at,updated_at')
    url.searchParams.set('display_date', `eq.${displayDate}`)
    url.searchParams.set('limit', '1')

    const response = await fetch(url.toString(), {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      const message = await response.text()
      throw new Error(`Supabase query failed (${response.status}): ${message}`)
    }

    const rows = await response.json()
    return rows[0] ?? null
  } catch (error) {
    console.error('Error fetching from Supabase:', error)
    // Fallback a datos de demostración si hay error
    const today = getMexicoCityDateKey()
    if (displayDate === today || displayDate === '2026-08-05') {
      return DEMO_EPHEMERIS
    }
    return null
  }
}

export async function getEphemerisForDate(dateKey) {
  return fetchEphemerisByDate(dateKey)
}

export async function getTodayEphemeris() {
  return fetchEphemerisByDate(getMexicoCityDateKey())
}
