'use client'

import { RootState } from "@/app/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Createteamcomp } from "@/auth/createteam";
import { useRouter } from "next/navigation";
import { generateRandomTeamId } from "../Generaterandom/randomtext";

const Createteam = ({ initialRandomTeamId }: { initialRandomTeamId: string }) => {
    const user = useSelector((state: RootState) => state.userState.user)
    const email = user ? user:'';
    const [teamid, setTeamid] = useState(initialRandomTeamId);
    const [teamname, setTeamname] = useState('');
    const [message, setMessage] = useState('');

    const router = useRouter();

    const handleSubmit = async () => {
        setMessage('Createing Team...');

        try {
            const response = Createteamcomp(email, teamid, teamname)

            setTeamid('');
            setTeamname('');
            setMessage('');
            router.refresh();
        }catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (!initialRandomTeamId) {
          setTeamid(generateRandomTeamId());
        }
      }, [initialRandomTeamId]);

    return (
        <div className="flex flex-col gap-4 bg-gray-400 p-4">
            <h1 className="relative text-[25px] left-[60px]">Team ID:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "{teamid}"</h1>
            <input type="text" value={teamname} onChange={(e) => setTeamname(e.target.value)} placeholder="Enter Team Name" />

            <button onClick={handleSubmit}> Create New Team </button>

            <p>{message}</p>

        </div>
    );
};

Createteam.getInitialProps = async () => {
    const initialRandomTeamId = generateRandomTeamId();
    return { initialRandomTeamId };
  };

export default Createteam;