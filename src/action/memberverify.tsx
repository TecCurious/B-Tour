'use server';

import prisma from "@/lib/prisma";

export const Memberverify = async (email:string, randomcode:Number, creatememid: string,) =>{
    const user = await prisma.user.findUnique({
        where: {
            email,
        }
    })

    if (user){
        const memverify = await prisma.memberverify.findUnique({
            where: {
                creatememid,
            }
        })

        const id = creatememid;

        if (memverify?.randomcode === randomcode){
            const isverfied = true

            await prisma.createmember.update({
                where: {
                    id
                },
                data: {
                    isverfied,
                }
            })

            await prisma.memberverify.delete({
                where: {
                    creatememid
                }
            })
        }
        else {
            return "User not exist in your team"
        }
    }
    else {
        return "User Does not exist"
    }
}