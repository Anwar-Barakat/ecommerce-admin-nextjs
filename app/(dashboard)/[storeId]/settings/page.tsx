import { Store } from "@/app/models/store";
import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import { doc, getDoc, getDocs } from "firebase/firestore";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";

interface SettingPageProps {
    params: {
        storeId: string;
    };
}

const SettingPage = async (
    { params }: SettingPageProps
) => {

    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const store = (await getDoc(doc(db, "stores", params.storeId))).data() as Store;

    if (!store || store.userId !== userId) {
        redirect("/");
    }
    console.log(store);
    return (<>
        <div className="flex flex-col w-full">
            <div className="flex-1 pt-6">
                <SettingsForm initialData={store} />
            </div>
        </div>
    </>);
}

export default SettingPage;