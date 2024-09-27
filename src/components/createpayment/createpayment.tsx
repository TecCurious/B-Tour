'use client';

import React, { useEffect, useState } from "react";
import FindMembers from "../Fetchdata/findmembers";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import PaymentEntry from "./paymententry";
import { useRouter } from "next/navigation";

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
    const teamid = params.teamid.params.team;
    const user = useSelector((state: RootState) => state.userState.user);
    const mememail = user ? user : "";
    const router = useRouter();

    const [teammembers, setTeammembers] = useState<TeamMember[] | string>([]);
    const [admin, setAdmin] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [message, setMessage] = useState<string>('');

    const handleEmailChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedEmail(event.target.value);
    };

    const handlesubmit = async (teamid: string, mememail: string, amount: number) => {
        try {
            const response = await PaymentEntry(teamid, mememail, amount);
            if (response === true) {
                setAmount(0);
                setSelectedEmail('');
                setMessage('Payment successfully created!');
                router.refresh();
            } else {
                setMessage("User not verified or there might be an issue. Please contact support at asrweb7@gmail.com.");
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const verifyUser = async () => {
            const teammem = await FindMembers(mememail, teamid);
            setTeammembers(teammem);
        };
        verifyUser();
    }, [mememail, teamid]);

    useEffect(() => {
        if (Array.isArray(teammembers)) {
            teammembers.forEach((mem) => {
                if (mem.mememail === mememail && mem.memrole === "admin") {
                    setAdmin(true);
                }
            });
        }
    }, [teammembers, mememail]);

    return (
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Create a New Expense</h1>
            {admin ? (
                <div className="flex flex-col items-center space-y-6">
                    <input
                        type="number"
                        value={amount}
                        className="w-full max-w-xs px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        placeholder="Enter Amount"
                        onChange={(e) => setAmount(parseInt(e.target.value))}
                    />
                    <select
                        id="emailDropdown"
                        value={selectedEmail}
                        onChange={handleEmailChange}
                        className="w-full max-w-xs px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    >
                        <option value="">Select an email</option>
                        {Array.isArray(teammembers) && teammembers.map((teamMember) => (
                            <option key={teamMember.mememail} value={teamMember.mememail}>
                                {teamMember.mememail}
                            </option>
                        ))}
                    </select>

                    <button
                        className="w-full max-w-xs px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500"
                        onClick={() => handlesubmit(teamid, selectedEmail, amount)}
                    >
                        Submit
                    </button>
                </div>
            ) : (
                <div className="text-center text-lg font-semibold text-red-600">
                    <p>You don't have access to add payments</p>
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
