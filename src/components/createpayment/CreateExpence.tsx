'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createExpenseAndUpdateBalances } from "@/action/actions";

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

const Createpayment = (params: any) => {
    const teamId = params.teamid.params.team;
    const creatorId = typeof window !== 'undefined' ? localStorage.getItem('id') || '' : '';

    const router = useRouter();
    // const [admin, setAdmin] = useState(false);
    const [amount, setAmount] = useState<number>(0);
    const [expenseTitle, setExpenseTitle] = useState<string>("");
    const [message, setMessage] = useState<string>('');

   

    const handleExpenseTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExpenseTitle(event.target.value);
    };

    const handleSubmit = async () => {
        console.log(creatorId);
        console.log(creatorId);
        console.log(creatorId);
        console.log(creatorId);
        try {
            const response = await createExpenseAndUpdateBalances(creatorId, teamId, expenseTitle, amount);
            if (response) {
                setAmount(0);
                setExpenseTitle('');
                setMessage('Expense successfully created!');
                router.refresh();
            } else {
                setMessage("User not verified or there might be an issue. Please contact support at asrweb7@gmail.com.");
            }
        } catch (err) {
            console.log(err);
            setMessage("An error occurred. Please try again.");
        }
    };

   


    return (
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Create a New Expense</h1>
        {true ? (
            <div className="flex flex-col items-center space-y-6">
                <input
                    type="text"
                    value={expenseTitle}
                    className="w-full max-w-xs px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    placeholder="Enter Expense Title"
                    onChange={handleExpenseTitleChange}
                />
                <input
                    type="number"
                    value={amount}
                    className="w-full max-w-xs px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    placeholder="Enter Amount"
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                />
                <button
                    className="w-full max-w-xs px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        ) : (
            <div className="text-center text-lg font-semibold text-red-600">
                <p>You don't have access to add expenses</p>
            </div>
        )}
        {message && (
            <div className="mt-6 text-center text-lg font-semibold text-green-600">
                {message}
            </div>
        )}
    </div>
);
};

export default Createpayment;
