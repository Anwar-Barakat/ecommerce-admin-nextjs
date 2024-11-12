import { Cuisine } from "@/app/models/cuisine";
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

// PATCH: Update a cuisine for the given store
export const PATCH = async (
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      cuisineId: string;
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

    if (!params.cuisineId) {
      return new NextResponse("Cuisine ID is required", { status: 400 });
    }

    const storeId = params.storeId;
    const store = await getDoc(doc(db, "stores", storeId));

    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    if (store.data().userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cuisineId = params.cuisineId;
    const cuisineRef = await getDoc(
      doc(db, "stores", storeId, "cuisines", cuisineId)
    );

    if (!cuisineRef.exists()) {
      return new NextResponse("Cuisine not found", { status: 404 });
    }

    await updateDoc(doc(db, "stores", storeId, "cuisines", cuisineId), {
      ...cuisineRef.data(),
      name,
      value,
      updatedAt: serverTimestamp(),
    });

    const cuisine = (
      await getDoc(doc(db, "stores", storeId, "cuisines", cuisineId))
    ).data() as Cuisine;

    return NextResponse.json(cuisine);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// DELETE: Delete a cuisine for the given store
export const DELETE = async (
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      cuisineId: string;
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

    if (!params.cuisineId) {
      return new NextResponse("Cuisine ID is required", { status: 400 });
    }

    const storeId = params.storeId;
    const store = await getDoc(doc(db, "stores", storeId));

    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    if (store.data().userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cuisineId = params.cuisineId;
    const cuisineRef = await getDoc(
      doc(db, "stores", storeId, "cuisines", cuisineId)
    );

    if (!cuisineRef.exists()) {
      return new NextResponse("Cuisine not found", { status: 404 });
    }

    await deleteDoc(doc(db, "stores", storeId, "cuisines", cuisineId));

    return new NextResponse("Cuisine deleted successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
