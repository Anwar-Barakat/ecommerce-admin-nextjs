"use client";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@radix-ui/react-separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumns, columns } from "./columns";

interface BillboardClientProps {
    data: BillboardColumns[]
}


const BillboardClient = (
    { data }: BillboardClientProps
) => {
    const params = useParams();
    const router = useRouter();
    return (
        <div className="flex-col w-full">
            <div className="flex items-center justify-between w-full">
                <Heading title={`Billboards `} description="Manage Billboards for your store" />
                <Button onClick={() => router.push(`/${params.storeId}/billboards/create`)}>
                    <Plus className="w-4 h-4" />
                    Add New
                </Button>
            </div>
            <Separator orientation="horizontal" className="my-4" />
            <DataTable columns={columns} data={data} searchKey="label"/>
        </div>
    )
}

export default BillboardClient