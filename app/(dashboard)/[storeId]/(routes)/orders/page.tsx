import React from 'react'
import { collection, doc, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { OrderColumns } from './_components/columns'
import { format } from 'date-fns'
import OrderClient from './_components/client'
import { Order } from '@/app/models/order'
import { formatter } from '@/lib/utils'



interface SizeProps {
  params: {
    storeId: string
  }
}

const OrdersPage = async (
  { params }: SizeProps
) => {


  const ordersData = (
    await getDocs(
      collection(doc(db, 'stores', params.storeId), 'orders')
    )
  ).docs.map(doc => doc.data()) as Order[]

  const formattedOrders: OrderColumns[] = ordersData.map(order => {
    return {
      id: order.id,
      phone: order.phone,
      address: order.address,
      products: order.orderItems?.map(item => item.name).join(', '),
      totalPrice: formatter.format(
        order.orderItems.reduce((acc, item) => {
          if(item && item.qty != undefined && item.price) {
            return acc + Number(item.qty) * Number(item.price)
          }
          return acc
        },0)
      ),
      images: order.orderItems?.map(item => item.images[0]?.url),
      isPaid: order.isPaid,
      status: order.status,
      createdAt: order.createdAt ? format(order.createdAt.toDate(), 'dd/MM/yyyy') : '',
    }
  })

  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-1 space-x-4 p-8 pt-6'>
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  )
}

export default OrdersPage
