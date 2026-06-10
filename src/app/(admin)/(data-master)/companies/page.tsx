'use client'

import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import BasicTableOne from "@/components/tables/BasicTableOne"
import { useCompany } from "@/providers/company-providers"
import {Card, CardContent} from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function Page(){
    const {activeCompany, companies} = useCompany()
    return (
        <>
            <div>
                <PageBreadcrumb pageTitle="Daftar Perusahaan"/>
                
                <Card>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Nama Perusahaan</TableHead>
                                    <TableHead>NPWP</TableHead>
                                    <TableHead>Kota</TableHead>
                                    <TableHead>Telephone</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {companies.map(c=>(
                                    <TableRow key={c.id}>
                                        <TableCell>{c.code}</TableCell>
                                        <TableCell>{c.name}</TableCell>
                                        <TableCell>{c.npwp ?? "-"}</TableCell>
                                        <TableCell>{c.city ?? "-"}</TableCell>
                                        <TableCell>{c.phone ?? "-"}</TableCell>
                                        <TableCell>{c.is_active ? <Badge>Aktif</Badge> : <Badge>Tidak</Badge>}</TableCell>
                                        <TableCell className="text-right">
                                            <>
                                                <Button variant={'ghost'} size={'icon'}><Trash2 className="text-destructive"/></Button>
                                                <Button variant={'ghost'} size={'icon'}><Pencil/></Button>
                                            </>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}