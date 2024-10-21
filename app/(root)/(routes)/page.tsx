"use client";

import Modal from "@/components/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

const SetupPage = () => {
    const onOpen = useStoreModal(state => state.onOpen);
    const isOpen = useStoreModal(state => state.isOpen);

    useEffect(() => {
        if (!isOpen) {
            onOpen();
        }
    }, [
        isOpen,
        onOpen
    ]);

    return null;

    return (
        <div>
            {/* <Modal
                title="Store Title"
                description="Please enter your store title"
                isOpen={isOpen}
                onClose={handleClose}
            >
                Please enter your store details
            </Modal> */}
        </div>
    );
}

export default SetupPage;
