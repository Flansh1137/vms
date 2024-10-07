import React from 'react'
import cctvHOME from '../../assets/cctvHOME.jpg'

const homepage = () => {
  return (
    <>
      <div>
        <div className='w-screen h-screen flex flex-col justify-center items-center bg-cover bg-center' style={{ backgroundImage: `url(${cctvHOME})` }}>
          <div className='text-center rounded'>
            <h1 className='text-8xl pb-20 font-bold text-white'>XAIBIT</h1>
            <p className='text-5xl p-5 font-semibold bg-black bg-opacity-50 text-white'>Video Management Solution</p>
          </div>
        </div>

      </div>
    </>
  )
}

export default homepage