import { createClients } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function useLogout(){
    const router = useRouter()
    const supabase = createClients()

    const logout = async ()=>{
        const {error} = await supabase.auth.signOut()
        if(error){
            throw error
        }
        
        return router.refresh()
    }

    return logout
}