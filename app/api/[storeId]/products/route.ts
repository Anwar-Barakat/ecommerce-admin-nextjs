import { Product } from "@/app/models/product";
import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
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

    // get the search params from the req.url
    const { searchParams } = new URL(req.url);
    const productRef = collection(doc(db, "stores", params.storeId), "products");

    let productQuery;
    const queryConstraints = [];

    // construct the query constraints based on the search params
    if (searchParams.has("size")) {
      queryConstraints.push(
        where("size", "==", searchParams.get("size"))
      );
    }

    if (searchParams.has("category")) {
      queryConstraints.push(
        where("category", "==", searchParams.get("category"))
      );
    }

    if (searchParams.has("kitchen")) {
      queryConstraints.push(
        where("kitchen", "==", searchParams.get("kitchen"))
      );
    }

    if (searchParams.has("cuisine")) {
      queryConstraints.push(
        where("cuisine", "==", searchParams.get("cuisine"))
      );
    }

    if (searchParams.has("isFeatured")) {
      queryConstraints.push(
        where("isFeatured", "==", searchParams.get("isFeatured") === "true" ? true : false)
      );
    }

    if (searchParams.has("isArchived")) {
      queryConstraints.push(
        where("isArchived", "==", searchParams.get("isArchived") === "true" ? true : false)
      );
    }

    if(queryConstraints.length >0){
      productQuery = query(productRef, and(...queryConstraints));
    }

    const productQuerySnapshot = await getDocs(productQuery || productRef);

    const productData : Product[] = productQuerySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() }  as Product;
    });

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
