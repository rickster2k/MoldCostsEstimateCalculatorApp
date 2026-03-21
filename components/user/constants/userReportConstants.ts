export const AD_ROWS = [
    { label: 'Get Real Estimates From Local Remediators Delivered to Your Inbox', targetId: 'ad1', bg: 'bg-green-600', border: 'border-green-200', text: 'text-white', hover: 'hover:bg-green-700' },
    { label: 'Get a MONEY-SAVING Do-It-Yourself Remediation Blueprint', targetId: 'ad2', bg: 'bg-orange-600', border: 'border-orange-200', text: 'text-white', hover: 'hover:bg-orange-700' },
    { label: 'Get a Remote Remediation Consultant to Guide You through the Process', targetId: 'ad3', bg: 'bg-blue-600', border: 'border-blue-200', text: 'text-white', hover: 'hover:bg-blue-700' },
]

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
'single-family': 'Single Family',
'townhouse':     'Townhouse',
'condo':         'Condo',
'apartment':     'Apartment',
'commercial':    'Commercial',
}

export const PROPERTY_SIZE_LABELS: Record<string, string> = {
'under-1000': 'Under 1,000 sq ft',
'1000-2000':  '1,000 – 2,000 sq ft',
'2000-3000':  '2,000 – 3,000 sq ft',
'3000-plus':  '3,000+ sq ft',
}

export const AREA_SIZE_LABELS: Record<string, string> = {
'less-10':  'Less than 10 sq ft',
'10-25':    '10 – 25 sq ft',
'25-100':   '25 – 100 sq ft',
'100-300':  '100 – 300 sq ft',
'300-plus': '300+ sq ft',
}

export const ACCESSIBILITY_LABELS: Record<string, string> = {
'easy':        'Easy (open room)',
'drywall':     'Behind drywall',
'crawl-space': 'Crawl space',
'attic':       'Attic',
'demolition':  'Requires demolition',
}

export const START_TIME_LABELS: Record<string, string> = {
'7-days':        '7 days',
'1-4-weeks':     '1–4 weeks',
'1-6-months':    '1–6 months',
'over-6-months': 'Over 6 months',
}

export const HIRING_TIMELINE_LABELS: Record<string, string> = {
'asap':        'As soon as possible',
'30-days':     'Within 30 days',
'researching': 'Still researching',
'diy':         'Planning to DIY',
}

export const HEALTH_SYMPTOMS_LABELS: Record<string, string> = {
'none':        'None',
'mild':        'Mild (sneezing / congestion)',
'respiratory': 'Respiratory (coughing, wheezing)',
'immune':      'Severe (allergic / toxic reactions)',
}

export const FOGGING_LABELS: Record<string, string> = {
'yes':        'Yes',
'no':         'No',
'not-sure':   'Not sure',
'interested': 'Interested, want more info',
}

export const YES_NO_LABELS: Record<string, string> = {
'yes':      'Yes',
'no':       'No',
'not-sure': 'Not sure',
}

export const CAUSE_LABELS: Record<string, string> = {
'plumbing': 'Plumbing leak',
'roof':     'Roof leak',
'flooding': 'Flooding',
'humidity': 'High humidity',
'hvac':     'HVAC system',
'unknown':  'Unknown',
}

export const SEVERITY_LABELS: Record<string, string> = {
'minor':    'Minor (surface level)',
'moderate': 'Moderate (some material damage)',
'severe':   'Severe (structural involvement)',
'critical': 'Critical (structural damage + health hazard)',
}