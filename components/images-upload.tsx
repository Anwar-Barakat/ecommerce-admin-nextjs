"use client";

import { storage } from '@/lib/firebase';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { ImagePlus, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { PuffLoader } from 'react-spinners';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Button } from './ui/button';

interface ImagesUploadProps {
    disabled?: boolean;
    onChange: (value: string[]) => void;
    onRemove: (value: string) => void;
    value: string[];
}

export const ImagesUpload = ({ disabled, onChange, onRemove, value }: ImagesUploadProps) => {
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: File[] = Array.from(e.target.files || []);
        if (files.length === 0) return;
        setIsLoading(true);
        const newUrls: string[] = [];
        let completeUploader = 0;
        files.forEach((file: File) => {
            const uploadTask = uploadBytesResumable(
                ref(storage, `images/products/${Date.now()}-${file.name}`),
                file,
                { contentType: file.type }
            );

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(progress);
                },
                (error) => {
                    console.error('Error uploading image:', error);
                    toast.error('Failed to upload image');
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        newUrls.push(downloadURL);
                        completeUploader++;
                        if (completeUploader === files.length) {
                            setIsLoading(false);
                            onChange([...value, ...newUrls]);
                            toast.success('Images uploaded');
                        }
                    });
                }
            );
        });
    };

    const handleRemove = (url: string) => {
        const newValue = value.filter((imageUrl) => imageUrl !== url);
        onRemove(url);
        onChange(newValue);
        deleteObject(ref(storage, url)).then(() => {
            toast.success('Image removed');
        }).catch((error) => {
            console.error('Error removing image:', error);
            toast.error('Failed to remove image');
        });
    }

    return (
        <div className="image-upload-container">
            <div className="grid grid-cols-3 gap-4">
                {value && value.length > 0 ? (
                    value.map((imageUrl, index) => (
                        <div key={index} className="uploaded-image-preview w-52 h-52 rounded-md overflow-hidden border border-gray-200 relative">
                            <Image
                                src={imageUrl}
                                alt={`Uploaded preview ${index + 1}`}
                                width={208}
                                height={208}
                                className="object-cover w-full h-full"
                            />
                            <Button
                                onClick={() => handleRemove(imageUrl)}
                                disabled={disabled || isLoading}
                                variant="destructive"
                                className="absolute top-2 right-2 bg-white p-1 rounded-sm shadow-md hover:bg-red-500 hover:text-white text-black w-8 h-8"
                            >
                                <Trash className="w-4 h-4" />
                            </Button>
                        </div>
                    ))
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
                                    <p>Upload images</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUpload}
                                    className="hidden"
                                    disabled={disabled || isLoading}
                                    multiple
                                />
                            </label>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
