import { Store } from "@/app/models/store";
import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    
    const body = await req.json();
    if (!params.storeId) return new NextResponse("Store ID is required", { status: 400 });
    if(!body.name) return new NextResponse("Name is required", { status: 400 });


    const storeRef = doc(db, "stores", params.storeId);
    await updateDoc(storeRef, { name: body.name });
    
    return new NextResponse("Store updated successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth(); // Get the authenticated user ID

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 }); // Return 401 if user is not authenticated
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 }); // Return 400 if store ID is missing
    }

    const storeRef = doc(db, "stores", params.storeId); // Get a reference to the store document
    await deleteDoc(storeRef); // Delete the store document

    return new NextResponse("Store deleted successfully", { status: 200 }); // Return 200 if deletion is successful
  } catch (error) {
    console.log(error); // Log any errors
    return new NextResponse("Internal Server Error", { status: 500 }); // Return 500 if an error occurs
  }
};
