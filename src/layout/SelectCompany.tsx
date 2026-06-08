import Select from "@/components/form/Select";
import { useState } from "react";

const opt =[
    {label: 'PT. Cahaya Sambah Sejahtera', value:'css'},
    {label: 'PT. Bumi Kalimantan Permai', value:'bkm'},
]
export  default function SelectCompany(){
    const [select, setSelect]= useState('')

    return <Select onChange={setSelect} options={opt} defaultValue={select} placeholder="Pilih Perusahaan"/>
}