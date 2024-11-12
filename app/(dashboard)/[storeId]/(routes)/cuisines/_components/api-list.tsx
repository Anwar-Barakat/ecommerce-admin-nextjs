"use client";

import ApiAlert from "@/components/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import { useParams, useRouter } from "next/navigation";

interface APIListProps {
    entityName: string
    entityNameId: string
}

export const APIList = (
    { entityName, entityNameId }: APIListProps
) => {

    const params = useParams();
    const origin = useOrigin();
    const router = useRouter();

    const baseUrl = `${origin}/api/${params.storeId}`;

    return (
        <>
            <ApiAlert title="GET"
                description={`${baseUrl}/${entityName}`}
                variant="public" />
            <ApiAlert title="GET"
                description={`${baseUrl}/${entityName}/${entityNameId}`}
                variant="public" />
            <ApiAlert title="POST"
                description={`${baseUrl}/${entityName}`}
                variant="admin" />
            <ApiAlert title="PATCH"
                description={`${baseUrl}/${entityName}/${entityNameId}`}
                variant="admin" />
            <ApiAlert title="DELETE"
                description={`${baseUrl}/${entityName}/${entityNameId}`}
                variant="admin" />
        </>
    )
}
