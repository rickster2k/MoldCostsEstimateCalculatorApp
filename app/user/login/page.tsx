import UserLoginClient from "@/components/user/userLoginClient";
import { Suspense } from "react";

export default function UserLogin(){
    return (
        <Suspense fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#0d9488] border-t-transparent rounded-full animate-spin" />
            </div>
            }>
            <div className="flex min-h-[82vh] items-center justify-center">
                <UserLoginClient />
            </div>
        </Suspense>




       
        
    )
}