'use server';

import prisma from "@/lib/prisma";

const PaymentEntry = async (teamid: string, mememail: string, amount: number) => {
    // Find the user based on team ID and email
    const user = await prisma.createmember.findMany({
        where: {
            teamid,
            mememail,
        },
    });

    // Check if user exists and is verified
    if (user.length !== 0 && user[0].isverfied === true) {
        // Create a new payment entry
        await prisma.createpayment.create({
            data: {
                teamid,
                teamname: user[0].teamname,
                creatememid: user[0].id,
                memname: user[0].memname,
                mememail,
                amount,
            },
        });

        // Find if there's an existing payment entry for the user
        const payment = await prisma.payments.findUnique({
            where: {
                creatememid: user[0].id,
            },
        });

        if (payment) {
            // Update payment entry if found
            const updatedpayment = payment.paymentin + amount;

            await prisma.payments.update({
                where: {
                    id: payment.id,
                },
                data: {
                    paymentin: updatedpayment,
                },
            });
        } else {
            // Create a new payment entry if no previous entry exists
            await prisma.payments.create({
                data: {
                    teamid: user[0].teamid,
                    creatememid: user[0].id,
                    mememail: user[0].mememail,
                    memname: user[0].memname,
                    paymentin: amount,
                    paymentout: 0, // Initial value for payment out
                },
            });
        }

        return true;
    }

    // Return false if the user is not found or not verified
    return false;
};

export default PaymentEntry;
