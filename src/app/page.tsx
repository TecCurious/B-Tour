import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function Home() {
  return(
    // <div className="Home">
    //   <Link href={'/signup'}>
    //     <button className="m-[100px] p-[20px] border-[4px] border-black hover:bg-black hover:bg-opacity-30">SignUp page</button>
    //   </Link>
    //   <br/>
    //   <Link href={'/signin'}>
    //     <button className="m-[100px] p-[20px] border-[4px] border-black hover:bg-black hover:bg-opacity-30">SignIn page</button>
    //   </Link>

    // </div>
        // </>
         <>
         <div className="flex flex-col md:flex-row-reverse justify-between py-[6%] px-[10%] ">
           <div className=" px-3">
             <Image
               src="/image/bt.jpg"
               alt="Logo"
               height={500}
               width={500}
               className=" rounded-3xl mt-3"
             />
           </div>
   
           <div className="text-[#1B3A60] my-3 w-full md:w-[40%]">
             <h1 className=" font-bold text-[15px] ml-3">
             Trusted Leader in Travel Expense Splitting
             </h1>
             <h1 className=" font-bold text-[30px] py-3">
               #1 Fair Travel Expense Splitting
               {/* <Typewriter text="Across the World" /> */}
             </h1>
             <p className=" py-3">
             Effortlessly manage travel expenses with our money-splitting tool. Keep track of shared costs, divide expenses fairly among friends, and enjoy stress-free trips without worrying about who owes what.
             </p>
             
             <div className="flex  items-center w-[100%] my-2">
               {/* <select
                 className="border border-gray-300  text-[14px] text-[#1B3A60] p-2  rounded "
                 onChange={handleCountrySelect}
                 value={selectedCountryId || ""}
               >
                 <option value="">Select a country</option>
                 {data.map((country) => (
                   <option key={country.id} value={country.id}>
                     {country.name}
                   </option>
                 ))}
               </select>
               <Button
                 className="ml-2 bg-[#1B3A60] "
                 onClick={handleSubmit}
                 disabled={!selectedCountryId}
               >
                 Get Started
               </Button> */}
                <Link href={'/signup'}>
         <button className="py-2 px-5 bg-green-700 text-white border rounded-full">Get Started</button>
       </Link>
       <br/>
    {/* <Link href={'/signin'}>
        <button className="py-1 px-3 mx-3 bg-green-700 text-white border rounded-full">SignIn page</button>
      </Link> */}
             </div>
           </div>
         </div>
   
         <div className="flex bg-[#1B3A60] h-[100px] justify-between px-4"></div>
       </>
  )
}