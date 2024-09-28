"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export const Navbar = () => {
  const [isLogin, setIsLogin] = useState(false); 
  useEffect(() => {
    const email = typeof window !== 'undefined' ? localStorage.getItem('email') || '' : '';
    if (email) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []); // This will only run once after the component mounts

  return (
    <div><nav className="flex justify-between  px-4 cursor-pointer py-4 shadow-md">
    <div>
      <Link href={"/"}>
      <div className="text-xl font-bold uppercase tracking-wider relative group cursor-pointer">
        <span className="text-gray-800">B</span>
        <span className="text-blue-500">Tour</span>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></div>
      </div>
      </Link>
    </div>
    <div className="hover:text-[#2d517d] ">
      <div className="hidden lg:flex ">
        <ul className="flex font-bold px-4 cursor-pointer text-[#1B3A60]  ">
          <li className="px-4">
            <Link href={"/"}>Home</Link>
          </li>
          <li className="px-4">Home</li>
          <li className="px-4">About us</li>
         { isLogin && <li className="px-4"><Link href={"/dashboard"}>Dashboard</Link></li>}
        </ul>
      </div>

      <div className="hover:text-[#2d517d] lg:hidden">
        <ul className="flex font-bold px-4 cursor-pointer text-[#1B3A60]  ">
          <li className="px-4">
            {/* <Link href={"/"}>Home</Link> */}
          </li>

          <li className="px-4">About us</li>
          <li className="px-4">Contact us</li>
        </ul>
      </div>
    </div>
  </nav></div>
  )
}
