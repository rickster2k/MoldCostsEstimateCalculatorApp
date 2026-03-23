import { Estimate } from '@/lib/types'

// ── Shared utility ────────────────────────────────────────────────────────────

function escapeCsvValue(value: string): string {
  if (!value) return ''
  const needsQuotes = value.includes(',') || value.includes('"') || value.includes('\n')
  const escaped = value.replace(/"/g, '""')
  return needsQuotes ? `"${escaped}"` : escaped
}

export function downloadCsv(csvString: string, filename: string) {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

// ── Estimates CSV ─────────────────────────────────────────────────────────────

export function estimatesToCsvString(estimates: Estimate[]): string {
  const headers = [
    'Estimate ID',
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Preferred Contact',
    'Zip Code',
    'Country',
    'Date',
    'Time',
    'Estimate Amount',
    'Needs Testing',
    'Request for Real Estimates',
    'Request for DIY Blueprint',
    'Request for Consultation',
    'Property Type',
    'Property Size',
    'Severity',
    'Affected Area',
    'Accessibility',
  ]

  const rows = estimates.map(est => {
    const date = new Date(est.timestamp)
    const dateOnly = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
    const timeOnly = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

    return [
      escapeCsvValue(est.estimateId),
      escapeCsvValue(est.contact.firstName),
      escapeCsvValue(est.contact.lastName),
      escapeCsvValue(est.contact.email),
      escapeCsvValue(est.contact.phone ?? ''),
      escapeCsvValue(est.contact.preferredContact ?? ''),
      escapeCsvValue(est.contact.zipCode ),
      escapeCsvValue(est.contact.country),
      dateOnly,
      timeOnly,
      est.estimateAmount,
      est.testingStatus,
      est.requestRealEstimates ? 'Yes' : 'No',
      est.requestDiyBlueprint ? 'Yes' : 'No',
      est.requestConsultant ? 'Yes' : 'No',
      escapeCsvValue(est.data.propertyType),
      escapeCsvValue(est.data.propertySize),
      escapeCsvValue(est.data.severity),
      escapeCsvValue(est.data.areaSizeCategory)+ ' sq ft',
      escapeCsvValue(est.data.accessibility),
    ]
  })

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
}