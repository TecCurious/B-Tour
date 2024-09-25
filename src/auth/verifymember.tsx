'use server';

import prisma from "@/lib/prisma";
import React from "react";

const Verifymember = async (id:string, randomcode:Number, mememail:string, teamid:string) => {
    const admin = await prisma.createmember.findMany({
        where: {
            mememail,
            teamid
        }
    });

    if (admin.length !== 0) {
        const creatememid = id;

        const code = await prisma.memberverify.findUnique({
            where: {
                creatememid
            }
        });

        if (code?.randomcode === randomcode) {

            const isverfied = true;

            await prisma.createmember.update({
                where: {
                    id
                },
                data: {
                    isverfied
                }
            });

            await prisma.memberverify.delete({
                where: {
                    creatememid
                }
            })

            return "Verified Successfully"

        }

        else {
            return "Wrong verification details"
        }

    }
    else {
        return "you don't have access to verify"
    }

};

export default Verifymember;