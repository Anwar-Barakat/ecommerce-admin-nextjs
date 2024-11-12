"use client";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { KitchenColumns, columns } from "./columns";
import { APIList } from "./api-list";

interface KitchenClientProps {
    data: KitchenColumns[]
}


const KitchenClient = (
    { data }: KitchenClientProps
) => {
    const params = useParams();
    const router = useRouter();
    
    return (
        <div className="flex-col w-full">
            <div className="flex items-center justify-between w-full">
                <Heading
                    title={`Kitchen ${data.length > 0 ? `(${data.length})` : ""}`}
                    description="Manage Kitchen for your store" />
                <Button onClick={() => router.push(`/${params.storeId}/kitchens/create`)}>
                    <Plus className="w-4 h-4" />
                    Add New
                </Button>
            </div>
            <Separator className="my-4" />
            <DataTable columns={columns} data={data} searchKey="name" />

            <Separator className="my-4" />
            <Heading title="API" description="API Calls for Kitchens" />
            <Separator className="my-4" />

            <APIList
                entityName="kitchens"
                entityNameId="value"
            />
        </div>
    )
}

export default KitchenClient