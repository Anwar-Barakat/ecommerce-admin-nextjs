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

// GET: Fetch all products for the given store
export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const productData = (
      await getDocs(collection(db, "stores", params.storeId, "products"))
    ).docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(productData);
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

    const {
      name,
      price,
      qty,
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

    const storeId = params.storeId;
    const store = await getDoc(doc(db, "stores", storeId));

    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    if (store.data().userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const productData = {
      name,
      price,
      images,
      isFeatured: isFeatured || false,
      isArchived: isArchived || false,
      category,
      size,
      qty: qty || 0,
      kitchen,
      cuisine,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const productRef = await addDoc(
      collection(db, "stores", storeId, "products"),
      productData
    );

    await updateDoc(productRef, { id: productRef.id });

    return NextResponse.json({ id: productRef.id, ...productData });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
