'use server';

import prisma from "@/lib/prisma";
import generateRandomCode from "@/components/Generaterandom/randomcode";

export const createmember = async (email: string, teamid: string, teamname: string,) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        }
    })

    if (user) {
        const team = await prisma.createteam.findUnique({
            where: {
                teamid
            }
        });

        if (team) {
            const memrole = "user";
            const memid = user.id;
            const memname = user.name;
            const mememail = user.email;
            const memphone = user.phone;
            const isverfied = false;
            const randomcode = generateRandomCode();

            const userinteam = await prisma.createmember.findFirst({
                where: {
                    teamid,
                    mememail
                }
            })
            
            if (userinteam) {
                return 'User Already Present in Team'
            }
            else {
                const status = await prisma.createmember.create({
                    data: {
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

                const creatememid = status.id;

                await prisma.memberverify.create({
                    data: {
                        mememail,
                        creatememid,
                        teamid,
                        teamname,
                        randomcode
                    }
                })
                return status
            }
        }
        else {
            return "Team Does Not Exist"
        }
    }
    else {
        return 'User Does not exist'
    }

}