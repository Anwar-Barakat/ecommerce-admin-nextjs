import { Category } from "@/app/models/category";
import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

// PATCH: Update a category for the given store
export const PATCH = async (
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      categoryId: string;
    };
  }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { label, imageUrl } = body;

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    const storeId = params.storeId;
    const store = await getDoc(doc(db, "stores", storeId));

    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    if (store.data().userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const categoryId = params.categoryId;
    const categoryRef = await getDoc(
      doc(db, "stores", storeId, "categories", categoryId)
    );

    if (!categoryRef.exists()) {
      return new NextResponse("Category not found", { status: 404 });
    }

    await updateDoc(doc(db, "stores", storeId, "categories", categoryId), {
      ...categoryRef.data(),
      label,
      imageUrl,
      updatedAt: serverTimestamp(),
    });

    const category = (
      await getDoc(doc(db, "stores", storeId, "categories", categoryId))
    ).data() as Category;

    return NextResponse.json(category);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// DELETE: Delete a category for the given store
export const DELETE = async (
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      categoryId: string;
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

    if (!params.categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    const storeId = params.storeId;
    const store = await getDoc(doc(db, "stores", storeId));

    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    if (store.data().userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const categoryId = params.categoryId;
    const categoryRef = await getDoc(
      doc(db, "stores", storeId, "categories", categoryId)
    );

    if (!categoryRef.exists()) {
      return new NextResponse("Category not found", { status: 404 });
    }

    await deleteDoc(doc(db, "stores", storeId, "categories", categoryId));

    return new NextResponse("Category deleted successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
