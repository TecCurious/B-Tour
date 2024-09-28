import Findpayments from "@/components/FindPayments/ExpanceHistory";
import Seeteammembers from "@/components/Teamdetails/seeteammembers";
import Createpayment from "@/components/createpayment/CreateExpence";
import Link from "next/link";
import React from "react";

const Teamdetail = (params: any) => {
    return (
        <div >
            <Link href={"/dashboard"}>
            <div>Cancel</div>
            </Link>
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6">Team Details</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <Seeteammembers teamid={params} />
            </div>
            <hr className="border-black border-[2px] my-6" />
            
            <div className="flex ">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <Createpayment teamid={params} />
            </div>
       

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                {/* <Transactions teamid={params} /> */}
            </div>
            </div>
            <hr className="border-black border-[2px] my-6" />

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <Findpayments teamid={params} />
            </div>
        </div>
        </div>
    );
}

export default Teamdetail;
