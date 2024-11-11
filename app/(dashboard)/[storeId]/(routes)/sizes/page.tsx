import React from 'react'
import { collection, doc, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { SizeColumns } from './_components/columns'
import { format } from 'date-fns'
import SizeClient from './_components/client'
import { Size } from '@/app/models/size'



interface SizeProps {
  params: {
    storeId: string
  }
}

const SizesPage = async (
  { params }: SizeProps
) => {


  const sizesData = (
    await getDocs(
      collection(doc(db, 'stores', params.storeId), 'sizes')
    )
  ).docs.map(doc => doc.data()) as Size[]

  const formattedSizes: SizeColumns[] = sizesData.map(size => {
    return {
      id: size.id,
      name: size.name,
      value: size.value,
      createdAt: size.createdAt ? format(size.createdAt.toDate(), 'dd/MM/yyyy') : '',
    }
  })

  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-1 space-x-4 p-8 pt-6'>
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  )
}

export default SizesPage
