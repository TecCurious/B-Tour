"use client";
import { RootState } from "@/app/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FindMembers from "../Fetchdata/findmembers";
import Verifymember from "@/auth/verifymember";
import { useRouter } from "next/navigation";
import Getrandnum from "@/auth/getrandomnumber";

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

const Seeteammembers = (params: any) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.userState.user);
  const mememail = user ? user : "";
  const teamid = params.teamid.params.team;
  const [teammembers, setTeammembers] = useState<TeamMember[] | string>([]);
  const [randomcode, setRandomcode] = useState<number>(0);
  const [id, setId] = useState<string>("");
  const [admin, setAdmin] = useState(false);
  const [showcode, setShowcode] = useState(false);
  const [fetchedrandnum, setFetchedrandnum] = useState<number>();

  useEffect(() => {
    const verifyUser = async () => {
      const teammem = await FindMembers(mememail, teamid);
      setTeammembers(teammem);
    };
    verifyUser();
  }, [mememail, teamid]);

  const handleSubmit = async () => {
    const responce = await Verifymember(id, randomcode, mememail, teamid);
    router.refresh();
  };

  const handleshowcode = async (creatememid: string) => {
    const responce = await Getrandnum(creatememid);
    setFetchedrandnum(responce);
    setShowcode(true);
    router.refresh();
  };

  useEffect(() => {
    if (Array.isArray(teammembers)) {
      teammembers.forEach((mem) => {
        if (mem.mememail === mememail && mem.memrole === "admin") {
          setAdmin(true);
        }
      });
    }
  }, [teammembers, mememail]);

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
            <th className="py-3 px-6 border-b text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Member Phone
            </th>
            <th className="py-3 px-6 border-b text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Member Role
            </th>
            <th className="py-3 px-6 border-b text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Verified
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(teammembers) ? (
            teammembers.map((teammem: TeamMember) => (
              <tr key={teammem.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 border-b text-sm text-gray-700">{teammem.memid}</td>
                <td className="py-4 px-6 border-b text-sm text-gray-700">{teammem.mememail}</td>
                <td className="py-4 px-6 border-b text-sm text-gray-700">{teammem.memname}</td>
                <td className="py-4 px-6 border-b text-sm text-gray-700">{teammem.memphone}</td>
                <td className="py-4 px-6 border-b text-sm text-gray-700">{teammem.memrole}</td>
                <td className="py-4 px-6 border-b text-center">
                  {teammem.isverfied ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="green"
                      className="bi bi-check-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.354 8.354l-2-2a.5.5 0 0 1 .708-.708L7 7.293l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0z" />
                    </svg>
                  ) : (
                    <div>
                      {admin ? (
                        <div>
                          <input
                            value={randomcode}
                            onChange={(e) => {
                              setRandomcode(parseInt(e.target.value, 10)), setId(teammem.id);
                            }}
                            className="border-2 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                            placeholder="Enter verification code"
                          />
                          <button
                            onClick={handleSubmit}
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                          >
                            Submit
                          </button>
                        </div>
                      ) : mememail === teammem.mememail ? (
                        <div className="flex items-center justify-center">
                          {showcode ? (
                            <div className="text-sm text-gray-600">{fetchedrandnum}</div>
                          ) : (
                            <button
                              onClick={() => handleshowcode(teammem.id)}
                              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200"
                            >
                              Show Code
                            </button>
                          )}
                        </div>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="red"
                          className="bi bi-x-circle-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.354 8.354l-2-2a.5.5 0 0 1 .708-.708L7 7.293l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0z" />
                        </svg>
                      )}
                    </div>
                  )}
                </td>
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
