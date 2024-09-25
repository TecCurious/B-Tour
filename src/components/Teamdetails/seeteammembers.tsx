"use client"
import { RootState } from "@/app/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FindMembers from "../Fetchdata/findmembers";
import Verifymember from "@/auth/verifymember";
import { useRouter } from "next/navigation";
import Getrandnum from "@/auth/getrandomnumber";

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

const Seeteammembers = (params: any) => {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.userState.user)
    const mememail = user ? user : ""
    const teamid = params.teamid.params.team;
    const [teammembers, setTeammembers] = useState<TeamMember[] | string>([]);
    const [randomcode, setrandomcode] = useState<number>(0);
    const [id, setId] = useState<string>('');
    const [admin, setAdmin] = useState(false);
    const [showcode, setShowcode] = useState(false);
    const [fetchedrandnum, setFetchedrandnum] = useState<number>();

    useEffect(() => {
        const verifyUser = async () => {
            const teammem = await FindMembers(mememail, teamid);

            setTeammembers(teammem);
        };
        verifyUser();
    }, [mememail, teamid]);

    const handleSubmit = async () => {
        const responce = await Verifymember(id, randomcode, mememail, teamid);

        router.refresh();
    }

    const handleshowcode = async (creatememid: string) => {
        const responce = await Getrandnum(creatememid)

        setFetchedrandnum(responce);
        setShowcode(true);
        router.refresh();
    }

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

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="border-b">Team Id:- {teamid}</th>
                    </tr>
                </thead>
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Member Id</th>
                        <th className="py-2 px-4 border-b">Member Email</th>
                        <th className="py-2 px-4 border-b">Member Name</th>
                        <th className="py-2 px-4 border-b">Member Phone</th>
                        <th className="py-2 px-4 border-b">Member Role</th>
                        <th className="py-2 px-4 border-b">Verified</th>
                    </tr>
                </thead>
                {Array.isArray(teammembers) ? (
                    teammembers.map((teammem: TeamMember) => (
                        <tbody key={teammem.id}>
                            <tr>
                                <td className="py-2 px-4 border-b text-center">{teammem.memid}</td>
                                <td className="py-2 px-4 border-b text-center">{teammem.mememail}</td>
                                <td className="py-2 px-4 border-b text-center">{teammem.memname}</td>
                                <td className="py-2 px-4 border-b text-center">{teammem.memphone}</td>
                                <td className="py-2 px-4 border-b text-center">{teammem.memrole}</td>
                                {teammem.isverfied ? (
                                    <div className="pl-[45%] pt-[5%]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-check-square-fill" viewBox="0 0 16 16">
                                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z" />
                                        </svg>
                                    </div>
                                ) : (
                                    <>
                                        {admin ? (
                                            <td className="">
                                                <input value={randomcode} onChange={(e) => { setrandomcode(parseInt(e.target.value, 10)), setId(teammem.id) }} className="border-2 m-[8px]" placeholder="Enter Verification code" />
                                                <br />
                                                <button onClick={handleSubmit} className="left-[80px] m-[8px] mt-[0px] p-[4px] border-2 rounded-[6px] hover:bg-black hover:bg-opacity-30">Submit</button>
                                            </td>
                                        ) : (
                                            <div className="">
                                                {mememail === teammem.mememail ? (
                                                    <div className="">
                                                        {showcode ? (
                                                            <div className="m-[10px] ml-[60px]">
                                                                {fetchedrandnum}
                                                            </div>
                                                        ) : (
                                                            <div className="">
                                                                <button onClick={() => handleshowcode(teammem.id)}>Show Code</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="pl-[45%] pt-[5%]">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-x-square" viewBox="0 0 16 16">
                                                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </tr>
                        </tbody>

                    ))
                ) : (
                    <p>{teammembers}</p>
                )}
            </table>
        </div>
    )
}

export default Seeteammembers;