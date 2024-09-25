import Findpayments from "@/components/FindPayments/finpayments";
import Seeteammembers from "@/components/Teamdetails/seeteammembers";
import Createpayment from "@/components/createpayment/createpayment";
import Transactions from "@/components/dues/transactiondue";
import React from "react";

const Teamdetail = (params:any) => {
    return(
        <div className="">
            <Seeteammembers teamid={params}/>
            <hr className="border-black border-[2px] mt-[40px]"/>
            <Createpayment teamid = {params}/>
            <hr className="border-black border-[2px] mt-[40px]"/>
            <Transactions teamid = {params} />
            <hr className="border-black border-[2px] mt-[40px]"/>
            <Findpayments teamid={params} />
        </div>
    )
}

export default Teamdetail;