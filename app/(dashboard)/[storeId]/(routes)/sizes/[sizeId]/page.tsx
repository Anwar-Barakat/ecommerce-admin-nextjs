
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {  SizeForm } from "./_components/size-form";
import { Size } from "@/app/models/size";

const SizeCreatePage = async ({ params }:
    { params: { storeId: string; sizeId: string; }; }
) => {
    const size = (await getDoc(doc(db, 'stores', params.storeId, 'sizes', params.sizeId)))
        .data() as Size;

    return (<div className="flex flex-col w-full">
        <div className="flex-1 space-y-4 p-8 pt-6 w-full">
            <SizeForm
                initialData={size}
            />
        </div>
    </div>);
}

export default SizeCreatePage;