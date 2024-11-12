"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { CellAction } from "./cell-action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type ProductColumns = {
    id: string
    name: string
    price: string
    isFeatured: boolean
    isArchived: boolean
    category: string
    size: string
    kitchen: string
    cuisine: string
    createdAt: string
    images:{url:string}[]
}


export const columns: ColumnDef<ProductColumns>[] = [  
    {
        accessorKey: "name",
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
        accessorKey: "price",
        header:"Price"
    },
    {
        accessorKey: "isFeatured",
        header:"Featured"
    },
    {
        accessorKey: "isArchived",
        header:"Archived"
    },
    {
        accessorKey: "category",
        header:"Category"
    },
    {
        accessorKey: "size",
        header:"Size"
    },
    {
        accessorKey: "kitchen",
        header:"Kitchen"
    },
    {
        accessorKey: "cuisine",
        header:"Cuisine"
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
