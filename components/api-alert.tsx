"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BadgeProps, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Server } from "lucide-react";
import toast from "react-hot-toast";

interface ApiAlertProps {
    title: string;
    description: string;
    variant: "public" | "admin";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
    public: "text-primary",
    admin: "text-primary",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps['variant']> = {
    public: "secondary",
    admin: "destructive",
};

const ApiAlert: React.FC<ApiAlertProps> = ({ title, description, variant }) => {

    const copyToClipboard = () => {
        navigator.clipboard.writeText(description);
        toast.success("Copied to clipboard");
    }

    return (
        <Alert className="flex items-start gap-3">
            <div><Server className={``} size={16} /></div>
            <div className="flex flex-col gap-1 w-full">
                <AlertTitle className={`${textMap[variant]} flex items-start`}>
                    {title} 
                    {variant === "admin" && (
                        <Badge variant={variantMap[variant]} className="ml-2">Admin</Badge>
                    )}
                </AlertTitle>
                <AlertDescription className="flex items-center justify-between w-full">
                    <code className="relative rounded-md bg-muted px-[0.3rem] py-[0.2rem]">{description}</code>
                    <Button variant={"outline"} size={"icon"} className="text-muted-foreground"
                        onClick={copyToClipboard}>
                        <Copy className="w-4 h-4" />
                    </Button>
                </AlertDescription>
            </div>
        </Alert>
    )
};

export default ApiAlert;