
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { CuisineForm } from "./_components/cuisine-form";
import { Cuisine } from "@/app/models/cuisine";

const CuisineCreatePage = async ({ params }:
    { params: { storeId: string; cuisineId: string; }; }
) => {
    const cuisine = (await getDoc(doc(db, 'stores', params.storeId, 'cuisines', params.cuisineId)))
        .data() as Cuisine;

    return (<div className="flex flex-col w-full">
        <div className="flex-1 space-y-4 p-8 pt-6 w-full">
            <CuisineForm
                initialData={cuisine}
            />
        </div>
    </div>);
}

export default CuisineCreatePage;