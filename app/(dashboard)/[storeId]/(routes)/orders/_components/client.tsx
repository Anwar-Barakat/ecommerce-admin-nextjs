"use client";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { OrderColumns, columns } from "./columns";

interface OrderClientProps {
    data: OrderColumns[]
}


const OrderClient = (
    { data }: OrderClientProps
) => {
    const params = useParams();
    const router = useRouter();

    return (
        <div className="flex-col w-full">
            <div className="flex items-center justify-between w-full">
                <Heading
                    title={`Orders ${data.length > 0 ? `(${data.length})` : ""}`}
                    description="Manage Orders for your store" />
            </div>
            <Separator className="my-4" />
            <DataTable columns={columns} data={data} searchKey="name" />
        </div>
    )
}

export default OrderClient