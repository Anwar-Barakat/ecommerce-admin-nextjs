
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Product } from "@/app/models/product";
import { ProductForm } from "./_components/product-form";

const ProductCreatePage = async ({ params }:
    { params: { storeId: string; productId: string; }; }
) => {
    const product = (await getDoc(doc(db, 'stores', params.storeId, 'products', params.productId)))
        .data() as Product;

    return (<div className="flex flex-col w-full">
        <div className="flex-1 space-y-4 p-8 pt-6 w-full">
            <ProductForm
                initialData={product}
            />
        </div>
    </div>);
}

export default ProductCreatePage;