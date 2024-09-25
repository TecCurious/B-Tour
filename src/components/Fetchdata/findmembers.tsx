'use server'

import prisma from "@/lib/prisma"

const FindMembers = async (mememail:string, teamid:string) => {
    const teams = await prisma.createmember.findMany({
        where: {
            mememail,
            teamid
        }
    })
    
    if (teams.length !== 0) {
        const members = await prisma.createmember.findMany({
            where: {
                teamid
            }
        })

        return members
    }
    else {
        return "Please Login or you dont have access to view these details"
    }
}

export default FindMembers;