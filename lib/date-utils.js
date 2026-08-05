export function getMexicoCityDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const valueByType = parts.reduce((acc, part) => {
    if (part.type !== 'literal') {
      acc[part.type] = part.value
    }

    return acc
  }, {})

  return {
    year: valueByType.year,
    month: valueByType.month,
    day: valueByType.day,
    dateKey: `${valueByType.year}-${valueByType.month}-${valueByType.day}`,
  }
}

export function getMexicoCityDateKey(date = new Date()) {
  return getMexicoCityDateParts(date).dateKey
}
