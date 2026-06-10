
import { useCompany } from "@/providers/company-providers";

export  default function SelectCompany(){
    const {companies, activeCompany, setActiveCompany} = useCompany()

     const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const selectCompany = companies.find(c=>c.id === value)
        if(selectCompany){
            setActiveCompany(selectCompany)
        }
      };

    return (<select
                value={activeCompany?.id}
                onChange={handleChange}
                className={
                    `h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5 pr-11 text-sm shadow-theme-xs
                    placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10
                    dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 `}
            >
                {companies.map(c=>(
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>)
}