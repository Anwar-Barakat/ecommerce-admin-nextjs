"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellImage } from "./cell-image"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { CellAction } from "./cell-action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type BillboardColumns = {
    id: string
    label: string
    imageUrl: string
    createdAt: string
}


export const columns: ColumnDef<BillboardColumns>[] = [
    {
        accessorKey: "imageUrl",
        header: "Image",
        cell: ({ row }) => {
            const { imageUrl } = row.original
            return (<CellImage imageUrl={imageUrl} />)
        },
    },
    {
        accessorKey: "label",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }
    },
    {
        accessorKey: "id",
        header: "Actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
