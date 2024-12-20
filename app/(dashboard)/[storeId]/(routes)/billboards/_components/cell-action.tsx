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
import { deleteObject, getMetadata, ref } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import axios from 'axios';
import { AlertModal } from '@/components/modal/alert-modal';

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

    const handleCopyAction = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success('ID copied to clipboard');
    }

    const handleEditAction = () => {
        router.push(`/${params.storeId}/billboards/${data.id}`);
    }

    const handleDeleteAction = async () => {
        try {
            setIsLoading(true);

            // Check if the object exists in Firebase storage
            const imageRef = ref(storage, data.imageUrl);
            const imageExists = await getMetadata(imageRef).then(() => true).catch(() => false);

            if (imageExists) {
                // Delete the object from Firebase storage
                await deleteObject(imageRef);
            } else {
                console.warn("Image does not exist in Firebase Storage");
            }

            // After successful deletion, delete the billboard from your database
            await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);

            toast.success('Billboard deleted');
            router.push(`/${params.storeId}/billboards`);
        } catch (error) {
            console.error("Deletion Error:", error); // Log the error for debugging
            toast.error('Failed to delete billboard');
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