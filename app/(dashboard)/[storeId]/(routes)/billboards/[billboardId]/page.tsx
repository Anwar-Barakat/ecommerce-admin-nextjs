import { Billboard } from "@/app/models/billboard";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { BillboardForm } from "./_components/billboard-form";

const BillboardCreatePage = async ({ params }:
    { params: { storeId: string; billboardId: string; }; }
) => {
    const billboard = (await getDoc(doc(db, 'stores', params.storeId, 'billboards', params.billboardId)))
        .data() as Billboard;



    return (<div className="flex flex-col w-full">
        <div className="flex-1 space-y-4 p-8 pt-6 w-full">
            <BillboardForm initialData={billboard} />
        </div>
    </div>);
}

export default BillboardCreatePage;