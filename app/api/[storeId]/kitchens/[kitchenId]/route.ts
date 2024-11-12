import { Kitchen } from "@/app/models/kitchen";
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

// PATCH: Update a kitchen for the given store
export const PATCH = async (
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      kitchenId: string;
    };
  }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, value } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!params.kitchenId) {
      return new NextResponse("Kitchen ID is required", { status: 400 });
    }

    const storeId = params.storeId;
    const store = await getDoc(doc(db, "stores", storeId));

    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    if (store.data().userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const kitchenId = params.kitchenId;
    const kitchenRef = await getDoc(
      doc(db, "stores", storeId, "kitchens", kitchenId)
    );

    if (!kitchenRef.exists()) {
      return new NextResponse("Kitchen not found", { status: 404 });
    }

    await updateDoc(doc(db, "stores", storeId, "kitchens", kitchenId), {
      ...kitchenRef.data(),
      name,
      value,
      updatedAt: serverTimestamp(),
    });

    const kitchen = (
      await getDoc(doc(db, "stores", storeId, "kitchens", kitchenId))
    ).data() as Kitchen;

    return NextResponse.json(kitchen);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// DELETE: Delete a kitchen for the given store
export const DELETE = async (
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      kitchenId: string;
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

    if (!params.kitchenId) {
      return new NextResponse("Kitchen ID is required", { status: 400 });
    }

    const storeId = params.storeId;
    const store = await getDoc(doc(db, "stores", storeId));

    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    if (store.data().userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const kitchenId = params.kitchenId;
    const kitchenRef = await getDoc(
      doc(db, "stores", storeId, "kitchens", kitchenId)
    );

    if (!kitchenRef.exists()) {
      return new NextResponse("Kitchen not found", { status: 404 });
    }

    await deleteDoc(doc(db, "stores", storeId, "kitchens", kitchenId));

    return new NextResponse("Kitchen deleted successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
