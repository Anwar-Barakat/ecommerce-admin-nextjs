import { useParams, useRouter } from 'next/navigation';
import React from 'react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Copy, Edit, MoreVertical, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { BillboardColumns } from './columns';

interface CellActionProps {
    data: BillboardColumns
}

export const CellAction = (
    { data }: CellActionProps
) => {
    const router = useRouter();
    const params = useParams();

    const [isLoading, setIsLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const handleCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success('ID copied to clipboard');
    }

    const handleEdit = () => {
        router.push(`/${params.storeId}/billboards/${data.id}`);
    }


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className='h-8 w-8' variant='ghost'>
                    <span className='sr-only'>open</span>
                    <MoreVertical className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => handleCopy(data.id)}
                    disabled={isLoading}>
                    <Copy className="w-4 h-4 mr-2" />
                    <span>Copy ID</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => handleEdit()}
                    disabled={isLoading}>
                    <Edit className="w-4 h-4 mr-2" />
                    <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => { }}
                    disabled={isLoading}>
                    <Trash
                        className="w-4 h-4 mr-2" />

                    <span>Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};