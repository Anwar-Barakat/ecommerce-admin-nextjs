
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { KitchenForm } from "./_components/kitchen-form";
import { Kitchen } from "@/app/models/kitchen";

const KitchenCreatePage = async ({ params }:
    { params: { storeId: string; kitchenId: string; }; }
) => {
    const kitchen = (await getDoc(doc(db, 'stores', params.storeId, 'kitchens', params.kitchenId)))
        .data() as Kitchen;

    return (<div className="flex flex-col w-full">
        <div className="flex-1 space-y-4 p-8 pt-6 w-full">
            <KitchenForm
                initialData={kitchen}
            />
        </div>
    </div>);
}

export default KitchenCreatePage;