"use client";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Using useParams only
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/modal/alert-modal";
import { Kitchen } from "@/app/models/kitchen";

interface KitchenFormProps {
    initialData: Kitchen;
}

const formSchema = z.object({
    name: z.string().min(3),
    value: z.string().min(1),
});

export const KitchenForm = ({ initialData }: KitchenFormProps) => {

    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();
    const router = useRouter();
    const title = initialData ? "Edit Kitchen" : "Create Kitchen";
    const description = initialData ? "Edit your Kitchen" : "Create a new Kitchen";
    const toastMessage = initialData ? "Kitchen updated successfully" : "Kitchen created successfully";
    const action = initialData ? "Update" : "Create";

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/kitchens/${params.kitchenId}`, {
                    ...values,
                });
            } else {
                await axios.post(`/api/${params.storeId}/kitchens`, {
                    ...values,
                });
            }
            toast.success(toastMessage);
            router.push(`/${params.storeId}/kitchens`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(`Update failed: ${error.response?.data || error.message}`);
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            router.refresh();
            setIsLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/${params.storeId}/kitchens/${params.kitchenId}`);
            toast.success("Kitchen deleted successfully");
            router.refresh();
            router.push("/");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(`Delete failed: ${error.response?.data || error.message}`);
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <AlertModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={onDelete}
                loading={isLoading}

            />
            <div className="flex items-center justify-center">
                <Heading title={title} description={description} />
                {
                    initialData && (
                        <Button
                            variant="destructive"
                            className="ml-auto"
                            onClick={() => setIsOpen(true)}
                            disabled={isLoading}
                        >
                            <Trash className="w-4 h-4" />
                            Delete
                        </Button>
                    )
                }
            </div>
            <Separator className="my-4" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                    <div className="grid grid-cols-3 gap-8">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="name">Label</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder="Enter Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="value">Value</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder="Enter Value"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-fit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    );
}
