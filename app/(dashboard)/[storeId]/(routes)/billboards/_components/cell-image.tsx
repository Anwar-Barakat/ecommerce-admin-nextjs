"use client";

import Image from "next/image";

interface CellImageProps {
    imageUrl: string
}

export const CellImage = ({ imageUrl }: CellImageProps) => {
    return (
        <div>
            <Image src={imageUrl}
                alt="billboard image preview"
                width={50}
                height={50} />
        </div>
    )
}
