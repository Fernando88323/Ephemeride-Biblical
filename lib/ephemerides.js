import { getMexicoCityDateKey } from './date-utils'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const TABLE_NAME = 'ephemerides'

function assertSupabaseConfig() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }
}

async function fetchEphemerisByDate(displayDate) {
  assertSupabaseConfig()

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
}

export async function getEphemerisForDate(dateKey) {
  return fetchEphemerisByDate(dateKey)
}

export async function getTodayEphemeris() {
  return fetchEphemerisByDate(getMexicoCityDateKey())
}
