"use client";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const BillboardClient = () => {
    const params = useParams();
    const router = useRouter();
    return (
        <div className="flex items-center justify-between w-full">
            <Heading title={`Billboards `} description="Manage Billboards for your store" />
            <Button onClick={() => router.push(`/${params.storeId}/billboards/create`)}>
                <Plus className="w-4 h-4" />
                Add New
            </Button>
        </div>
    )
}

export default BillboardClient