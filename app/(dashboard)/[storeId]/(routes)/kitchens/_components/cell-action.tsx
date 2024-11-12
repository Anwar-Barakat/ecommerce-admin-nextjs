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
import axios from 'axios';
import { AlertModal } from '@/components/modal/alert-modal';
import { KitchenColumns } from './columns';

interface CellActionProps {
    data: KitchenColumns
}

export const CellAction = (
    { data }: CellActionProps
) => {
    const router = useRouter();
    const params = useParams();

    const [isLoading, setIsLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const handleCopyAction = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success('ID copied to clipboard');
    }

    const handleEditAction = () => {
        router.push(`/${params.storeId}/kitchens/${data.id}`);
    }

    const handleDeleteAction = async () => {
        try {
            setIsLoading(true);

            // After successful deletion, delete the kitchen from your database
            await axios.delete(`/api/${params.storeId}/kitchens/${data.id}`);

            toast.success('Kitchen deleted');
            router.push(`/${params.storeId}/kitchens`);
        } catch (error) {
            console.error("Deletion Error:", error); // Log the error for debugging
            toast.error('Failed to delete kitchen');
        } finally {
            router.refresh();
            setIsLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={handleDeleteAction}
                loading={isLoading}
            />
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
                        onClick={() => handleCopyAction(data.id)}
                        disabled={isLoading}>
                        <Copy className="w-4 h-4 mr-2" />
                        <span>Copy ID</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleEditAction()}
                        disabled={isLoading}>
                        <Edit className="w-4 h-4 mr-2" />
                        <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setOpen(true)}
                        disabled={isLoading}>
                        <Trash
                            className="w-4 h-4 mr-2" />

                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};