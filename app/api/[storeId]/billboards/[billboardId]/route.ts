import { Billboard } from "@/app/models/billboard";
import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

// PATCH: Update a billboard for the given store
export const PATCH = async (
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      billboardId: string;
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

    if (!params.billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    const storeId = params.storeId;
    const store = await getDoc(doc(db, "stores", storeId));

    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    if (store.data().userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const billboardId = params.billboardId;
    const billboardRef = await getDoc(
      doc(db, "stores", storeId, "billboards", billboardId)
    );

    if (!billboardRef.exists()) {
      return new NextResponse("Billboard not found", { status: 404 });
    }

    await updateDoc(doc(db, "stores", storeId, "billboards", billboardId), {
      ...billboardRef.data(),
      label,
      imageUrl,
      updatedAt: serverTimestamp(),
    });

    const billboard = (
      await getDoc(doc(db, "stores", storeId, "billboards", billboardId))
    ).data() as Billboard;

    return NextResponse.json(billboard);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// DELETE: Delete a billboard for the given store
export const DELETE = async (
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      billboardId: string;
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

    if (!params.billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    const storeId = params.storeId;
    const store = await getDoc(doc(db, "stores", storeId));

    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    if (store.data().userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const billboardId = params.billboardId;
    const billboardRef = await getDoc(
      doc(db, "stores", storeId, "billboards", billboardId)
    );

    if (!billboardRef.exists()) {
      return new NextResponse("Billboard not found", { status: 404 });
    }

    await deleteDoc(doc(db, "stores", storeId, "billboards", billboardId));

    return new NextResponse("Billboard deleted successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
