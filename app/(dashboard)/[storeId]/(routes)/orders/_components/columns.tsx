"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { CellAction } from "./cell-action"
import CellImage from "./cell-image"

// This type is used to define the shape of our data.

// You can use a Zod schema here if you want.
export type OrderColumns = {
    id: string
    phone: string
    address: string
    products :string
    totalPrice: string
    images: string[]
    isPaid: boolean
    status: string
    createdAt: string
}

export const columns: ColumnDef<OrderColumns>[] = [  
    {
        accessorKey: 'images',
        header: 'Images',
        cell: ({ row }) => (
            <div className="grid grid-cols-2 gap-2">
                <CellImage images={row.original.images} /> 
            </div>
        )
    },
    {
        accessorKey: 'products',
        header: 'Products',
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
    },
    {
        accessorKey: 'address',
        header: 'Address',
    },
    {
        accessorKey: 'totalPrice',
        header: 'Total Price',
    },
    {
        accessorKey: 'isPaid',
        header: "Payment Status",
    },
    {
        accessorKey: 'status',
        header: 'Status',
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
