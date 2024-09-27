import React from 'react'

export const Navbar = () => {
  return (
    <div><nav className="flex justify-between  px-4 cursor-pointer py-4 shadow-md">
    <div>
      {/* <Link href={"/"}>
        <Image src="/image/logo/g10.jpg" alt="Logo" height={60} width={60} />
      </Link> */}
    </div>
    <div className="hover:text-[#2d517d] ">
      <div className="hidden lg:flex ">
        <ul className="flex font-bold px-4 cursor-pointer text-[#1B3A60]  ">
          <li className="px-4">
            {/* <Link href={"/"}>Home</Link> */}
          </li>
          <li className="px-4">About us</li>
          <li className="px-4">Contact us</li>
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
