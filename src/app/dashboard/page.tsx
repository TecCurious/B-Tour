"use client"
import React, { useState, useEffect } from "react";
import Joinedteam from "@/components/Jointeam/jointeam";
import Createteam from "@/components/Createteam/createteam";
import Createdteams from "@/components/Createteam/createdteams";
import Joinedteams from "@/components/Jointeam/joinedteams";
import Allteams from "@/components/Allmyteams/allteams";
import { useRouter } from "next/navigation";

export default function Home() {
    // Replace Redux state with localStorage
    const [user, setUser] = useState<string | null>(null);
    const [Teamtype, setTeamtype] = useState('create');
    const router = useRouter();

    // Fetch user from localStorage when component mounts
    useEffect(() => {
        const storedUser = localStorage.getItem("email");
        console.log(storedUser);
        setUser(storedUser);
    }, []);

    // Logout function
    const logout = () => {
        localStorage.removeItem("email");
        localStorage.removeItem("id");
        localStorage.removeItem("teamId");
        setUser(null);  // Clear the user state
        router.push("/");
        

    };

    return (
        <>
            {user === null ? (
                <></>
            ) : (
                <div className="flex">
                    {/* Sidebar */}
                    <div className="w-1/4 bg-gray-800 text-white h-screen p-5">
                        <h2 className="text-xl font-bold mb-5">Team Management</h2>
                        <button 
                            className={`w-full text-left p-3 mb-2 rounded hover:bg-gray-700 ${Teamtype === 'create' ? "bg-gray-600" : ""}`} 
                            onClick={() => setTeamtype('create')}
                        >
                            Create Team
                        </button>
                        <button 
                            className={`w-full text-left p-3 mb-2 rounded hover:bg-gray-700 ${Teamtype === 'join' ? "bg-gray-600" : ""}`} 
                            onClick={() => setTeamtype('join')}
                        >
                            Join Team
                        </button>
                        <button 
                            className={`w-full text-left p-3 mb-2 rounded hover:bg-gray-700 ${Teamtype === 'show' ? "bg-gray-600" : ""}`} 
                            onClick={() => setTeamtype('show')}
                        >
                            Show My Teams
                        </button>

                        <button onClick={logout} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Logout</button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-5">
                        {Teamtype === 'join' ? (
                            <>
                                <Joinedteam />
                                <Joinedteams />
                            </>
                        ) : Teamtype === 'create' ? (
                            <>
                                <Createteam />
                                <Createdteams />
                            </>
                        ) : Teamtype === 'show' ? (
                            <Allteams />
                        ) : null}
                    </div>
                </div>
            )}
        </>
    );
}
