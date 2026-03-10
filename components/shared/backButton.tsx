import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type BackButtonDefaultProps = {
    href?: string,
    onClick?: () => void
}
export default function BackButtonDefault({href, onClick}:BackButtonDefaultProps){
    return (
        <>
        {onClick && (
            <button
              type="button"
              onClick={onClick}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
        )}
        {href && (
            <Link href={href} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                <ChevronLeft className="w-5 h-5" />
            </Link>
        )}
        </>
        
    )
}