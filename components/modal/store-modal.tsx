"use client";

import Modal from "@/components/modal";
import { useStoreModal } from "@/hooks/use-store-modal";

export const StoreModal = () => {
    const storeModal = useStoreModal();
    return (
        <Modal
            title="Create Store"
            description="Create a new store"
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            Form here
        </Modal>
    );
}