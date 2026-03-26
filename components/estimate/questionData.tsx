'use client'

import { Home, Building2, Droplets, Waves, RefreshCcw, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AffectedLocation, EstimateData, MoldCause, PropertyType } from '@/lib/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QuestionOption {
  id: string
  label: string
  desc?: string
  icon?: React.ElementType
}

export interface QuestionConfig {
  step: number
  title: string
  subtitle: string
  field: keyof EstimateData
  /** Standard list of options — used by default option renderer */
  options?: QuestionOption[]
  /** Custom renderer — overrides options list when present */
  render?: (data: EstimateData, setData: (d: EstimateData) => void) => React.ReactNode
  /** Whether this step requires an explicit Next button (vs auto-advance on pick) */
  requiresNext?: boolean
}

// ─── Shared option styles ─────────────────────────────────────────────────────

export function optionClass(selected: boolean) {
  return cn(
    'p-5 rounded-2xl border-2 text-left transition-all hover:border-primary/50',
    selected ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white',
  )
}

// ─── Question definitions ─────────────────────────────────────────────────────

export const QUESTIONS: QuestionConfig[] = [

  // ── Step 1: Property Type ──────────────────────────────────────────────────
  {
    step: 1,
    title: 'What is the property type?',
    subtitle: 'This helps us understand the typical layout and construction.',
    field: 'propertyType',
    render: (data, setData) => {
      const TYPES = [
        { id: 'single-family', label: 'Single-family', icon: Home      },
        { id: 'townhouse',     label: 'Townhouse',     icon: Home      },
        { id: 'condo',         label: 'Condo',         icon: Building2 },
        { id: 'apartment',     label: 'Apartment',     icon: Building2 },
        { id: 'commercial',    label: 'Commercial',    icon: Building2 },
      ]
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {TYPES.map(t => (
            <button
              key={t.id} type="button"
              onClick={() => setData({ ...data, propertyType: t.id as PropertyType })}
              className={cn(
                'p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 text-center hover:border-primary/50',
                data.propertyType === t.id ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white',
              )}
            >
              <t.icon className={cn('w-8 h-8', data.propertyType === t.id ? 'text-primary' : 'text-slate-400')} />
              <span className="text-sm font-bold text-slate-700">{t.label}</span>
            </button>
          ))}
        </div>
      )
    },
  },

  // ── Step 2: Property Size ──────────────────────────────────────────────────
  {
    step: 2,
    title: 'What is the approximate property size?',
    subtitle: 'Total square footage of the building.',
    field: 'propertySize',
    options: [
      { id: 'under-1000', label: 'Under 1,000 sq ft' },
      { id: '1000-2000',  label: '1,000–2,000 sq ft' },
      { id: '2000-3000',  label: '2,000–3,000 sq ft' },
      { id: '3000-plus',  label: '3,000+ sq ft'       },
    ],
  },

  // ── Step 3: Zip Code ───────────────────────────────────────────────────────
  {
    step: 3,
    title: 'What is your Zip Code?',
    subtitle: 'This allows for regional pricing adjustments and local contractor matching.',
    field: 'zipCode',
    requiresNext: true,
    render: (data, setData) => (
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Enter 5-digit Zip Code"
          maxLength={5}
          value={data.zipCode}
          onChange={e => setData({ ...data, zipCode: e.target.value.replace(/\D/g, '') })}
          className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary focus:outline-none text-lg font-semibold transition-all"
        />
        {data.zipCode.length > 0 && data.zipCode.length < 5 && (
          <p className="text-xs text-amber-600 font-medium">Please enter a valid 5-digit zip code.</p>
        )}
      </div>
    ),
  },

  // ── Step 4: Affected Locations (multi-select) ──────────────────────────────
  {
    step: 4,
    title: 'Where is the growth located?',
    subtitle: 'Select all areas that apply.',
    field: 'affectedLocations',
    requiresNext: true,
    render: (data, setData) => {
      const LOCATIONS: { id: AffectedLocation; label: string }[] = [
        { id: 'kitchen',     label: 'Kitchen'           },
        { id: 'living-room', label: 'Living Room'        },
        { id: 'family-room', label: 'Family Room'        },
        { id: 'bedroom',     label: 'Bedroom'            },
        { id: 'closet',      label: 'Walk-in Closet'     },
        { id: 'bathroom',    label: 'Bathroom'           },
        { id: 'laundry',     label: 'Laundry Room'       },
        { id: 'basement',    label: 'Basement'           },
        { id: 'crawl-space', label: 'Crawl Space'        },
        { id: 'attic',       label: 'Attic'              },
        { id: 'hvac',        label: 'HVAC System'        },
        { id: 'foyer',       label: 'Foyer'              },
        { id: 'porch',       label: 'Enclosed Porch'     },
        { id: 'garage',      label: 'Garage'             },
        { id: 'other',       label: 'Additional Room(s)' },
      ]
      const toggle = (id: AffectedLocation) => {
        const cur = data.affectedLocations
        setData({
          ...data,
          affectedLocations: cur.includes(id) ? cur.filter(l => l !== id) : [...cur, id],
        })
      }
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[40vh] overflow-y-auto p-1">
          {LOCATIONS.map(loc => (
            <button
              key={loc.id} type="button"
              onClick={() => toggle(loc.id)}
              className={cn(
                'p-3 rounded-xl border-2 text-xs font-bold transition-all hover:border-primary/50',
                data.affectedLocations.includes(loc.id)
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-slate-100 bg-white text-slate-600',
              )}
            >
              {loc.label}
            </button>
          ))}
        </div>
      )
    },
  },

  // ── Step 5: Area Size ──────────────────────────────────────────────────────
  {
    step: 5,
    title: 'How big is the affected area?',
    subtitle: 'Estimate the total square footage of visible mold growth.',
    field: 'areaSizeCategory',
    options: [
      { id: 'less-10',  label: 'Less than 10 sq ft', desc: 'Small isolated spot'              },
      { id: '10-25',    label: '10–25 sq ft',         desc: 'Small closet or wall section'     },
      { id: '25-100',   label: '25–100 sq ft',        desc: 'Standard bathroom or small room'  },
      { id: '100-300',  label: '100–300 sq ft',       desc: 'Large room or multiple areas'     },
      { id: '300-plus', label: '300+ sq ft',          desc: 'Extensive property-wide growth'   },
    ],
  },

  // ── Step 6: Severity ───────────────────────────────────────────────────────
  {
    step: 6,
    title: 'How severe is the growth?',
    subtitle: 'Choose the level that best describes the mold appearance.',
    field: 'severity',
    options: [
      { id: 'minor',    label: 'Minor',    desc: 'Surface level growth, no material damage.'         },
      { id: 'moderate', label: 'Moderate', desc: 'Growth penetrating surface, some material damage.' },
      { id: 'severe',   label: 'Severe',   desc: 'Extensive growth, structural involvement.'         },
      { id: 'critical', label: 'Critical', desc: 'Severe structural damage and health hazard.'       },
    ],
  },

  // ── Step 7: Cause ──────────────────────────────────────────────────────────
  {
    step: 7,
    title: 'What caused the mold?',
    subtitle: 'Understanding the source helps determine the scope of work.',
    field: 'cause',
    render: (data, setData) => {
      const CAUSES = [
        { id: 'plumbing', label: 'Plumbing leak',     icon: Droplets   },
        { id: 'roof',     label: 'Roof leak',          icon: Home       },
        { id: 'flooding', label: 'Flooding',           icon: Waves      },
        { id: 'humidity', label: 'High humidity',      icon: Droplets   },
        { id: 'hvac',     label: 'HVAC condensation', icon: RefreshCcw },
        { id: 'unknown',  label: 'Unknown',            icon: Info       },
      ]
      return (
        <div className="grid grid-cols-1 gap-3">
          {CAUSES.map(c => (
            <button
              key={c.id} type="button"
              onClick={() => setData({ ...data, cause: c.id as MoldCause })}
              className={cn(
                'p-5 rounded-2xl border-2 transition-all text-left font-bold flex items-center gap-4 hover:border-primary/50',
                data.cause === c.id ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white',
              )}
            >
              <c.icon className={cn('w-6 h-6 shrink-0', data.cause === c.id ? 'text-primary' : 'text-slate-400')} />
              <span className="text-slate-700">{c.label}</span>
            </button>
          ))}
        </div>
      )
    },
  },

  // ── Step 8: Moisture Fixed ─────────────────────────────────────────────────
  {
    step: 8,
    title: 'Has the moisture source been fixed?',
    subtitle: 'Unresolved moisture will cause mold to return.',
    field: 'moistureFixed',
    options: [
      { id: 'yes',      label: 'Yes'      },
      { id: 'no',       label: 'No'       },
      { id: 'not-sure', label: 'Not sure' },
    ],
  },

  // ── Step 9: Start Time ─────────────────────────────────────────────────────
  {
    step: 9,
    title: 'When did you first notice the mold?',
    subtitle: 'Duration affects severity and extent of growth.',
    field: 'startTime',
    options: [
      { id: '7-days',       label: 'Within the past 7 days' },
      { id: '1-4-weeks',    label: '1–4 weeks ago'          },
      { id: '1-6-months',   label: '1–6 months ago'         },
      { id: 'over-6-months',label: 'Over 6 months ago'      },
    ],
  },

  // ── Step 10: Accessibility ─────────────────────────────────────────────────
  {
    step: 10,
    title: 'How accessible is the area?',
    subtitle: 'Difficult access significantly increases labor costs.',
    field: 'accessibility',
    options: [
      { id: 'easy',        label: 'Easy access (open room)'                           },
      { id: 'drywall',     label: 'Behind drywall'                                    },
      { id: 'crawl-space', label: 'Inside crawl space'                                },
      { id: 'attic',       label: 'Inside attic'                                      },
      { id: 'demolition',  label: 'Requires demolition, tear out, or material removal'},
    ],
  },

  // ── Step 11: HVAC Affected ─────────────────────────────────────────────────
  {
    step: 11,
    title: 'Is your HVAC system potentially affected?',
    subtitle: 'Mold in HVAC can spread spores throughout the entire property.',
    field: 'hvacAffected',
    options: [
      { id: 'yes',      label: 'Yes'      },
      { id: 'no',       label: 'No'       },
      { id: 'not-sure', label: 'Not sure' },
    ],
  },

  // ── Step 12: Furniture Affected ────────────────────────────────────────────
  {
    step: 12,
    title: 'Is any furniture or contents affected?',
    subtitle: 'Contents removal and disposal adds to overall project cost.',
    field: 'furnitureAffected',
    options: [
      { id: 'yes',      label: 'Yes'      },
      { id: 'no',       label: 'No'       },
      { id: 'not-sure', label: 'Not sure' },
    ],
  },

  // ── Step 13: Health Symptoms ───────────────────────────────────────────────
  {
    step: 13,
    title: 'Are any occupants experiencing health symptoms?',
    subtitle: 'Health impacts can indicate more aggressive mold species.',
    field: 'healthSymptoms',
    options: [
      { id: 'none',        label: 'No symptoms'                                          },
      { id: 'mild',        label: 'Mild — occasional sneezing / congestion'              },
      { id: 'respiratory', label: 'Respiratory — coughing, wheezing, difficulty breathing'},
      { id: 'immune',      label: 'Immune response — severe allergic or toxic reactions' },
    ],
  },

  // ── Step 14: Needs Testing ─────────────────────────────────────────────────
  {
    step: 14,
    title: 'Would you like professional mold testing?',
    subtitle: 'Testing identifies species and concentration for insurance and remediation planning.',
    field: 'needsTesting',
    options: [
      { id: 'yes',      label: 'Yes'      },
      { id: 'no',       label: 'No'       },
      { id: 'not-sure', label: 'Not sure' },
    ],
  },

  // ── Step 15: Fogging ───────────────────────────────────────────────────────
  {
    step: 15,
    title: 'Interested in a post-remediation, whole home fogging?',
    subtitle: 'This disinfection process kills mold and airborne spores affecting the non-remediated areas of your home.',
    field: 'foggingInterest',
    options: [
      { id: 'yes',        label: 'Yes, definitely interested'    },
      { id: 'no',         label: 'No, not interested'            },
      { id: 'interested', label: 'I would like more information' },
    ],
  },

  // ── Step 16: Insurance Claim ───────────────────────────────────────────────
  {
    step: 16,
    title: 'Do you plan to file an insurance claim?',
    subtitle: 'Insurance can cover a significant portion of remediation costs.',
    field: 'planInsuranceClaim',
    options: [
      { id: 'yes',      label: 'Yes'      },
      { id: 'no',       label: 'No'       },
      { id: 'not-sure', label: 'Not sure' },
    ],
  },

  // ── Step 17: Has Insurance ─────────────────────────────────────────────────
  {
    step: 17,
    title: "Do you currently have homeowner's insurance?",
    subtitle: 'This helps us factor potential cost offsets into your estimate.',
    field: 'hasInsurance',
    options: [
      { id: 'yes',      label: 'Yes'      },
      { id: 'no',       label: 'No'       },
      { id: 'not-sure', label: 'Not sure' },
    ],
  },

  // ── Step 18: Hiring Timeline ───────────────────────────────────────────────
  {
    step: 18,
    title: 'What is your hiring timeline?',
    subtitle: 'This helps match you with available contractors.',
    field: 'hiringTimeline',
    options: [
      { id: 'asap',        label: 'Immediately — within days'    },
      { id: '30-days',     label: 'Within 30 days'               },
      { id: 'researching', label: 'Still researching options'    },
      { id: 'diy',         label: 'Planning to DIY'              },
    ],
  },

  // ── Step 19: Previous Estimates ────────────────────────────────────────────
  {
    step: 19,
    title: 'Have you already received price estimates from mold remediation companies?',
    subtitle: 'If so, include the company name, city, and estimate amount so we may cross-reference.',
    field: 'previousEstimates',
    requiresNext: true,
    render: (data, setData) => {
      const update = (i: number, field: string, val: string) => {
        const estimates = [...data.previousEstimates] as typeof data.previousEstimates
        estimates[i] = { ...estimates[i], [field]: val }
        setData({ ...data, previousEstimates: estimates })
      }
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {['Company Name', 'City Name', 'Price Estimate'].map(h => (
              <div key={h} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{h}</div>
            ))}
          </div>
          {([0, 1, 2] as const).map(i => (
            <div key={i} className="grid grid-cols-3 gap-4">
              <input type="text" value={data.previousEstimates[i].companyName} placeholder="Company"
                onChange={e => update(i, 'companyName', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 focus:border-primary outline-none font-semibold text-slate-700 bg-slate-50/30" />
              <input type="text" value={data.previousEstimates[i].cityName} placeholder="City"
                onChange={e => update(i, 'cityName', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 focus:border-primary outline-none font-semibold text-slate-700 bg-slate-50/30" />
              <input type="text" value={data.previousEstimates[i].priceEstimate} placeholder="$ Amount"
                onChange={e => update(i, 'priceEstimate', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 focus:border-primary outline-none font-semibold text-slate-700 bg-slate-50/30" />
            </div>
          ))}
        </div>
      )
    },
  },
]