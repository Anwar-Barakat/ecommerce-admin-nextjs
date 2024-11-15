import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import { Store } from "@/app/models/store";

interface DashboardLayoutProps {
    children: React.ReactNode;
    params: {
        storeId: string;
    };
}

const DashboardLayout = async ({ children, params }: DashboardLayoutProps) => {
    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const storeSnap = await getDocs(
        query(
            collection(db, "stores"),
            where("userId", "==", userId),
            where("id", "==", params.storeId)
        )
    );

    let store;

    storeSnap.forEach((doc) => {
        store = {
            id: doc.id,
            ...doc.data(),
        } as Store;
    });

    if (!store) {
        redirect("/");
    }

    return (
        <div>
            <Navbar />
            <div className="flex items-center container m-auto">
                {children}
            </div>
        </div>
    );
}

export default DashboardLayout;