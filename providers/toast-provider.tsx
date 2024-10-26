"use client";

import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
    return (
        <Toaster
            position="top-right"  // You can customize the position
            reverseOrder={false}   // Optionally display latest toasts at the bottom
        />
    );
};
