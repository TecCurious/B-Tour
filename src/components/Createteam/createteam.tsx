'use client';

import React, { useEffect, useState } from 'react';
import { Createteamcomp } from '@/action/createteam';
import { useRouter } from 'next/navigation';
import { generateRandomTeamId } from '../Generaterandom/randomtext';

const Createteam = () => {
    // Retrieve email from local storage and default to an empty string if null
    const email = typeof window !== 'undefined' ? localStorage.getItem('email') || '' : '';
    const [teamid, setTeamid] = useState(generateRandomTeamId());
    const [teamname, setTeamname] = useState('');
    const [message, setMessage] = useState('');
    const [formVisible, setFormVisible] = useState(false); // State to control form visibility

    const router = useRouter();

    const handleSubmit = async () => {
        if (!teamname || !teamid || !email) {
            setMessage('Please fill in all fields and ensure you are logged in.');
            return;
        }

        setMessage('Creating Team...');

        try {
            await Createteamcomp(email, teamid, teamname);
            setTeamid(''); // Reset team ID
            setTeamname(''); // Reset team name
            setMessage('Team created successfully!');
            router.refresh(); // Refresh the router to reflect the changes
        } catch (err) {
            console.log(err);
            setMessage('Error creating team. Please try again.');
        }
    };

    // useEffect(() => {
    //     if (!initialRandomTeamId) {
    //         setTeamid(generateRandomTeamId());
    //     }
    // }, [initialRandomTeamId]);

    return (
        <div className="flex flex-col items-center justify-end ">
            <button 
                onClick={() => setFormVisible(true)} 
                className="flex justify-end px-2 bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200 mb-4"
            >
                Create a New Team
            </button>
            {formVisible && (
                <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
                    {/* <h2 className="text-lg mb-2">Team ID: <span className="font-semibold">{teamid}</span></h2> */}
                    <input 
                        type="text" 
                        value={teamname} 
                        onChange={(e) => setTeamname(e.target.value)} 
                        placeholder="Enter Team Name" 
                        className="border border-gray-300 rounded-md p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        onClick={handleSubmit} 
                        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Create Team
                    </button>
                    {message && <p className="mt-4 text-center text-red-600">{message}</p>}
                </div>
            )}
        </div>
    );
};

Createteam.getInitialProps = async () => {
    const initialRandomTeamId = generateRandomTeamId();
    return { initialRandomTeamId };
};

export default Createteam;
