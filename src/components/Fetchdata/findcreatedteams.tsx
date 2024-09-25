'use server'

import prisma from "@/lib/prisma"

const Findteams = async (mememail:string, memrole:string) => {
    const teams = await prisma.createmember.findMany({
        where: {
            mememail,
            memrole
        }
    })

    return teams
}

export default Findteams;