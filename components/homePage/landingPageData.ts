// ─── data ────────────────────────────────────────────────────────────────────

import { ShieldCheck, Zap, DollarSign, Target, ClipboardCheck, Search, BarChart, Shield, Clock, CheckCircle2 } from "lucide-react";

export const WHY_ITEMS = [
  {
    icon: ShieldCheck,
    color: 'text-teal-400',
    title: 'Eliminate "The Fear of the Unknown"',
    desc: 'Eliminate the unknown of what\'s considered a fair price to remediate your mold issue. By getting an instant estimate from MoldCosts, you transform the unknown into a manageable financial plan.',
  },
  {
    icon: Zap,
    color: 'text-orange-400',
    title: 'Level the Playing Field',
    desc: "Knowledge is power. Walking into a contractor negotiation with industry-standard pricing data prevents \"information asymmetry\" and ensures you aren't overcharged.",
  },
  {
    icon: DollarSign,
    color: 'text-emerald-400',
    title: 'Avoid "Sunk Cost" Traps',
    desc: 'Don\'t wait for an expensive on-site consultation just to find out the job is outside your budget. Get the numbers now, for free, before you invest a single dollar.',
  },
  {
    icon: Target,
    color: 'text-blue-400',
    title: 'Precision Over Guesswork',
    desc: 'General online ranges are useless. Our calculator uses regional labor data and specific severity factors to give you a number you can actually use for budgeting.',
  },
] as const;

export const HOW_STEPS = [
  {
    icon: ClipboardCheck,
    title: '1. Input Details',
    desc: 'Tell us about your property type and the specific areas affected by mold growth.',
  },
  {
    icon: Search,
    title: '2. Regional Analysis',
    desc: 'We adjust our calculation engine based on your local Zip Code and labor market rates.',
  },
  {
    icon: BarChart,
    title: '3. Instant Breakdown',
    desc: 'Receive a detailed cost breakdown including labor, materials, and complexity factors.',
  },
] as const;

export const FEATURE_CARDS = [
  {
    icon: DollarSign,
    title: 'Industry Standard Data',
    desc: 'Powered by national remediation averages and real-time regional labor data.',
  },
  {
    icon: Shield,
    title: 'Comprehensive Analysis',
    desc: 'Factors in accessibility, severity, health risks, and structural involvement for accuracy.',
  },
  {
    icon: Clock,
    title: '100% Free & Instant',
    desc: 'Get your budget numbers in minutes without waiting for callbacks or high-pressure sales visits.',
  },
  {
    icon: CheckCircle2,
    title: 'Privacy First',
    desc: 'Access professional-grade pricing without sharing your personal contact information first.',
  },
] as const;
