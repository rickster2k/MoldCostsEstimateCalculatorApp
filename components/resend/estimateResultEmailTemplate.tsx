import { CalculationResult } from '@/lib/types'
import { Capitalize } from '@/lib/utils'

interface EstimateResultsEmailProps {
  firstName: string
  estimateId: string
  estimateResults: CalculationResult
  email: string
}

function fmt(n: number) {
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export function EstimateResultsEmail({  firstName,  estimateId,  estimateResults,  email}: EstimateResultsEmailProps) {
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
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f1f5f9', fontFamily: 'system-ui, sans-serif, Arial', fontSize: '16px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 0 32px 0' }}>

          {/* Header */}
          <div style={{ backgroundColor: '#0f172a', padding: '24px 32px' }}>
            <a href={`${process.env.NEXT_PUBLIC_APP_URL}`} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#ffffff', fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                Mold<span style={{ color: '#10b981' }}>Costs</span>
              </span>
            </a>
          </div>

          {/* Green accent bar */}
          <div style={{ backgroundColor: '#10b981', height: '5px' }} />

          {/* Body */}
          <div style={{ backgroundColor: '#ffffff', padding: '36px 32px', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>

            <p style={{ margin: '0 0 20px 0', color: '#0f172a', fontSize: '22px', fontWeight: 700 }}>
              Hi {Capitalize(firstName)}, your mold remediation estimate is ready.
            </p>

            <p style={{ margin: '0 0 24px 0', color: '#475569', lineHeight: 1.6 }}>
              Thank you for completing the MoldCosts estimator. Based on the information you provided,
              here is your personalized cost estimate along with a full breakdown.
            </p>

            {/* Estimate range hero card */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
              borderRadius: '8px',
              padding: '28px 32px',
              margin: '0 0 24px 0',
              textAlign: 'center',
            }}>
              <p style={{ margin: '0 0 8px 0', color: '#94a3b8', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Estimated Remediation Cost
              </p>
              <p style={{ margin: '0 0 4px 0', color: '#ffffff', fontSize: '36px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                ${fmt(lowEstimate)} – ${fmt(highEstimate)}
              </p>
              <p style={{ margin: '0 0 16px 0', color: '#94a3b8', fontSize: '14px' }}>
                Average estimate: <strong style={{ color: '#10b981' }}>${fmt(averageEstimate)}</strong>
              </p>
              <div style={{
                display: 'inline-block',
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: '6px',
                padding: '6px 16px',
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#10b981',
                letterSpacing: '0.1em',
              }}>
                Estimate ID: {estimateId}
              </div>
            </div>

            {/* Cost breakdown table */}
            <div style={{ backgroundColor: '#f8fafc', borderLeft: '4px solid #10b981', borderRadius: '4px', padding: '20px 24px', margin: '0 0 28px 0' }}>
              <p style={{ margin: '0 0 14px 0', color: '#64748b', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Cost Breakdown
              </p>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {BREAKDOWN_ROWS.map((row, i) => (
                    <tr key={row.label} style={{ borderTop: i === 0 ? 'none' : '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 0', color: '#64748b', fontSize: '14px' }}>{row.label}</td>
                      <td style={{ padding: '8px 0', color: '#0f172a', fontWeight: 700, fontSize: '14px', textAlign: 'right' }}>
                        ${fmt(row.value)}
                      </td>
                    </tr>
                  ))}
                  {/* Total row */}
                  <tr style={{ borderTop: '2px solid #0f172a' }}>
                    <td style={{ padding: '10px 0 0 0', color: '#0f172a', fontSize: '15px', fontWeight: 700 }}>Average Total</td>
                    <td style={{ padding: '10px 0 0 0', color: '#10b981', fontSize: '15px', fontWeight: 800, textAlign: 'right' }}>
                      ${fmt(averageEstimate)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p style={{ margin: '0 0 8px 0', color: '#475569', lineHeight: 1.6 }}>
              Your estimate report includes:
            </p>
            <ul style={{ margin: '0 0 28px 0', paddingLeft: '20px', color: '#475569', lineHeight: 2 }}>
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
                  backgroundColor: '#10b981',
                  padding: '14px 32px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '15px',
                }}
              >
                View My Full Estimate →
              </a>
            </div>

            <p style={{ margin: '0 0 16px 0', color: '#475569', lineHeight: 1.6 }}>
              Note: This estimate is based on the information you provided and is intended as a
              planning reference. Final costs may vary based on contractor assessment and local market conditions.
            </p>

            <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>
              Best regards,<br />
              <span style={{ color: '#0f172a', fontWeight: 700 }}>The MoldCosts Team</span>
            </p>
          </div>

          {/* Footer */}
          <div style={{ backgroundColor: '#0f172a', padding: '20px 32px' }}>
            <p style={{ margin: '0 0 4px 0', color: '#94a3b8', fontSize: '11px', textAlign: 'center' }}>
              This estimate is for informational purposes only and does not constitute a professional quote.
            </p>
            <p style={{ margin: 0, color: '#64748b', fontSize: '11px', textAlign: 'center' }}>
              © 2026 IAQ Network |{' '}
              <a href={`${process.env.NEXT_PUBLIC_APP_URL}`} style={{ color: '#10b981', textDecoration: 'none' }}>
                moldcosts.com
              </a>
            </p>
          </div>

        </div>
      </body>
    </html>
  )
}