'use client'

import React, { useEffect, useState } from "react"
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
    const user = useSelector((state: RootState) => state.userState.user)
    const mememail = user ? user : ""
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
                setMessage('')
                router.refresh();
            }
            else {
                setMessage("user not verified or there might be an issue try contacting our developers mail:- asrweb7@gmail.com")
            }
        }
        catch (err) {
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
        <div className="">
            <h1 className="text-[45px] m-[10px] p-[8px] text-center"> Create a Expense </h1>
            {admin ? (
                <div className="m-[60px] mt-[20px] p-[10px] text-center">
                    <input type="number" value={amount} className="border-[2px] border-black" placeholder="Enter Amount" onChange={(e) => setAmount(parseInt(e.target.value))} />
                    <select id="emailDropdown" value={selectedEmail} onChange={handleEmailChange} className="m-[8px] ml-[20px]">
                        <option value="">Select an email</option>
                        {Array.isArray(teammembers) ? (
                            <>
                                {teammembers.map((teamMember) => (
                                    <option key={teamMember.mememail} value={teamMember.mememail}>
                                        {teamMember.mememail}
                                    </option>
                                ))}
                            </>
                        ) : null}
                    </select>

                    <button className="m-[8px] ml-[20px] p-[4px] px-[10px] bg-black rounded-[6px] bg-opacity-30" onClick={() => handlesubmit(teamid, selectedEmail, amount)}>Submit</button>
                </div>
            ) : (
                <div className="">
                    <h1 className="text-[25px] text-center">You Don't have access to add Payments</h1>
                </div>
            )}
            <h1 className="text-[20px] text-center">{message}</h1>
        </div>
    );
};

export default Createpayment;