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

// GET: Fetch all sizes for the given store
export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const sizeData = (
      await getDocs(collection(db, "stores", params.storeId, "sizes"))
    ).docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(sizeData);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// POST: Create a new category for the given store
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

    const sizeData = {
      name,
      value,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const sizeRef = await addDoc(
      collection(db, "stores", storeId, "sizes"),
      sizeData
    );

    await updateDoc(sizeRef, { id: sizeRef.id });

    return NextResponse.json({ id: sizeRef.id, ...sizeData });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
