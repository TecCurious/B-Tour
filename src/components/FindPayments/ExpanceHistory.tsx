'use client'

import React, { useEffect, useState } from "react";
import { getTeamExpensesWithDetails } from "@/action/actions";


interface Expense {
  id: string;                // Unique ID for the expense
  title: string;             // Title or description of the expense
  amount: number;            // Amount of the expense
  createdAt: Date;           // Date when the expense was created
  updatedAt: Date;           // Date when the expense was last updated
  teamId: string;            // ID of the team associated with this expense
  creatorId: string;         // ID of the team member who created the expense
  team: {                    // Object representing the team this expense is associated with
    id: string;
    name: string;
  };
  creator: {                 // Object representing the team member who created the expense
    id: string;
    userId: string;
    teamId: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  shares: ExpenseShare[];    // Array of shares associated with the expense
}

interface ExpenseShare {
  id: string;                // Unique ID for the expense share
  userId: string;            // ID of the user responsible for this share
  amount: number;            // Amount of the share
  paid: boolean;             // Whether the share has been paid
  expenseId: string;         // ID of the associated expense
}

const Findpayments = (params: any) => {
    const teamid = params.teamid.params.team;
    
    // Get the email from localStorage
    const [mememail, setMemEmail] = useState<string>("");
    const [payments, setPayments] = useState<any>([]);
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        // Retrieve email from localStorage
        const email = localStorage.getItem('email') || ""; // Ensure a fallback to an empty string
        setMemEmail(email);

        const fetchData = async () => {
            // const teammem = await FindMembers(email, teamid);

            // if (Array.isArray(teammem)) {
            //     const isAdmin = teammem.some((mem) => mem.mememail === email && mem.memrole === 'admin');
            //     setAdmin(isAdmin);
            // }

            const response = await getTeamExpensesWithDetails(teamid);
            setPayments(response);
            console.log(response);
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
                        <th className="py-2 px-4 border-b">Payment Title</th>
                        <th className="py-2 px-4 border-b">Team Name</th>
                        <th className="py-2 px-4 border-b">Member Name</th>
                        <th className="py-2 px-4 border-b">Member Email</th>
                        <th className="py-2 px-4 border-b">Amount ( INR )</th>
                    </tr>
                </thead>
                {Array.isArray(payments) ? (
                    <>
                        {payments.map((payment) => (
                            <tbody key={payment.creatememid}>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b text-center">{payment.id}</td>
                                    <td className="py-2 px-4 border-b text-center">{payment.title}</td>
                                    <td className="py-2 px-4 border-b text-center">{payment.team.name}</td>
                                    <td className="py-2 px-4 border-b text-center">{payment.creator.user.name}</td>
                                    <td className="py-2 px-4 border-b text-center">{payment.creator.user.email}</td>
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
