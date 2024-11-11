"use client";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumns, columns } from "./columns";
import { APIList } from "../../categories/_components/api-list";

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
                <Heading
                    title={`Billboards ${data.length > 0 ? `(${data.length})` : ""}`}
                    description="Manage Billboards for your store" />
                <Button onClick={() => router.push(`/${params.storeId}/billboards/create`)}>
                    <Plus className="w-4 h-4" />
                    Add New
                </Button>
            </div>
            <Separator orientation="horizontal" className="my-4" />
            <DataTable columns={columns} data={data} searchKey="label" />

            <Separator className="my-4" />
            <Heading title="API" description="API Calls for Billboards" />
            <Separator className="my-4" />

            <APIList
                entityName="billboards"
                entityNameId="billboardId"
            />
        </div>
    )
}

export default BillboardClient