import { UserButton } from '@clerk/nextjs'
import React from 'react'
import MainNav from './main-nav'
import StoreSwitcher from './store-switcher'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Store } from '@/app/models/store'

const Navbar = async () => {
    const { userId } = auth()

    if (!userId) {
        return redirect('/sign-in')
    }

    const storeSnap = await getDocs(
        query(collection(db, 'stores'), where('userId', '==', userId))
    )

    const stores = [] as Store[]

    storeSnap.forEach((doc) => {
        stores.push(doc.data() as Store)
    })

    return (
        <div className='border-b'>
            <div className='flex h-16 items-center container m-auto'>
                <StoreSwitcher item={stores} />

                <MainNav />

                <div className='ml-auto'>
                    <UserButton afterSignOutUrl='/' />
                </div>
            </div>
        </div>
    )
}

export default Navbar