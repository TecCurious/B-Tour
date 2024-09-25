'use server'

import prisma from "@/lib/prisma";

const Fetchpayments = async (mememail: string, teamid: string, admin: boolean) => {
    const user = await prisma.createmember.findMany({
        where: {
            mememail,
        }
    });

    if (user.length !== 0 && admin === true) {

        const payments = await prisma.createpayment.findMany({
            where: {
                teamid
            }
        });

        return payments
    }

    else if (user.length !== 0) {
        const payments = await prisma.createpayment.findMany({
            where: {
                mememail,
                teamid
            }
        });

        return payments
    }

    return "User Does Not exist"

};

export default Fetchpayments;