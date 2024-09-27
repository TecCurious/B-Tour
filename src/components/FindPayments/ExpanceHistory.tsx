'use client'

import React, { useEffect, useState } from "react";
import FindMembers from "../Fetchdata/findmembers";
import Fetchpayments from "../Fetchdata/fetchpayments";

interface TeamMember {
    id: string;
    teamid: string;
    teamname: string;
    memid: string;
    memname: string;
    mememail: string;
    memphone: string;
    memrole: string;
    isverfied: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface Payment {
    id: string;
    teamid: string;
    teamname: string;
    creatememid: string;
    memname: string;
    mememail: string;
    amount: number;
    createdAt: Date;
}

const Findpayments = (params: any) => {
    const teamid = params.teamid.params.team;
    
    // Get the email from localStorage
    const [mememail, setMemEmail] = useState<string>("");
    const [payments, setPayments] = useState<Payment[] | string>([]);
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        // Retrieve email from localStorage
        const email = localStorage.getItem('email') || ""; // Ensure a fallback to an empty string
        setMemEmail(email);

        const fetchData = async () => {
            const teammem = await FindMembers(email, teamid);

            if (Array.isArray(teammem)) {
                const isAdmin = teammem.some((mem) => mem.mememail === email && mem.memrole === 'admin');
                setAdmin(isAdmin);
            }

            const response = await Fetchpayments(email, teamid, admin);
            setPayments(response);
        };

        fetchData();
    }, [teamid, admin]);

    return (
        <div className="">
            <h1 className="text-[45px] m-[10px] p-[8px] text-center">
                {admin ? "Your Team Payment History" : "Your Payment History"}
            </h1>

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Payment Id</th>
                        <th className="py-2 px-4 border-b">Team Id</th>
                        <th className="py-2 px-4 border-b">Team Name</th>
                        <th className="py-2 px-4 border-b">User Email</th>
                        <th className="py-2 px-4 border-b">User Name</th>
                        <th className="py-2 px-4 border-b">Amount ( INR )</th>
                    </tr>
                </thead>
                {Array.isArray(payments) ? (
                    <>
                        {payments.map((payment) => (
                            <tbody key={payment.creatememid}>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b text-center">{payment.id}</td>
                                    <td className="py-2 px-4 border-b text-center">{payment.teamid}</td>
                                    <td className="py-2 px-4 border-b text-center">{payment.teamname}</td>
                                    <td className="py-2 px-4 border-b text-center">{payment.mememail}</td>
                                    <td className="py-2 px-4 border-b text-center">{payment.memname}</td>
                                    <td className="py-2 px-4 border-b text-center">₹ {payment.amount}</td>
                                </tr>
                            </tbody>
                        ))}
                    </>
                ) : null}
            </table>
        </div>
    );
};

export default Findpayments;
