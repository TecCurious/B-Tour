"use client"

import React, { useState, useEffect } from "react";
import Joinedteam from "@/components/Jointeam/jointeam";
import Createteam from "@/components/Createteam/createteam";
import Createdteams from "@/components/Createteam/createdteams";
import Joinedteams from "@/components/Jointeam/joinedteams";
import Allteams from "@/components/Allmyteams/allteams";
import { useRouter } from "next/navigation";

export default function Home() {
    const [user, setUser] = useState<string | null>(null);
    const [teamType, setTeamType] = useState('create');
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("email");
        console.log(storedUser);
        setUser(storedUser);
    }, []);

    const logout = () => {
        localStorage.removeItem("email");
        localStorage.removeItem("id");
        localStorage.removeItem("teamId");
        setUser(null);
        router.push("/");
    };

    if (user === null) {
        return <></>;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left-side Dashboard */}
            <div className="w-1/4 bg-gray-800 text-white h-screen p-5">
                <h2 className="text-xl font-bold mb-5">Team Management</h2>
                <button
                    className={`w-full text-left p-3 mb-2 rounded hover:bg-gray-700 ${teamType === 'create' ? "bg-gray-600" : ""}`}
                    onClick={() => setTeamType('create')}
                >
                    Create Team
                </button>
                <button
                    className={`w-full text-left p-3 mb-2 rounded hover:bg-gray-700 ${teamType === 'join' ? "bg-gray-600" : ""}`}
                    onClick={() => setTeamType('join')}
                >
                    Join Team
                </button>
                <button
                    className={`w-full text-left p-3 mb-2 rounded hover:bg-gray-700 ${teamType === 'show' ? "bg-gray-600" : ""}`}
                    onClick={() => setTeamType('show')}
                >
                    Show My Teams
                </button>
                <button onClick={logout} className="w-full mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    Logout
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-5">
                {teamType === 'join' ? (
                    <>
                        <Joinedteam />
                        <Joinedteams />
                    </>
                ) : teamType === 'create' ? (
                    <>
                        <Createteam />
                        <Createdteams />
                    </>
                ) : teamType === 'show' ? (
                    <Allteams />
                ) : null}
            </div>
        </div>
    );
}