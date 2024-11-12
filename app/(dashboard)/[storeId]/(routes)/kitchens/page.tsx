import React from 'react'
import { collection, doc, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { KitchenColumns } from './_components/columns'
import { format } from 'date-fns'
import { Kitchen } from '@/app/models/kitchen'
import KitchenClient from './_components/client'

interface KitchenProps {
  params: {
    storeId: string
  }
}

const KitchensPage = async (
  { params }: KitchenProps
) => {


  const kitchensData = (
    await getDocs(
      collection(doc(db, 'stores', params.storeId), 'kitchens')
    )
  ).docs.map(doc => doc.data()) as Kitchen[]

  const formattedKitchens: KitchenColumns[] = kitchensData.map(kitchen => {
    return {
      id: kitchen.id,
      name: kitchen.name,
      value: kitchen.value,
      createdAt: kitchen.createdAt ? format(kitchen.createdAt.toDate(), 'dd/MM/yyyy') : '',
    }
  })

  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-1 space-x-4 p-8 pt-6'>
        <KitchenClient data={formattedKitchens} />
      </div>
    </div>
  )
}

export default KitchensPage
