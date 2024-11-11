
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { CategoryForm } from "./_components/size-form";
import { Category } from "@/app/models/category";
import { Billboard } from "@/app/models/billboard";

const CategoryCreatePage = async ({ params }:
    { params: { storeId: string; categoryId: string; }; }
) => {
    const category = (await getDoc(doc(db, 'stores', params.storeId, 'categories', params.categoryId)))
        .data() as Category;

    const billboards = (await getDocs(collection(db, 'stores', params.storeId, 'billboards')))
        .docs.map(doc => doc.data()) as Billboard[];


    return (<div className="flex flex-col w-full">
        <div className="flex-1 space-y-4 p-8 pt-6 w-full">
            <CategoryForm initialData={category}
                billboards={billboards}
            />
        </div>
    </div>);
}

export default CategoryCreatePage;