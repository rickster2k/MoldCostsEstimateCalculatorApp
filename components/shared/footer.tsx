'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Footer() {
    const router = useRouter()
    const networkUrl = "https://www.iaq.network"
  return (
    <div className="bg-slate-900 text-slate-400 py-10 px-6 text-sm w-full border-t border-slate-800 relative">

        {/* Hidden admin entry */}
        <button
            onClick={() => router.push('/admin/login')}
            className="absolute top-0 left-0 w-12 h-12 opacity-0 cursor-default"
            aria-hidden
        />

        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
            <p className="text-slate-300 font-medium">&copy; 2026 <Link href={networkUrl} className="hover:text-teal-400 transition-colors cursor-pointer">IAQ Network</Link>. All rights reserved.</p>

            <div className="flex flex-wrap justify-center gap-6 text-xs">
            <Link href="/tos" target='_blank' className="hover:text-white underline">
                Terms of Service
            </Link>

            <Link href="/privacy" target='_blank' className="hover:text-white underline">
                Privacy Policy
            </Link>

           <a href="mailto:support@iaq.network" className="hover:text-white underline">  Support</a>
           
            </div>

            <p className="text-[11px] text-slate-500 max-w-2xl text-center">
                Disclaimer: The Mold Cost Estimate Calculator provides an estimation via an AI Model and is not a
                substitute for professional guidance.
            </p>
        </div>
    </div>  

  )
}
