interface RecoveryEmailProps {
  estimateId: string
  firstName: string
  submissionDate: string
}

// oklch(0.55 0.13 186) ≈ #0d9e8f — used as --theme1 accent
const THEME1 = '#0d9e8f'
const DARK   = '#0f2b2b'   // deep teal-black for header/footer
const LIGHT_BG = '#f0faf9' // very faint teal tint for page bg
const CARD_BG  = '#e6f5f4'
const TEXT_MAIN   = '#1a3a39'
const TEXT_MUTED  = '#4a7370'
const TEXT_SUBTLE = '#6b9694'

export function RecoveryEmail({ estimateId, firstName, submissionDate }: RecoveryEmailProps) {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

  return (
    <html>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: LIGHT_BG,
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: '16px',
        }}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 0 40px 0' }}>

          {/* ── Header ── */}
          <div
            style={{
              backgroundColor: DARK,
              padding: '28px 36px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            {/* Mold spore icon — inline SVG so no external image needed */}
            <svg
              width="40" height="40" viewBox="0 0 40 40"
              fill="none" xmlns="http://www.w3.org/2000/svg"
              style={{ flexShrink: 0 }}
            >
              <circle cx="20" cy="20" r="19" stroke={THEME1} strokeWidth="2" />
              <circle cx="20" cy="20" r="7" fill={THEME1} fillOpacity="0.9" />
              <circle cx="20" cy="8"  r="3.5" fill={THEME1} fillOpacity="0.55" />
              <circle cx="20" cy="32" r="3.5" fill={THEME1} fillOpacity="0.55" />
              <circle cx="8"  cy="20" r="3.5" fill={THEME1} fillOpacity="0.55" />
              <circle cx="32" cy="20" r="3.5" fill={THEME1} fillOpacity="0.55" />
              <circle cx="11.5" cy="11.5" r="2.5" fill={THEME1} fillOpacity="0.35" />
              <circle cx="28.5" cy="11.5" r="2.5" fill={THEME1} fillOpacity="0.35" />
              <circle cx="11.5" cy="28.5" r="2.5" fill={THEME1} fillOpacity="0.35" />
              <circle cx="28.5" cy="28.5" r="2.5" fill={THEME1} fillOpacity="0.35" />
            </svg>

            <span
              style={{
                color: '#ffffff',
                fontSize: '28px',
                fontWeight: 700,
                letterSpacing: '-0.5px',
                fontFamily: 'Georgia, serif',
              }}
            >
              Mold
              <span style={{ color: THEME1 }}>Costs</span>
            </span>
          </div>

          {/* ── Accent bar ── */}
          <div style={{ backgroundColor: THEME1, height: '4px' }} />

          {/* ── Body ── */}
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '40px 36px',
              borderLeft: '1px solid #d0ecea',
              borderRight: '1px solid #d0ecea',
            }}
          >
            <p
              style={{
                margin: '0 0 8px 0',
                color: TEXT_MAIN,
                fontSize: '24px',
                fontWeight: 700,
                fontFamily: 'Georgia, serif',
                lineHeight: 1.25,
              }}
            >
              Hi {cap(firstName)},
            </p>

            <p style={{ margin: '0 0 20px 0', color: TEXT_MUTED, lineHeight: 1.7, fontFamily: 'system-ui, sans-serif' }}>
              We received a request to recover your MoldCosts Estimate ID.
              Your most recent estimate details are shown below.
            </p>

            {/* ── Estimate ID card ── */}
            <div
              style={{
                backgroundColor: CARD_BG,
                borderLeft: `5px solid ${THEME1}`,
                borderRadius: '6px',
                padding: '22px 26px',
                margin: '28px 0',
              }}
            >
              <p
                style={{
                  margin: '0 0 14px 0',
                  color: TEXT_SUBTLE,
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                Your Most Recent Estimate
              </p>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        padding: '6px 0',
                        color: TEXT_SUBTLE,
                        fontSize: '13px',
                        width: '140px',
                        fontFamily: 'system-ui, sans-serif',
                      }}
                    >
                      Estimate ID
                    </td>
                    <td
                      style={{
                        padding: '6px 0',
                        color: THEME1,
                        fontWeight: 700,
                        fontSize: '20px',
                        fontFamily: 'monospace',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {estimateId}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: '6px 0',
                        color: TEXT_SUBTLE,
                        fontSize: '13px',
                        fontFamily: 'system-ui, sans-serif',
                      }}
                    >
                      Submitted
                    </td>
                    <td
                      style={{
                        padding: '6px 0',
                        color: TEXT_MAIN,
                        fontWeight: 600,
                        fontSize: '14px',
                        fontFamily: 'system-ui, sans-serif',
                      }}
                    >
                      {submissionDate}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p style={{ margin: '0 0 28px 0', color: TEXT_MUTED, lineHeight: 1.7, fontFamily: 'system-ui, sans-serif' }}>
              Use your Estimate ID to sign in and review your full cost breakdown,
              remediation recommendations, and contractor quotes.
            </p>

            {/* ── CTA ── */}
            <div style={{ margin: '0 0 32px 0' }}>
              <a
                href="https://www.moldcosts.com/login"
                style={{
                  display: 'inline-block',
                  textDecoration: 'none',
                  color: '#ffffff',
                  backgroundColor: THEME1,
                  padding: '13px 30px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '15px',
                  fontFamily: 'system-ui, sans-serif',
                  letterSpacing: '0.01em',
                }}
              >
                View Your Estimate →
              </a>
            </div>

            <p style={{ margin: '0 0 20px 0', color: TEXT_MUTED, lineHeight: 1.7, fontFamily: 'system-ui, sans-serif', fontSize: '14px' }}>
              If you didn&apos;t request this, you can safely ignore this email. Need help? Send an email to our support team at 
              <a href="mailto:support@iaq.network" style={{ textDecoration: 'none', color: THEME1, fontWeight: 600 }} >  support@iaq.network  </a>
            </p>

            <p style={{ margin: 0, color: TEXT_MUTED, lineHeight: 1.7, fontFamily: 'system-ui, sans-serif', fontSize: '14px' }}>
              Best regards,<br />
              <span style={{ color: TEXT_MAIN, fontWeight: 700 }}>The MoldCosts Team</span>
            </p>
          </div>

          {/* ── Footer ── */}
          <div
            style={{
              backgroundColor: DARK,
              padding: '22px 36px',
            }}
          >
            <p
              style={{
                margin: '0 0 4px 0',
                color: TEXT_SUBTLE,
                fontSize: '11px',
                textAlign: 'center',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              This estimate is for informational purposes only and does not constitute professional advice.
            </p>
            <p
              style={{
                margin: 0,
                color: '#3d6664',
                fontSize: '11px',
                textAlign: 'center',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              © 2026 IAQ.network |{' '}
              <a href="https://www.moldcosts.com" style={{ color: THEME1, textDecoration: 'none' }}>
                moldcosts.com
              </a>
            </p>
          </div>

        </div>
      </body>
    </html>
  )
}