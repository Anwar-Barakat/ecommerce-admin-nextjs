"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "@/components/modal";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // Assuming you're using Shadcn's Button

// Form validation schema using zod
const formSchema = z.object({
    name: z.string().min(3, { message: "Store name must be at least 3 characters" }),
});

export const StoreModal = () => {
    const storeModal = useStoreModal();
    const [isLoading, setIsLoading] = useState(false);

    // Using react-hook-form with zod for validation
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), // Using zodResolver correctly
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            console.log(values);
            // Handle form submission (e.g., send data to an API)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            title="Create a new store"
            description="Please enter your store details"
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            <div className="space-y-4 py-2 pb-4">
                {/* Form component from sadcn */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="name">Store name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder="Enter store name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center justify-end w-full mt-4 gap-1 space-x-2">
                            <Button variant="outline">Cancel</Button>
                            <Button type="submit"  loading={isLoading}>
                                Create store
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Modal>
    );
};
