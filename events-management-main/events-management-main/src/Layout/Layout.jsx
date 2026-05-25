import React from 'react'
import Navbar from '../Component/Navbar'
import Footer from '../Component/Footer'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
<>
     
     <Navbar/>
          
          <div className=' container mx-auto py-4 '>
               <Outlet/>
          </div>

     <Footer/>

   
</>  )
}
