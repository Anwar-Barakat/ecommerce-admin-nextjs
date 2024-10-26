import { Store } from "@/app/models/store";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface DashboardOverviewProps {
    params: { storeId: string; };
}

const DashboardOverview = async ({ params }: DashboardOverviewProps) => {
    const store = (await getDoc(doc(db, "stores", params.storeId))).data() as Store;
    return (
        <div>
            <h1>Dashboard Overview</h1>
            <p>Store ID: {params.storeId}</p>
            <p>Store Name: {store.name}</p>
        </div>
    );
}

export default DashboardOverview;