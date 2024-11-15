"use client";

import Image from "next/image";

interface CellImageProps {
    images: string[]
}

const CellImage = (
    { images }: CellImageProps
) => {
    return (
        <>
            {images.map((image, index) => (
                <div key={index} className="flex items-center justify-center overflow-hidden aspect-square rounded-md">
                    <Image
                        src={image}
                        alt="product image"
                        width={50}
                        height={50}
                        objectFit="contain"
                        className="rounded-md"
                    />
                </div>
            ))}
        </>
    )
}

export default CellImage
