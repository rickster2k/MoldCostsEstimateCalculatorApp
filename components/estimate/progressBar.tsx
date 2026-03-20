type ProgressBarProps = {
    current: number,
    total: number,
}
export default function ProgressBar({ current, total }: ProgressBarProps) {
    const percent = Math.min((current / total) * 100, 100)
    return (
        <div className="w-full h-1 bg-slate-200">
            <div
                className="h-full bg-[#0d9488] transition-all duration-300 ease-in-out"
                style={{ width: `${percent}%` }}
            />
        </div>
    )
}