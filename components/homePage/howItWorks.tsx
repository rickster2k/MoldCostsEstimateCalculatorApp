import React from "react"

type HowItWorksSectionProps = {
    children: React.ReactNode
}
export default function HowItWorksSection({children}: HowItWorksSectionProps) {
    return (
        <div> {children} </div>
    )
}