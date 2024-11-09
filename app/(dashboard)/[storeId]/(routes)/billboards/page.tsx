import React from 'react'
import BillboardClient from './_components/client'
import { collection, doc, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Billboard } from '@/app/models/billboard'
import { BillboardColumns } from './_components/columns'
import { format } from 'date-fns'


interface BillboardProps {
  params: {
    storeId: string
  }
}

const BillboardsPage = async (
  { params }: BillboardProps
) => {


  const billBoardsData = (
    await getDocs(
      collection(doc(db, 'stores', params.storeId), 'billboards')
    )
  ).docs.map(doc => doc.data()) as Billboard[]

  const formattedBillboards: BillboardColumns[] = billBoardsData.map(billboard => {
    return {
      id: billboard.id,
      label: billboard.label,
      imageUrl: billboard.imageUrl,
      createdAt: billboard.createdAt ? format(billboard.createdAt.toDate(), 'dd/MM/yyyy') : '',
    }
  })

  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-1 space-x-4 p-8 pt-6'>
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  )
}

export default BillboardsPage
