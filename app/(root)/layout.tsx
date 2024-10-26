import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/navigation";
import { Store } from "../models/store";

interface SetupLayoutProps {
    children: React.ReactNode;
}

const SetupLayout = async ({ children }: SetupLayoutProps) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/sign-in");
    }

    const storeSnap = await getDocs(
        query(collection(db, "stores"), where("userId", "==", userId))
    )

    let store = null as any;

    storeSnap.forEach(doc => {
        store = doc.data() as Store;
        return;
    });

    if (store) {
        redirect(`/${store?.id}`);
    }


    return (<div className="flex items-center justify-center h-full">
        {children}
    </div>);
}

export default SetupLayout;