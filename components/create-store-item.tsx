"use client";

import { PlusCircle } from "lucide-react";

interface CreateStoreItemProps {
    onClick: () => void;
}

const CreateStoreItem = (
    { onClick }: CreateStoreItemProps
) => {
    return (
        <div className="flex items-center bg-gray-50 px-2 py-1 cursor-pointer text-muted-foreground hover:text-primary"
            onClick={onClick}
        >
            <PlusCircle className="h-4 w-4" />
            <div className="ml-2 text-md">Create store</div>
        </div>
    )
}

export default CreateStoreItem