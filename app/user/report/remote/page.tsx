export const dynamic = 'force-dynamic'

import { getRemoteConsultShop } from "@/app/actions/firebaseActions/globalStats/getGlobalStats";
import RemoteClient from "@/components/user/services/remoteClient";
import { toast } from "sonner";

export default async function RemotePage(){
    const result = await getRemoteConsultShop()
    if(!result.success){ toast.error("Failed to grab Shop Data")}
    
    return(
        <div>
            <RemoteClient  consultationPrice={result.remoteConsultShop?.pricePoint} consultationUrl={result.remoteConsultShop?.paymentUrl} />
        </div>
    )
}