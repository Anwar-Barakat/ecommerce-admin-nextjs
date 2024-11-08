import React from 'react'
import BillboardClient from './components/client'

const Billboards = () => {
  return (
      <div className='flex flex-col w-full'>
          <div className='flex flex-1 space-x-4 p-8 pt-6'>
              <BillboardClient />
          </div>
    </div>
  )
}

export default Billboards
