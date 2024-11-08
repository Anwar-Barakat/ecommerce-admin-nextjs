"use client";

import { storage } from '@/lib/firebase';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { ImagePlus, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { PuffLoader } from 'react-spinners';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Button } from './ui/button';

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}

export const ImageUpload = ({ disabled, onChange, onRemove, value }: ImageUploadProps) => {
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setIsLoading(true);
            const file = e.target.files[0];
            const uploadTask = uploadBytesResumable(
                ref(storage, `images/${Date.now()}-${file.name}`),
                file,
                { contentType: file.type }
            );

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                },
                (error) => {
                    console.error('Failed to upload image:', error);
                    setIsLoading(false);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        onChange(downloadURL); // Pass the URL to parent component
                        setIsLoading(false);
                    });
                }
            );
        }
    };

    const handleRemove = (url: string) => {
        onRemove(url);
        deleteObject(ref(storage, url)).then(() => {
            toast.success('Image deleted successfully.');
        })
    }

    return (
        <div className="image-upload-container">
            {value && value.length > 0 ? (
                <div className="uploaded-image-preview w-52 h-52 rounded-md overflow-hidden border border-gray-200 relative">
                    <Image
                        src={value[0]}
                        alt="Uploaded preview"
                        width={208} // equivalent to 52 * 4 in Tailwind (w-52)
                        height={208}
                        className="object-cover w-full h-full"
                        
                    />
                    <Button
                        onClick={() => handleRemove(value[0])}
                        disabled={disabled || isLoading}
                        variant={`destructive`}
                        className="absolute top-2 right-2 bg-white p-1 rounded-sm shadow-md hover:bg-red-500 hover:text-white text-black w-8 h-8"
                        
                    >
                        <Trash className="w-4 h-4" />
                    </Button>
                </div>
            ) : (
                <div className="w-52 h-52 rounded-md overflow-hidden border border-dashed border-gray-200 flex items-center justify-center flex-col gap-3">
                    {isLoading ? (
                        <div className="loader-container">
                            <PuffLoader size={30} color="#555" />
                            <p>{`${progress.toFixed(2)}%`}</p>
                        </div>
                    ) : (
                        <label>
                            <div className="w-full h-full flex flex-col gap-2 items-center cursor-pointer">
                                <ImagePlus className="w-8 h-8" />
                                <p>Upload Image</p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleUpload}
                                className="hidden"
                                disabled={disabled || isLoading}
                            />
                        </label>
                    )}
                </div>
            )}
        </div>
    );
};
