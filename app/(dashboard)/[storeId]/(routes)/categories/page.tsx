import React from 'react'
import { collection, doc, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { CategoryColumns } from './_components/columns'
import { format } from 'date-fns'
import { Category } from '@/app/models/category'
import CategoryClient from './_components/client'


interface CategoryProps {
  params: {
    storeId: string
  }
}

const CategoriesPage = async (
  { params }: CategoryProps
) => {


  const categoriesData = (
    await getDocs(
      collection(doc(db, 'stores', params.storeId), 'categories')
    )
  ).docs.map(doc => doc.data()) as Category[]

  const formattedCategories: CategoryColumns[] = categoriesData.map(billboard => {
    return {
      id: billboard.id,
      name: billboard.name,
      billboardLabel: billboard.billboardLabel,
      createdAt: billboard.createdAt ? format(billboard.createdAt.toDate(), 'dd/MM/yyyy') : '',
    }
  })

  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-1 space-x-4 p-8 pt-6'>
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  )
}

export default CategoriesPage
