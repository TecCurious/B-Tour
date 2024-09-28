'use client'

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAllTeamsForUser } from "@/action/actions";

interface Team {
    id: string;
    name: string;
    destination: string | null; // Allow null in addition to string
    createdAt: Date;
  }
  

const Allteams = () => {
    const [email, setEmail] = useState<string>('');
    const [teams, setTeams] = useState<Team[]>([]);
    const userId = typeof window !== 'undefined' ? localStorage.getItem('id') || '' : '';

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    useEffect(() => {
        const fetchTeams = async () => {
            if (email) {
                try {
                    const teamsData = await getAllTeamsForUser(userId);
                    setTeams(teamsData);
                } catch (error) {
                    console.error('Error fetching teams:', error);
                }
            }
        };

        fetchTeams();
    }, [email]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-bold text-center mb-6">All Your Teams</h1>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-3 px-4 border-b text-left text-gray-600">Team ID</th>
                            <th className="py-3 px-4 border-b text-left text-gray-600">Team Name</th>
                            <th className="py-3 px-4 border-b text-left text-gray-600">Destination</th>
                            <th className="py-3 px-4 border-b text-left text-gray-600">Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map((team) => (
                            <tr key={team.id} className="hover:bg-gray-100 transition duration-200">
                                <td className="py-2 px-4 border-b text-center">{team.id}</td>
                                <td className="py-2 px-4 border-b text-center">{team.name}</td>
                                <td className="py-2 px-4 border-b text-center">{team.destination}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <Link href={`/${team.id}/details`}>
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

export default Allteams;
