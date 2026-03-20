'use client'

import { ShieldCheck } from "lucide-react"
import Link from "next/link"
import { signOut, useSession } from 'next-auth/react'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export type HeaderProps = {
    brandName?:string;
}
export default function Header({brandName = 'MoldCosts'}:HeaderProps){
    const { data: session } = useSession()
    const isAdmin = session?.user?.admin === true
    const router = useRouter()

    
    // Track if user has audit data in sessionStorage
    const [hasEstimateData, setHasEstimateData] = useState(false)

    useEffect(() => {
      // Check if user has active audit session
      const checkEstimateSession = () => {
        const estimateData = sessionStorage.getItem('estimate')
        setHasEstimateData(!!estimateData)
      }

      checkEstimateSession()

      // Listen for storage changes (when user logs in/out)
      window.addEventListener('storage', checkEstimateSession)
      
      // Custom event for same-tab updates
      window.addEventListener('estimate-session-change', checkEstimateSession)

      return () => {
        window.removeEventListener('storage', checkEstimateSession)
        window.removeEventListener('estimate-session-change', checkEstimateSession)
      }
    }, [])

    const handleSignOut = () => {
        if(isAdmin){
            signOut({ callbackUrl: '/'})
        } else if(hasEstimateData){
            // Clear audit session
            sessionStorage.removeItem('estimate')
            setHasEstimateData(false) 
             // Dispatch custom event for other components
            window.dispatchEvent(new Event('estimate-session-change'))
            // Redirect to home
            router.push('/')
        }
        else{
            alert("Should never hit here")
            router.push('/')
        }
    }

    return (
        <header className="bg-white border-b border-slate-100 py-3 px-4 sticky top-0 z-50 shadow-sm">
            <div className="grid grid-cols-3 items-center w-full px-10">
            
            {/* Logo + name */}
            <Link
                href="/"
                onClick={handleSignOut}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                <div className="w-8 h-8 bg-theme1 rounded-lg flex items-center justify-center shadow-sm shadow-green-600/30">
                    <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <span className="font-black text-slate-900 tracking-tight hidden sm:block">
                    {brandName}
                </span>
            </Link>
            
            {/* Center attribution */}
            <div className="flex flex-col items-center order-1 md:order-2">
                <p className="text-[9px] uppercase tracking-[0.25em] text-slate-400 font-bold ">
                    Audit Courtesy of:
                </p>
                <a
                    href="https://www.iaq.network"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center hover:opacity-80 text-2xl font-black"
                >
                    <span className="text-[#1E3A5F]">IAQ</span>
                    <span className="text-[#0d9488]">.network</span>
                </a>
            </div>


            {/* Right side */}
            <div className="flex items-center justify-end gap-6 order-3">
            {!isAdmin && (
                <button
                onClick={() => (session || hasEstimateData ) ? handleSignOut() : router.replace('/user/login')} // add check for user with or next to session
                className="text-sm font-bold text-slate-400 hover:text-[#1e3a5f]"
                >
                {(session || hasEstimateData)  ? 'Sign Out' : 'Sign In'} 
                </button>
            )}
            </div>

            </div>

        </header>
    )
}