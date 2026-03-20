import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import React from "react"

type LegalPageShellProps = {
    title: string,
    icon: React.ReactNode,
    children: React.ReactNode
}

export default function LegalPageShell({title, icon, children}:LegalPageShellProps){
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        {icon}
                    </div>
                    <span className="font-bold text-slate-800 tracking-tight">{title}</span>
                </div>
                <Link
                    href='/'
                    className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-2"
                >
                    <ChevronLeft className="w-4 h-4" /> Back
                </Link>
                </div>
            </header>
            <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">{children}</div>
        </div>
    )

}