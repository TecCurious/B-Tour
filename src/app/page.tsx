import Link from "next/link";
import React from "react";

export default async function Home() {
  return(
    <div className="Home">
      <Link href={'/signup'}>
        <button className="m-[100px] p-[20px] border-[4px] border-black hover:bg-black hover:bg-opacity-30">SignUp page</button>
      </Link>
      <br/>
      <Link href={'/signin'}>
        <button className="m-[100px] p-[20px] border-[4px] border-black hover:bg-black hover:bg-opacity-30">SignIn page</button>
      </Link>
    </div>
  )
}