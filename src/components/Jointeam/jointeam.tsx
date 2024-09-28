'use client'

import React, { useState, useEffect } from "react";
import { createmember } from "@/action/createmem";
import { joinTeam } from "@/action/actions";

const Createteam = () => {
    const [email, setEmail] = useState<string>('');
    const [teamid, setTeamid] = useState('');
    // const [teamname, setTeamname] = useState('');
    const [message, setMessage] = useState('');
    const [formVisible, setFormVisible] = useState(false); // State to control form visibility
    const userId = typeof window !== 'undefined' ? localStorage.getItem('id') || '' : '';

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleSubmit = async () => {
        if (!teamid ) {
            setMessage('Please fill in all fields.');
            return;
        }

        setMessage('Joining Team...');

        try {
            const response = await joinTeam(userId, teamid);

            if (typeof response === "string") {
                setMessage(response);
            } else {
                setTeamid('');
                setMessage('Successfully joined the team!');
            }
        } catch (err) {
            console.log(err);
            setMessage('Error joining team. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center rounded-lg">
            <button 
                onClick={() => setFormVisible(true)} 
                className="px-2 bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200 mb-4"
            >
                Join a Team
            </button>
            {formVisible && (
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                    <input 
                        type="text" 
                        value={teamid} 
                        onChange={(e) => setTeamid(e.target.value)} 
                        placeholder="Enter Team ID" 
                        className="border border-gray-300 rounded-md p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {/* <input 
                        type="text" 
                        value={teamname} 
                        onChange={(e) => setTeamname(e.target.value)} 
                        placeholder="Enter Team Name" 
                        className="border border-gray-300 rounded-md p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    /> */}
                    <button 
                        onClick={handleSubmit} 
                        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Join Team
                    </button>
                    {message && <p className="mt-4 text-center text-red-600">{message}</p>}
                </div>
            )}
        </div>
    );
};

export default Createteam;
