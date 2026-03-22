export const dynamic = 'force-dynamic'

import ReportClient from "@/components/user/reportClient";
import { verifyUserIsValid } from "@/lib/auth/verifyUserIsValid";

export default async function ReportPage(){
    await verifyUserIsValid()    //check if user is verified

    return (
        <div className="p-6 w-full">
            <ReportClient />
        </div>
        
    )
}