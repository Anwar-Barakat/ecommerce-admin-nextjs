"use client";

import { cn } from "@/lib/utils";
import { Check, Store } from "lucide-react";

interface StoreListItemProps {
    store: any;
    onSelect: (store: any) => void;
    isChecked: boolean;
}

const StoreListItem = ({ store, onSelect, isChecked }: StoreListItemProps) => {
    
    return (
        <div
            className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-50 text-muted-foreground hover:text-primary"
            onClick={() => onSelect(store)}
            data-store-list-item
            aria-selected={isChecked}
            role="option"
        >
            <Store className="h-4 w-4" />
            <p className="w-full truncate text-sm whitespace-nowrap">
                {store.label}
            </p>
            <Check className={cn('ml-auto w-4 h-4', isChecked ? 'opacity-100' : 'opacity-0')} />
        </div>
    );
};

export default StoreListItem;