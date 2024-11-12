import React from 'react'
import { collection, doc, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { format } from 'date-fns'
import ProductClient from './_components/client'
import { Product } from '@/app/models/product'
import { ProductColumns } from './_components/columns'
import { formatter } from '@/lib/utils'



interface ProductProps {
  params: {
    storeId: string
  }
}

const ProductsPage = async (
  { params }: ProductProps
) => {


  const productsData = (
    await getDocs(
      collection(doc(db, 'stores', params.storeId), 'products')
    )
  ).docs.map(doc => doc.data()) as Product[]

  const formattedProducts: ProductColumns[] = productsData.map(product => {
    return {
      id: product.id,
      name: product.name,
      price: formatter.format(product.price),
      isFeatured: product.isFeatured,
      isArchived: product.isArchived,
      category: product.category,
      size: product.size,
      kitchen: product.kitchen,
      cuisine: product.cuisine,
      images : product.images,
      createdAt: product.createdAt ? format(product.createdAt.toDate(), 'dd/MM/yyyy') : '',
    }
  })

  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-1 space-x-4 p-8 pt-6'>
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  )
}

export default ProductsPage
