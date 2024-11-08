"use client";

import { Store } from "@/app/models/store";
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
import ApiAlert from "@/components/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
    initialData: Store;
}

const formSchema = z.object({
    name: z.string().min(3, { message: "Store name must be at least 3 characters" }),
});

export const SettingsForm = ({ initialData }: SettingsFormProps) => {

    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            await axios.patch(`/api/stores/${params.storeId}`, values);
            toast.success("Store updated successfully");
            router.refresh();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(`Update failed: ${error.response?.data || error.message}`);
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    const onDelete = async () => {  
        setIsLoading(true);
        try {
            await axios.delete(`/api/stores/${params.storeId}`);
            toast.success("Store deleted successfully");
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
                <Heading title="Settings" description="Manage Store Preferences" />
                <Button variant={"destructive"} size={"icon"} onClick={() => {
                    setIsOpen(true);
                }}>
                    <Trash className="w-4 h-4"
                    />
                </Button>
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
                                    <FormLabel htmlFor="name">Name</FormLabel>
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
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-fit"

                    >
                        Save Changes
                    </Button>
                </form>
            </Form>
            <Separator className="my-4" />
            <ApiAlert
                title="NEXT_PUBLIC_API_KEY"
                description={`${origin}/api/${params.storeId}`}
                variant="public"
            />
        </>
    );
}
