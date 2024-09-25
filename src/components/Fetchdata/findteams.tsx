'use server'

import prisma from "@/lib/prisma"

const Findallteams = async (mememail:string) => {
    const teams = await prisma.createmember.findMany({
        where: {
            mememail
        }
    })

    return teams
}

export default Findallteams;