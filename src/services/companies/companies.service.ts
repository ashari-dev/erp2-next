import { createClients } from "@/lib/supabase/client"
import { ICompany } from "@/types/company"

const supabase = createClients()

export async function  GetAllCompanies(){
    const {data, error} = await supabase.from('companies').select('*').order('code')
    if(error) throw error

    return data as ICompany[]
}