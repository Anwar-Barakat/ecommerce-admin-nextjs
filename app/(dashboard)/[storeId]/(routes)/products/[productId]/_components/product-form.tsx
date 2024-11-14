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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/modal/alert-modal";
import { Product } from "@/app/models/product";
import { Category } from "@/app/models/category";
import { Size } from "@/app/models/size";
import { Kitchen } from "@/app/models/kitchen";
import { Cuisine } from "@/app/models/cuisine";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Checkbox } from "@/components/ui/checkbox";
import { ImagesUpload } from "@/components/images-upload";

interface ProductFormProps {
    initialData: Product;
    categories: Category[];
    sizes: Size[];
    kitchens: Kitchen[];
    cuisines: Cuisine[];
}

const formSchema = z.object({
    name: z.string().min(3),
    price: z.coerce.number().min(1),
    images: z.object({ url: z.string() }).array(),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
    category: z.string().min(3),
    size: z.string().min(3),
    kitchen: z.string().min(3),
    cuisine: z.string().min(3),
});

export const ProductForm = ({
    initialData
    , categories
    , sizes
    , kitchens
    , cuisines
}: ProductFormProps) => {

    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            price: initialData?.price || 0,
            images: initialData?.images || [],
            isFeatured: initialData?.isFeatured || false,
            isArchived: initialData?.isArchived || false,
            category: initialData?.category || "",
            size: initialData?.size || "",
            kitchen: initialData?.kitchen || "",
            cuisine: initialData?.cuisine || "",
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();
    const router = useRouter();
    const title = initialData ? "Edit Product" : "Create Product";
    const description = initialData ? "Edit your Product" : "Create a new Product";
    const toastMessage = initialData ? "Product updated successfully" : "Product created successfully";
    const action = initialData ? "Update" : "Create";

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {

            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, {
                    ...values,
                });
            } else {
                await axios.post(`/api/${params.storeId}/products`, {
                    ...values,
                });
            }
            toast.success(toastMessage);
            router.push(`/${params.storeId}/products`);
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            toast.success("Product deleted successfully");
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
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="images">Image URL</FormLabel>
                                <FormControl>
                                    <ImagesUpload
                                        value={(field.value || [])?.map((image) => image.url)}
                                        onChange={(urls) => {
                                            field.onChange(urls.map((url) => ({ url })));
                                        }}
                                        disabled={isLoading}
                                        onRemove={(url) => {
                                            field.onChange((field?.value || [])?.filter((current) => current.url !== url));
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="price">Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={isLoading}
                                            placeholder="Enter Price"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="category">Category</FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        {...field}
                                        onValueChange={(value) => form.setValue("category", value)}
                                        value={form.getValues("category")}
                                        defaultValue={form.getValues("category")}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder="Select Category"
                                                    defaultValue={form.getValues("category")}
                                                />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.name}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="size"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="size">Size</FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        {...field}
                                        onValueChange={(value) => form.setValue("size", value)}
                                        value={form.getValues("size")}
                                        defaultValue={form.getValues("size")}
                                    >
                                        <FormControl>
                                            <SelectTrigger >
                                                <SelectValue
                                                    placeholder="Select Size"
                                                    defaultValue={form.getValues("size")}
                                                />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {sizes.map((size) => (
                                                <SelectItem key={size.id} value={size.name}>
                                                    {size.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="kitchen"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="kitchen">kitchen</FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        {...field}
                                        onValueChange={(value) => form.setValue("kitchen", value)}
                                        value={form.getValues("kitchen")}
                                        defaultValue={form.getValues("kitchen")}
                                    >
                                        <FormControl>
                                            <SelectTrigger >
                                                <SelectValue
                                                    placeholder="Select kitchen"
                                                    defaultValue={form.getValues("kitchen")}
                                                />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {kitchens.map((kitchen) => (
                                                <SelectItem key={kitchen.id} value={kitchen.name}>
                                                    {kitchen.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cuisine"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="cuisine">cuisine</FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        {...field}
                                        onValueChange={(value) => form.setValue("cuisine", value)}
                                        value={form.getValues("cuisine")}
                                        defaultValue={form.getValues("cuisine")}
                                    >
                                        <FormControl>
                                            <SelectTrigger >
                                                <SelectValue
                                                    placeholder="Select cuisine"
                                                    defaultValue={form.getValues("cuisine")}
                                                />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {cuisines.map((cuisine) => (
                                                <SelectItem key={cuisine.id} value={cuisine.name}>
                                                    {cuisine.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row gap-2 items-start space-x-3 space-y-3 rounded-md border p-3">
                                    <FormControl>
                                        <Checkbox
                                            disabled={isLoading}
                                            checked={field.value}
                                            onCheckedChange={(checked) => field.onChange(checked)}
                                        />
                                    </FormControl>
                                    <div className="m-0 flex flex-col gap-2">
                                        <FormLabel htmlFor="isFeatured">Featured</FormLabel>
                                        <FormDescription>This product will be on home screen</FormDescription>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isArchived"
                            render={({ field }) => (
                                <FormItem className="flex flex-row gap-2 items-start space-x-3 space-y-3 rounded-md border p-3">
                                    <FormControl>
                                        <Checkbox
                                            disabled={isLoading}
                                            checked={field.value}
                                            onCheckedChange={(checked) => field.onChange(checked)}
                                        />
                                    </FormControl>
                                    <div className="m-0 flex flex-col gap-2">
                                        <FormLabel htmlFor="isArchived">Archived</FormLabel>
                                        <FormDescription>This product will be archived</FormDescription>
                                    </div>
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
