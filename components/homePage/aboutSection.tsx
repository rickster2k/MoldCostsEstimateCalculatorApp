import React from "react"

type AboutSectionProps = {
    children: React.ReactNode
}
export default function AboutSection({children} : AboutSectionProps){
    return (
        <div> {children} </div>
    )
}