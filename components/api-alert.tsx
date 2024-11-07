"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Badge, Copy, Server } from "lucide-react";
import toast from "react-hot-toast";

interface ApiAlertProps {
    title: string;
    description: string;
    variant: "public" | "admin";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
    public: "text-primary",
    admin: "text-accent",
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
        <Alert className="flex items-center gap-3">
            <div><Server className={``} size={24} /></div>
            <div className="flex flex-col gap-1 w-full">
                <AlertTitle className={textMap[variant]}>{title}
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