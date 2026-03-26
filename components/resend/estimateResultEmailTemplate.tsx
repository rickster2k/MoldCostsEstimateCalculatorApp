import { CalculationResult } from '@/lib/types'
import { Capitalize } from '@/lib/utils/formattingUtils'

interface EstimateResultsEmailProps {
  firstName: string
  estimateId: string
  estimateResults: CalculationResult
  email: string
}

function fmt(n: number) {
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

// ── Palette 
const THEME1     = '#0d9e8f'
const DARK       = '#0f2b2b'
const LIGHT_BG   = '#f0faf9'
const CARD_BG    = '#e6f5f4'
const TEXT_MAIN  = '#1a3a39'
const TEXT_MUTED = '#4a7370'
const TEXT_SUBTLE= '#6b9694'

export function EstimateResultsEmail({ firstName, estimateId, estimateResults, email }: EstimateResultsEmailProps) {
  const { lowEstimate, highEstimate, averageEstimate, breakdown } = estimateResults

  const BREAKDOWN_ROWS = [
    { label: 'Base remediation cost', value: breakdown.baseCost            },
    { label: 'Severity adjustment',   value: breakdown.severityAdjustment  },
    { label: 'Access complexity',     value: breakdown.complexityAdjustment },
    { label: 'Additional services',   value: breakdown.additionalServices   },
    ...(breakdown.foggingCost > 0
      ? [{ label: 'Whole-home fogging', value: breakdown.foggingCost }]
      : []),
  ]

  return (
    <html>
      <body style={{ margin: 0, padding: 0, backgroundColor: LIGHT_BG, fontFamily: 'system-ui, sans-serif, Arial', fontSize: '16px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 0 32px 0' }}>

          {/* Header */}
          <div style={{ backgroundColor: DARK, padding: '24px 32px' }}>
            <a href={`${process.env.NEXT_PUBLIC_APP_URL}`} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#ffffff', fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                Mold<span style={{ color: THEME1 }}>Costs</span>
              </span>
            </a>
          </div>

          {/* Accent bar */}
          <div style={{ backgroundColor: THEME1, height: '5px' }} />

          {/* Body */}
          <div style={{ backgroundColor: '#ffffff', padding: '36px 32px', borderLeft: '1px solid #d0ecea', borderRight: '1px solid #d0ecea' }}>

            <p style={{ margin: '0 0 20px 0', color: TEXT_MAIN, fontSize: '22px', fontWeight: 700 }}>
              Hi {Capitalize(firstName)}, your mold remediation estimate is ready.
            </p>

            <p style={{ margin: '0 0 24px 0', color: TEXT_MUTED, lineHeight: 1.6 }}>
              Thank you for completing the MoldCosts estimator. Based on the information you provided,
              here is your personalized cost estimate along with a full breakdown.
            </p>

            {/* Estimate range hero card */}
            <div style={{
              background: `linear-gradient(135deg, ${DARK} 0%, #0d3b3a 100%)`,
              borderRadius: '8px',
              padding: '28px 32px',
              margin: '0 0 24px 0',
              textAlign: 'center',
            }}>
              <p style={{ margin: '0 0 8px 0', color: TEXT_SUBTLE, fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Estimated Remediation Cost
              </p>
              <p style={{ margin: '0 0 4px 0', color: '#ffffff', fontSize: '36px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                ${fmt(lowEstimate)} – ${fmt(highEstimate)}
              </p>
              <p style={{ margin: '0 0 16px 0', color: TEXT_SUBTLE, fontSize: '14px' }}>
                Average estimate: <strong style={{ color: THEME1 }}>${fmt(averageEstimate)}</strong>
              </p>
              <div style={{
                display: 'inline-block',
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: '6px',
                padding: '6px 16px',
                fontFamily: 'monospace',
                fontSize: '12px',
                color: THEME1,
                letterSpacing: '0.1em',
              }}>
                Estimate ID: {estimateId}
              </div>
            </div>

            {/* Cost breakdown table */}
            <div style={{ backgroundColor: CARD_BG, borderLeft: `4px solid ${THEME1}`, borderRadius: '4px', padding: '20px 24px', margin: '0 0 28px 0' }}>
              <p style={{ margin: '0 0 14px 0', color: TEXT_SUBTLE, fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Cost Breakdown
              </p>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {BREAKDOWN_ROWS.map((row, i) => (
                    <tr key={row.label} style={{ borderTop: i === 0 ? 'none' : '1px solid #d0ecea' }}>
                      <td style={{ padding: '8px 0', color: TEXT_MUTED, fontSize: '14px' }}>{row.label}</td>
                      <td style={{ padding: '8px 0', color: TEXT_MAIN, fontWeight: 700, fontSize: '14px', textAlign: 'right' }}>
                        ${fmt(row.value)}
                      </td>
                    </tr>
                  ))}
                  {/* Total row */}
                  <tr style={{ borderTop: `2px solid ${TEXT_MAIN}` }}>
                    <td style={{ padding: '10px 0 0 0', color: TEXT_MAIN, fontSize: '15px', fontWeight: 700 }}>Average Total</td>
                    <td style={{ padding: '10px 0 0 0', color: THEME1, fontSize: '15px', fontWeight: 800, textAlign: 'right' }}>
                      ${fmt(averageEstimate)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p style={{ margin: '0 0 8px 0', color: TEXT_MUTED, lineHeight: 1.6 }}>
              Your estimate report includes:
            </p>
            <ul style={{ margin: '0 0 28px 0', paddingLeft: '20px', color: TEXT_MUTED, lineHeight: 2 }}>
              <li>Your personalized cost range and full breakdown</li>
              <li>Contractor matching options for your area</li>
              <li>A DIY Remediation Blueprint (if requested)</li>
              <li>Expert consultation access (if requested)</li>
            </ul>

            {/* CTA Button */}
            <div style={{ margin: '0 0 28px 0' }}>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/user/login?email=${encodeURIComponent(email)}&estimateId=${encodeURIComponent(estimateId)}`}
                style={{
                  display: 'inline-block',
                  textDecoration: 'none',
                  color: '#ffffff',
                  backgroundColor: THEME1,
                  padding: '14px 32px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '15px',
                }}
              >
                View My Full Estimate →
              </a>
            </div>

            <div style={{ margin: '0 0 28px 0' }}>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/user/login?email=${encodeURIComponent(email)}&estimateId=${encodeURIComponent(estimateId)}&page=/diy`}
                style={{
                  display: 'inline-block',
                  textDecoration: 'none',
                  color: '#ffffff',
                  backgroundColor: '#ea580c',
                  padding: '14px 32px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '15px',
                }}
              >
                Learn More About DIY Remediation →
              </a>
            </div>
            <div style={{ margin: '0 0 28px 0' }}>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/user/login?email=${encodeURIComponent(email)}&estimateId=${encodeURIComponent(estimateId)}&page=/remote`}
                style={{
                  display: 'inline-block',
                  textDecoration: 'none',
                  color: '#ffffff',
                  backgroundColor: '#2563eb',
                  padding: '14px 32px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '15px',
                }}
              >
                Learn More About Remote Remediation Consultants →
              </a>
            </div>



            <p style={{ margin: '0 0 16px 0', color: TEXT_MUTED, lineHeight: 1.6 }}>
              Note: This estimate is based on the information you provided and is intended as a
              planning reference. Final costs may vary based on contractor assessment and local market conditions.
            </p>

            <p style={{ margin: 0, color: TEXT_MUTED, lineHeight: 1.6 }}>
              Best regards,<br />
              <span style={{ color: TEXT_MAIN, fontWeight: 700 }}>The MoldCosts Team</span>
            </p>
          </div>

          {/* Footer */}
          <div style={{ backgroundColor: DARK, padding: '20px 32px' }}>
            <p style={{ margin: '0 0 4px 0', color: TEXT_SUBTLE, fontSize: '11px', textAlign: 'center' }}>
              This estimate is for informational purposes only and does not constitute a professional quote.
            </p>
            <p style={{ margin: 0, color: '#3d6664', fontSize: '11px', textAlign: 'center' }}>
              © 2026 IAQ Network |{' '}
              <a href={`${process.env.NEXT_PUBLIC_APP_URL}`} style={{ color: THEME1, textDecoration: 'none' }}>
                moldcosts.com
              </a>
            </p>
          </div>

        </div>
      </body>
    </html>
  )
}