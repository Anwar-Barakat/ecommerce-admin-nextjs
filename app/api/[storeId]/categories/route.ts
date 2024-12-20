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

// GET: Fetch all categories for the given store
export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const CategoryData = (
      await getDocs(collection(db, "stores", params.storeId, "categories"))
    ).docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(CategoryData);
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

    const { name, billboardId, billboardLabel } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    if (!billboardLabel) {
      return new NextResponse("Billboard Label is required", { status: 400 });
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

    const categoryData = {
      name,
      billboardId,
      billboardLabel,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const categoryRef = await addDoc(
      collection(db, "stores", storeId, "categories"),
      categoryData
    );

    await updateDoc(categoryRef, { id: categoryRef.id });

    return NextResponse.json({ id: categoryRef.id, ...categoryData });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
