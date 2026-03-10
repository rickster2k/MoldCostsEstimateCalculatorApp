import React from "react";

type HeroSectionProps = {
    children: React.ReactNode
}
export default function HeroSection({children}: HeroSectionProps){
    return (
        <div>{children}</div>
    ) 
}