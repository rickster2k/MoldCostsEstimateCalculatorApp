import { LandingPage } from "@/components/homePage/landingPage";
import ensureGlobalStats from "./actions/firebaseActions/globalStats/ensureGlobalStats";

export default async function Home() {
  await ensureGlobalStats()

  
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-zinc-50 font-sans ">
      
       <LandingPage/>
    </div>
  );
}
