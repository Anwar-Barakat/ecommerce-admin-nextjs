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

// GET: Fetch all billboards for the given store
export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const billboardData = (
      await getDocs(collection(db, "stores", params.storeId, "billboards"))
    ).docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(billboardData);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// POST: Create a new billboard for the given store
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

    const storeId = params.storeId;
    const store = await getDoc(doc(db, "stores", storeId));

    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    if (store.data().userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const billboardData = {
      label,
      imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const billboardRef = await addDoc(
      collection(db, "stores", storeId, "billboards"),
      billboardData
    );

    await updateDoc(billboardRef, { id: billboardRef.id });

    return NextResponse.json({ id: billboardRef.id, ...billboardData });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
