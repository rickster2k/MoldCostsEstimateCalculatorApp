'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Footer() {
  const router = useRouter()

  return (
    <div className="bg-slate-900 text-slate-400 py-10 px-6 text-sm w-full border-t border-slate-800 relative">

        {/* Hidden admin entry */}
        <button
            onClick={() => router.push('/admin/login')}
            className="absolute top-0 left-0 w-12 h-12 opacity-0 cursor-default"
            aria-hidden
        />

        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
            <p className="text-slate-300 font-medium">
            &copy; 2026 IAQ Network. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-xs">
            <Link href="/terms" target='_blank' className="hover:text-white underline">
                Terms of Service
            </Link>

            <Link href="/privacy" target='_blank' className="hover:text-white underline">
                Privacy Policy
            </Link>

            <Link href="/support"target='_blank' className="hover:text-white underline">
                Contact Support
            </Link>
            </div>

            <p className="text-[11px] text-slate-500 max-w-2xl text-center">
            Disclaimer: The IAQ Audit provides educational guidance and is not a
            substitute for professional on-site investigation.
            </p>
        </div>
    </div>  

  )
}
