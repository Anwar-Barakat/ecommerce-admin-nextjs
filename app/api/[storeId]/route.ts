import { Store } from "@/app/models/store";
import { db, storage } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    if (!params.storeId) return new NextResponse("Store ID is required", { status: 400 });
    if (!body.name) return new NextResponse("Name is required", { status: 400 });


    const storeRef = doc(db, "stores", params.storeId);
    await updateDoc(storeRef, { name: body.name });

    return new NextResponse("Store updated successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth(); // Get the authenticated user ID

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 }); // Return 401 if user is not authenticated
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 }); // Return 400 if store ID is missing
    }

    const storeRef = doc(db, "stores", params.storeId); // Get a reference to the store document

    // delete the billboards associated with the store
    const billBoardsQuerySnapshot = (await getDocs(
      collection(db, `stores/${params.storeId}/billboards`)
    ));
    billBoardsQuerySnapshot.forEach(async (billboardDoc) => {
      await deleteDoc(billboardDoc.ref);

      // delete the images associated with the billboard
      const imageUrl = billboardDoc.data().imageUrl;
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }
    });

    // delete sizes associated with the store
    const sizesQuerySnapshot = (await getDocs(
      collection(db, `stores/${params.storeId}/sizes`)
    ));
    sizesQuerySnapshot.forEach(async (sizeDoc) => {
      await deleteDoc(sizeDoc.ref);
    });

    // delete categories associated with the store
    const categoriesQuerySnapshot = (await getDocs(
      collection(db, `stores/${params.storeId}/categories`)
    ));
    categoriesQuerySnapshot.forEach(async (categoryDoc) => {
      await deleteDoc(categoryDoc.ref);
    });

    // delete kitchens associated with the store
    const kitchensQuerySnapshot = (await getDocs(
      collection(db, `stores/${params.storeId}/kitchens`)
    ));
    kitchensQuerySnapshot.forEach(async (kitchenDoc) => {
      await deleteDoc(kitchenDoc.ref);
    });

    // delete cuisines associated with the store
    const cuisinesQuerySnapshot = (await getDocs(
      collection(db, `stores/${params.storeId}/cuisines`)
    ));
    cuisinesQuerySnapshot.forEach(async (cuisineDoc) => {
      await deleteDoc(cuisineDoc.ref);
    });

    // delete products associated with the store
    const productsQuerySnapshot = (await getDocs(
      collection(db, `stores/${params.storeId}/products`)
    ));
    productsQuerySnapshot.forEach(async (productDoc) => {
      await deleteDoc(productDoc.ref);

      // delete the images associated with the product
      const imagesArray = productDoc.data().images;
      if (imagesArray && imagesArray.length > 0 && Array.isArray(imagesArray)) {
        await Promise.all(imagesArray.map(async (image) => {
          const imageRef = ref(storage, image.url);
          await deleteObject(imageRef);
        }));
      }
    });

    // delete orders associated with the store
    const ordersQuerySnapshot = (await getDocs(
      collection(db, `stores/${params.storeId}/orders`)
    ));
    ordersQuerySnapshot.forEach(async (orderDoc) => {
      const orderItemsProducts = orderDoc.data().orderItems;

      if (orderItemsProducts && orderItemsProducts.length > 0 && Array.isArray(orderItemsProducts)) {
        await Promise.all(orderItemsProducts.map(async (orderItem) => {
          const itemProductImagesArray = orderItem.images;
          if (itemProductImagesArray && itemProductImagesArray.length > 0 && Array.isArray(itemProductImagesArray)) {
            await Promise.all(itemProductImagesArray.map(async (image) => {
              const imageRef = ref(storage, image.url);
              await deleteObject(imageRef);
            }));
          }
        }));
      }

      await deleteDoc(orderDoc.ref);
    });

    // delete the store
    await deleteDoc(storeRef); // Delete the store document

    return new NextResponse("Store deleted successfully", { status: 200 }); // Return 200 if deletion is successful
  } catch (error) {
    console.log(error); // Log any errors
    return new NextResponse("Internal Server Error", { status: 500 }); // Return 500 if an error occurs
  }
};
