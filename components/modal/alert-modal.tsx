"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    loading?: boolean;
}

export const AlertModal = ({
    isOpen,
    onClose,
    onConfirm,
    loading,
}: AlertModalProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Modal
            title="Are you sure?"
            description="This action cannot be undone."
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="flex space-x-2 items-center justify-end w-full">
                <Button
                    variant={`outline`}
                    disabled={loading}
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    variant={"destructive"}
                    disabled={loading}
                    onClick={onConfirm}
                >
                    {loading ? "Loading..." : "Confirm"}
                </Button>
            </div>
        </Modal>
    );
};