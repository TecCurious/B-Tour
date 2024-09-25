'use client'

import { RootState } from "@/app/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { createmember } from "@/auth/createmem";

const Createteam = () => {
    const user = useSelector((state: RootState) => state.userState.user)
    const email = user ? user : '';
    const [teamid, setTeamid] = useState('');
    const [teamname, setTeamname] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        setMessage('Createing Team...');

        try {
            const response = createmember(email, teamid, teamname)

            if (typeof response === "string") {
                setMessage(response);
            }
            else {
                setTeamid('');
                setTeamname('');
                setMessage('');
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="flex flex-col gap-4 bg-gray-400 p-4">
            <input type="text" value={teamid} onChange={(e) => setTeamid(e.target.value)} placeholder="Enter Team Id" />
            <input type="text" value={teamname} onChange={(e) => setTeamname(e.target.value)} placeholder="Enter Team Name" />

            <button onClick={handleSubmit}> Join Team </button>

            <p>{message}</p>

        </div>
    );
};

export default Createteam;