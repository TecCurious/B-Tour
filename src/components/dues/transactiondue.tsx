'use client'

import React, { useEffect, useState } from "react"
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
    const user = useSelector((state: RootState) => state.userState.user)
    const mememail = user ? user : ""
    const router = useRouter();

    const [teammembers, setTeammembers] = useState<TeamMember[] | string>([]);
    const [admin, setAdmin] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const [paymenttype, setPaymenttype] = useState('recive');

    const handleEmailChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedEmail(event.target.value);
    };

    const handlesubmit = async (teamid: string, mememail: string,selectedEmail:string, amount: number, paymenttype:string) => {
        try {
            const res = await DueEntry(teamid,mememail,selectedEmail,amount,paymenttype);

            if (res === true) {
                setAmount(0);
                setPaymenttype('recive');
                setSelectedEmail('');
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
            <h1 className="text-[45px] m-[10px] p-[8px] text-center"> Create a Payment </h1>
            <button className={`m-[10px] p-[20px] border-[4px] border-black hover:bg-black hover:bg-opacity-30 ${paymenttype === 'recive' ? "bg-black bg-opacity-30":""}`} onClick={()=> setPaymenttype('recive')}>
                Recive
            </button>
            <button className={`m-[10px] p-[20px] border-[4px] border-black hover:bg-black hover:bg-opacity-30 ${paymenttype === 'send' ? "bg-black bg-opacity-30":""}`} onClick={()=> setPaymenttype('send')}>
                Send
            </button>
            {admin ? (
                <div className="m-[60px] mt-[20px] p-[10px] text-center">
                    <input type="number" value={amount} className="border-[2px] border-black" placeholder="Enter Amount" onChange={(e) => setAmount(parseInt(e.target.value))} />
                    <select id="emailDropdown" value={selectedEmail} onChange={handleEmailChange} className="m-[8px] ml-[20px]">
                        <option value="">Select an email</option>
                        {Array.isArray(teammembers) ? (
                            <>
                                {teammembers.map((teamMember) => (
                                    <option key={teamMember.memname} value={teamMember.mememail}>
                                        {teamMember.mememail}
                                    </option>
                                ))}
                            </>
                        ) : null}
                    </select>

                    <button className="m-[8px] ml-[20px] p-[4px] px-[10px] bg-black rounded-[6px] bg-opacity-30" onClick={() => handlesubmit(teamid,mememail, selectedEmail, amount, paymenttype)}>Submit</button>
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

export default Transactions;