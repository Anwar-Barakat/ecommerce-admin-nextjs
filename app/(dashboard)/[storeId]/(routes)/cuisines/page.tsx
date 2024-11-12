import React from 'react'
import { collection, doc, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { CuisineColumns } from './_components/columns'
import { format } from 'date-fns'
import CuisineClient from './_components/client'
import { Cuisine } from '@/app/models/cuisine'

interface CuisineProps {
  params: {
    storeId: string
  }
}

const CuisinesPage = async (
  { params }: CuisineProps
) => {


  const cuisinesData = (
    await getDocs(
      collection(doc(db, 'stores', params.storeId), 'cuisines')
    )
  ).docs.map(doc => doc.data()) as Cuisine[]

  const formattedCuisines: CuisineColumns[] = cuisinesData.map(cuisine => {
    return {
      id: cuisine.id,
      name: cuisine.name,
      value: cuisine.value,
      createdAt: cuisine.createdAt ? format(cuisine.createdAt.toDate(), 'dd/MM/yyyy') : '',
    }
  })

  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-1 space-x-4 p-8 pt-6'>
        <CuisineClient data={formattedCuisines} />
      </div>
    </div>
  )
}

export default CuisinesPage
