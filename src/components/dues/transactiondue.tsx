'use client'

import React, { useEffect, useState } from "react";
import FindMembers from "../Fetchdata/findmembers";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import DueEntry from "./createdue";

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

const Transactions = (params: any) => {
    const teamid = params.teamid.params.team;
    const user = useSelector((state: RootState) => state.userState.user);
    const mememail = user ? user : "";
    const router = useRouter();

    const [teammembers, setTeammembers] = useState<TeamMember[] | string>([]);
    const [admin, setAdmin] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const [paymenttype, setPaymenttype] = useState('recive');

    // Handle email selection change
    const handleEmailChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedEmail(event.target.value);
    };

    // Handle submission of the form
    const handleSubmit = async (teamid: string, mememail: string, selectedEmail: string, amount: number, paymenttype: string) => {
        try {
            const res = await DueEntry(teamid, mememail, selectedEmail, amount, paymenttype);

            if (res === true) {
                resetForm();
                router.refresh();
            } else {
                setMessage("User not verified or there might be an issue. Try contacting our developers: asrweb7@gmail.com");
            }
        } catch (err) {
            console.log(err);
        }
    };

    // Reset form after successful submission
    const resetForm = () => {
        setAmount(0);
        setPaymenttype('recive');
        setSelectedEmail('');
    };

    // Fetch team members on initial load
    useEffect(() => {
        const fetchMembers = async () => {
            const teammem = await FindMembers(mememail, teamid);
            setTeammembers(teammem);
        };
        fetchMembers();
    }, [mememail, teamid]);

    // Check if the current user is an admin
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
        <div className="p-[20px]">
            <h1 className="text-[45px] m-[10px] p-[8px] text-center">Create a Payment</h1>

            {/* Payment Type Buttons */}
            <div className="text-center">
                <button
                    className={`m-[10px] p-[20px] border-[4px] border-black hover:bg-black hover:bg-opacity-30 ${paymenttype === 'recive' ? "bg-black bg-opacity-30" : ""}`}
                    onClick={() => setPaymenttype('recive')}
                >
                    Receive
                </button>
                <button
                    className={`m-[10px] p-[20px] border-[4px] border-black hover:bg-black hover:bg-opacity-30 ${paymenttype === 'send' ? "bg-black bg-opacity-30" : ""}`}
                    onClick={() => setPaymenttype('send')}
                >
                    Send
                </button>
            </div>

            {/* Admin Access Section */}
            {admin ? (
                <div className="m-[60px] mt-[20px] p-[10px] text-center">
                    {/* Amount Input */}
                    <input
                        type="number"
                        value={amount}
                        className="border-[2px] border-black p-[5px] rounded-[4px]"
                        placeholder="Enter Amount"
                        onChange={(e) => setAmount(parseInt(e.target.value))}
                    />

                    {/* Email Dropdown */}
                    <select
                        id="emailDropdown"
                        value={selectedEmail}
                        onChange={handleEmailChange}
                        className="m-[8px] ml-[20px] p-[5px] border-[2px] border-black rounded-[4px]"
                    >
                        <option value="">Select an email</option>
                        {Array.isArray(teammembers) && teammembers.map((teamMember) => (
                            <option key={teamMember.memname} value={teamMember.mememail}>
                                {teamMember.mememail}
                            </option>
                        ))}
                    </select>

                    {/* Submit Button */}
                    <button
                        className="m-[8px] ml-[20px] p-[10px] bg-black text-white rounded-[6px] hover:bg-opacity-80"
                        onClick={() => handleSubmit(teamid, mememail, selectedEmail, amount, paymenttype)}
                    >
                        Submit
                    </button>
                </div>
            ) : (
                <div className="text-center">
                    <h1 className="text-[25px]">You don't have access to add payments.</h1>
                </div>
            )}

            {/* Error or Success Message */}
            {message && (
                <h1 className="text-[20px] text-center text-red-500">{message}</h1>
            )}
        </div>
    );
};

export default Transactions;
