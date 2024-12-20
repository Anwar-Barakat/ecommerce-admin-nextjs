import { Size } from "@/app/models/size";
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

// PATCH: Update a size for the given store
export const PATCH = async (
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      sizeId: string;
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

    if (!params.sizeId) {
      return new NextResponse("Size ID is required", { status: 400 });
    }

    const storeId = params.storeId;
    const store = await getDoc(doc(db, "stores", storeId));

    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    if (store.data().userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const sizeId = params.sizeId;
    const sizeRef = await getDoc(
      doc(db, "stores", storeId, "sizes", sizeId)
    );

    if (!sizeRef.exists()) {
      return new NextResponse("Size not found", { status: 404 });
    }

    await updateDoc(doc(db, "stores", storeId, "sizes", sizeId), {
      ...sizeRef.data(),
      name,
      value,
      updatedAt: serverTimestamp(),
    });

    const size = (
      await getDoc(doc(db, "stores", storeId, "sizes", sizeId))
    ).data() as Size;

    return NextResponse.json(size);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// DELETE: Delete a size for the given store
export const DELETE = async (
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      sizeId: string;
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

    if (!params.sizeId) {
      return new NextResponse("Size ID is required", { status: 400 });
    }

    const storeId = params.storeId;
    const store = await getDoc(doc(db, "stores", storeId));

    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    if (store.data().userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const sizeId = params.sizeId;
    const sizeRef = await getDoc(
      doc(db, "stores", storeId, "sizes", sizeId)
    );

    if (!sizeRef.exists()) {
      return new NextResponse("Size not found", { status: 404 });
    }

    await deleteDoc(doc(db, "stores", storeId, "sizes", sizeId));

    return new NextResponse("Size deleted successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
