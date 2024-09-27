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
    const user = useSelector((state: RootState) => state.userState.user);
    const email = user ? user : '';
    const memrole = "admin";

    const [teams, setTeams] = useState<TeamMember[]>([]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const teamsData = await Findteams(email, memrole);
                setTeams(teamsData);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        fetchTeams();
    }, [email, memrole]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-bold text-center mb-6">Teams Created By You</h1>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-3 px-4 border-b text-left text-gray-600">Team ID</th>
                            <th className="py-3 px-4 border-b text-left text-gray-600">Team Name</th>
                            <th className="py-3 px-4 border-b text-left text-gray-600">Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map((team) => (
                            <tr key={team.id} className="hover:bg-gray-100 transition duration-200">
                                <td className="py-2 px-4 border-b text-center">{team.teamid}</td>
                                <td className="py-2 px-4 border-b text-center">{team.teamname}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <Link href={`/${team.teamid}/deatils`}>
                                        <button className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition duration-200">
                                            View Details
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Createdteams;
