'use client'

import { Estimate } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import UserReport from "./userReport"
import { getEstimateById } from "@/app/actions/firebaseActions/estimateActions/getEstimateById"
import { toast } from "sonner"

export default function ReportClient(){
    const router = useRouter()

    /* State */
    const [estimate, setEstimate] = useState<Estimate | null>(null)
    const [loading, setLoading] = useState(true)

    /* Grab the user results  */
    useEffect(() => {
        async function loadData() {
            // Get audit from sessionStorage (doesn't change often)
            const storedEstimate = sessionStorage.getItem('estimate')
            if (!storedEstimate) {
                router.push('/user/login')
                return
            }


            // Use sessionStorage only to get the ID, then fetch fresh from Firestore
            const parsed = JSON.parse(storedEstimate) as Estimate
            const result = await getEstimateById(parsed.id)

            if (!result.success || !result.estimate) {
                toast.error("Failed to grab information. Try Again Later !!")
                return
            }


            setEstimate(result.estimate)
            setLoading(false)
        }

        loadData()
    }, [router])

    if (loading) {
        return (
        <div className="p-6 w-full flex items-center justify-center">
            <p>Loading your report...</p>
        </div>
        )
    }

    if (!estimate) { return (<div> There is an error. Please try again later.</div>)    }

    return (
        <div className="p-6 w-full">
            <UserReport estimate={estimate}/>
        </div>
    )
}