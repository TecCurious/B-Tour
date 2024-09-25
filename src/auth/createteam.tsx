'use server';

import prisma from "@/lib/prisma";

export const Createteamcomp = async (email: string, teamid: string, teamname: string,) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        }
    })

    if (user) {
        const status = await prisma.createteam.create({
            data: {
                teamid,
                teamname
            }
        });

        const memrole = "admin";
        const memid = user.id;
        const memname = user.name;
        const mememail = user.email;
        const memphone = user.phone;
        const isverfied = true;

        await prisma.createmember.create({
            data:{
                teamid,
                teamname,
                memid,
                memname,
                mememail,
                memphone,
                memrole,
                isverfied
            }
        })
        return status
    }
    else {
        return 'User Does not exist'
    }

}