import { Product } from "@/app/models/product";
import { db, storage } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

// PATCH: Update a prod for the given store
export const PATCH = async (
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      productId: string;
    };
  }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      name,
      price,
      images,
      isFeatured,
      isArchived,
      category,
      size,
      kitchen,
      cuisine,
    } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || images.length === 0) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!category) {
      return new NextResponse("Category is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const storeId = params.storeId;
    const store = await getDoc(doc(db, "stores", storeId));

    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    if (store.data().userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const productId = params.productId;
    const productRef = await getDoc(
      doc(db, "stores", storeId, "products", productId)
    );

    if (!productRef.exists()) {
      return new NextResponse("Product not found", { status: 404 });
    }

    await updateDoc(doc(db, "stores", storeId, "products", productId), {
      ...productRef.data(),
      name,
      price,
      images,
      isFeatured: isFeatured || false,
      isArchived: isArchived || false,
      category,
      size,
      kitchen,
      cuisine,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const product = (
      await getDoc(doc(db, "stores", storeId, "products", productId))
    ).data() as Product;

    return NextResponse.json(product);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// DELETE: Delete a product for the given store
export const DELETE = async (
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      productId: string;
    };
  }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const storeId = params.storeId;
    const store = await getDoc(doc(db, "stores", storeId));

    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    if (store.data().userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const productId = params.productId;

    const productRef = await doc(db, "stores", storeId, "products", productId);
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Delete the product imaged

    if (productDoc.exists()) {
      const product = productDoc.data() as Product;
      const images = product.images;
      if(images && Array.isArray(images) && images.length > 0) {
        await Promise.all(
          images.map(async (image) => {
            const imageRef = ref(storage, image.url);
            await deleteObject(imageRef);
          })
        );
      }
    }

    await deleteDoc(productRef);

    return new NextResponse("Product deleted successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
