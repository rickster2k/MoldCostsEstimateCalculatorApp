import { getDiyShop } from "@/app/actions/firebaseActions/globalStats/getGlobalStats";
import DiyClient from "@/components/user/services/diyClient";
import { toast } from "sonner";

export default async function DiyPage(){

    const result = await getDiyShop()
    if(!result.success){ toast.error("Failed to grab Shop Data")}

    return (
        <div>
            <DiyClient blueprintPrice={result.diyShop?.pricePoint} blueprintUrl={result.diyShop?.paymentUrl}/>    
        </div>
    )
}