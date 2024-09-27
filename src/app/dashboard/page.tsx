"use client"
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Joinedteam from "@/components/Jointeam/jointeam";
import Createteam from "@/components/Createteam/createteam";
import Createdteams from "@/components/Createteam/createdteams";
import Joinedteams from "@/components/Jointeam/joinedteams";
import Allteams from "@/components/Allmyteams/allteams";

export default function Home() {
    const user = useSelector((state: RootState) => state.userState.user);
    const [Teamtype, setTeamtype] = useState('create');

    return (
        <>
            {/* {user === null ? ( */}
                <></>
            {/* ) : ( */}
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
            {/* )} */}
        </>
    );
}
