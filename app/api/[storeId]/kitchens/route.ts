import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

// GET: Fetch all kitchens for the given store
export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const kitchenData = (
      await getDocs(collection(db, "stores", params.storeId, "kitchens"))
    ).docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(kitchenData);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// POST: Create a new kitchen for the given store
export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
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

    const storeId = params.storeId;
    const store = await getDoc(doc(db, "stores", storeId));

    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    if (store.data().userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const kitchenData = {
      name,
      value,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const kitchenRef = await addDoc(
      collection(db, "stores", storeId, "kitchens"),
      kitchenData
    );

    await updateDoc(kitchenRef, { id: kitchenRef.id });

    return NextResponse.json({ id: kitchenRef.id, ...kitchenData });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
