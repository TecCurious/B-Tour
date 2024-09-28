"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllTeamMembers } from "@/action/actions";

interface TeamMember {
  id: string; // Unique ID for the user
  name: string; // Name of the user
  email: string; // Email of the user
}

const Seeteammembers = (params: any) => {
  const router = useRouter();
  const teamid = params.teamid.params.team;
  const [teammembers, setTeammembers] = useState<TeamMember[] | string>([]);
  // const [randomcode, setRandomcode] = useState<number>(0);
  // const [id, setId] = useState<string>("");
  // const [admin, setAdmin] = useState(false);
  // const [showcode, setShowcode] = useState(false);
  // const [fetchedrandnum, setFetchedrandnum] = useState<number>();
  // const [mememail, setMemEmail] = useState<string>(""); // Ensure mememail is always a string

    useEffect(()=>{
      getAllmembers();
    }, [])

    const getAllmembers = async()=>{
      const members  = await getAllTeamMembers(teamid);
      console.log(members);
      setTeammembers(members);
    }


  return (
    <div className="max-w-7xl mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-6">Team Members</h1>

      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 border-b text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Team ID: {teamid}
            </th>
          </tr>
        </thead>
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-6 border-b text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Member ID
            </th>
            <th className="py-3 px-6 border-b text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Member Email
            </th>
            <th className="py-3 px-6 border-b text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Member Name
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(teammembers) ? (
            teammembers.map((teammem: TeamMember) => (
              <tr key={teammem.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 border-b text-sm text-gray-700">{teammem.id}</td>
                <td className="py-4 px-6 border-b text-sm text-gray-700">{teammem.email}</td>
                <td className="py-4 px-6 border-b text-sm text-gray-700">{teammem.name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4 text-sm text-gray-600">
                {teammembers}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Seeteammembers;
