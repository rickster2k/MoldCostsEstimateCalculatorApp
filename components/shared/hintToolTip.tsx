export default function HintTooltip({ text }: { text: string }) {
  return (
    <div className="relative group">
      <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 text-[10px] font-black flex items-center justify-center cursor-default select-none">
        ?
      </div>
      <div className="absolute right-0 top-6 z-10 w-56 p-3 bg-slate-900 text-white text-xs leading-relaxed rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {text}
      </div>
    </div>
  )
}