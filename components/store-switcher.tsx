"use client";

import { Store } from "@/app/models/store";
import { PopoverTrigger } from "@/components/ui/popover";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
} from "@/components/ui/popover";
import { ChevronsUpDown, StoreIcon } from "lucide-react";
import StoreListItem from "./store-list-items";
import { CommandSeparator } from "cmdk";
import { useStoreModal } from "@/hooks/use-store-modal";
import CreateStoreItem from "./create-store-item";

type PopoverTriggerProps = React.ComponentProps<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
    item: Store[];
}

const StoreSwitcher = ({ item }: StoreSwitcherProps) => {
    const params = useParams();
    const router = useRouter();
    const storeModal = useStoreModal();

    const [searchTerm, setSearchTerm] = React.useState("");
    const [filteredStores, setFilteredStores] = React.useState<{ label: string, value: string }[]>([]);

    const formattedStores = item.map((store) => ({
        label: store.name,
        value: store.id,
    }));

    const currentStore = formattedStores?.find((store) => store?.value === params.storeId);
    const [open, setOpen] = React.useState(false);

    const onStoreSelect = (store: { value: string; label: string }) => {
        setOpen(false);
        router.push(`/${store.value}`);
    };

    const handleSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;
        setSearchTerm(term);

        const filtered = formattedStores.filter((formattedStore) =>
            formattedStore.label.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredStores(filtered);
        console.log("Search Term:", term); // Debugging search term
        console.log("Filtered Stores:", filtered); // Debugging filtered stores
    };



    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    <StoreIcon className="h-4 w-4" />
                    {
                        currentStore?.value ?
                            formattedStores?.find((formattedStore) => formattedStore?.value === currentStore?.value)?.label :
                            "Select store ..."
                    }
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <div className="w-full px-2 py-1 flex gap-1 items-center border border-gray-100">
                        <StoreIcon className="h-4 w-4 min-w-4" />
                        <input type="text" placeholder="Search store" className="flex-1 w-full outline-none text-md"
                            onChange={handleSearchTerm} />
                    </div>
                    <CommandList>
                        <CommandGroup heading="Stores">
                            {
                                searchTerm === "" ? (
                                    formattedStores.map((item) => (
                                        <StoreListItem
                                            key={item.value}
                                            store={item}
                                            onSelect={onStoreSelect}
                                            isChecked={currentStore?.value === item.value}
                                        />
                                    ))
                                ) : filteredStores.length > 0 ? (
                                    filteredStores.map((item) => (
                                        <StoreListItem
                                            key={item.value}
                                            store={item}
                                            onSelect={onStoreSelect}
                                            isChecked={currentStore?.value === item.value}
                                        />
                                    ))
                                ) : (
                                    <div className="px-2 py-1 text-sm text-gray-500">
                                        No store found
                                    </div>
                                )
                            }
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <CommandList>
                        <CommandGroup>
                            <CreateStoreItem
                                onClick={() => {
                                    setOpen(false);
                                    storeModal.onOpen();
                                }}
                            />
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default StoreSwitcher;
