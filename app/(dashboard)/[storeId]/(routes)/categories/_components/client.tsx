"use client";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@radix-ui/react-separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoryColumns, columns } from "./columns";

interface CategoryClientProps {
    data: CategoryColumns[]
}


const CategoryClient = (
    { data }: CategoryClientProps
) => {
    const params = useParams();
    const router = useRouter();
    return (
        <div className="flex-col w-full">
            <div className="flex items-center justify-between w-full">
                <Heading
                    title={`Categories ${data.length > 0 ? `(${data.length})` : ""}`}
                    description="Manage Categories for your store" />
                <Button onClick={() => router.push(`/${params.storeId}/categories/create`)}>
                    <Plus className="w-4 h-4" />
                    Add New
                </Button>
            </div>
            <Separator orientation="horizontal" className="my-4" />
            <DataTable columns={columns} data={data} searchKey="name"/>
        </div>
    )
}

export default CategoryClient