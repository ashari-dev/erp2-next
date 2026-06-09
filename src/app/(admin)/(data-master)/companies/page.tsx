'use client'

import {supabase } from "@/lib/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function Page(){
    const {data} = useQuery({
        queryKey: ['companies'],
        queryFn: async ()=>{
            const {data, error} = await supabase.from('roles').select('*')
            console.log(error)
            return data
        }
    }) 
    console.log(data)
    return <>Perusahaan</>
}