'use client'

import { RootState } from "@/app/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Findteams from "../Fetchdata/findcreatedteams";
import Link from "next/link";

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

const Createdteams = () => {
    const user = useSelector((state: RootState) => state.userState.user)
    const email = user ? user : '';
    const mememail = email;
    const memrole = "admin";

    const [teams, setTeams] = useState<TeamMember[]>([]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const teamsData = await Findteams(mememail, memrole);
                setTeams(teamsData);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        fetchTeams();
    }, [mememail, memrole]);

    return (
        <div className="">
            <h1 className="text-[60px] pl-[400px]"> Team&apos;s Created By You</h1>

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b"> Team Id</th>
                        <th className="py-2 px-4 border-b"> Team Name</th>
                        <th className="py-2 px-4 border-b"> Link</th>
                    </tr>
                </thead>

                {teams.map((team) => (
                    <tbody key={team.id}>
                        <tr className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b text-center">{team.teamid}</td>
                            <td className="py-2 px-4 border-b text-center">{team.teamname}</td>
                            <td className="py-2 px-4 border-b text-center">
                                <Link href={`/${team.teamid}/deatils`}>
                                    <button className="m-[10px] p-[6px] hover:bg-black rounded-[6px] hover:bg-opacity-30">View Details</button>
                                </Link>
                            </td>
                        </tr>
                    </tbody>
                ))}
            </table>
        </div>
    );
};

export default Createdteams;