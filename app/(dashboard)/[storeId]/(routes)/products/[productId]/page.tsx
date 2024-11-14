
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { Product } from "@/app/models/product";
import { ProductForm } from "./_components/product-form";
import { Category } from "@/app/models/category";
import { Size } from "@/app/models/size";
import { Kitchen } from "@/app/models/kitchen";
import { Cuisine } from "@/app/models/cuisine";

const ProductCreatePage = async ({ params }:
    { params: { storeId: string; productId: string; }; }
) => {
    const product = (await getDoc(doc(db, 'stores', params.storeId, 'products', params.productId)))
        .data() as Product;
    
    const categories = (await getDocs(collection(db, 'stores', params.storeId, 'categories')))
        .docs.map(doc => doc.data() as Category);
        
    const sizes = (await getDocs(collection(db, 'stores', params.storeId, 'sizes')))
        .docs.map(doc => doc.data() as Size);
    
    const kitchens = (await getDocs(collection(db, 'stores', params.storeId, 'kitchens')))
        .docs.map(doc => doc.data() as Kitchen);
    
    const cuisines = (await getDocs(collection(db, 'stores', params.storeId, 'cuisines')))
        .docs.map(doc => doc.data() as Cuisine);
    
    return (<div className="flex flex-col w-full">
        <div className="flex-1 space-y-4 p-8 pt-6 w-full">
            <ProductForm
                initialData={product}
                categories={categories}
                sizes={sizes}
                kitchens={kitchens}
                cuisines={cuisines}
            />
        </div>
    </div>);
}

export default ProductCreatePage;