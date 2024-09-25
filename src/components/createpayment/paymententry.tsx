'use server'

import prisma from "@/lib/prisma";

const PaymentEntry = async (teamid: string, mememail: string, amount: number) => {

    const user = await prisma.createmember.findMany({
        where: {
            teamid,
            mememail
        }
    });

    if (user.length !== 0 && user[0].isverfied === true) {

        await prisma.createpayment.create({
            data: {
                teamid,
                teamname: user[0].teamname,
                creatememid: user[0].id,
                memname: user[0].memname,
                mememail,
                amount
            }
        });

        const payment = await prisma.payments.findUnique({
            where: {
                creatememid: user[0].id,
            }
        });

        if (payment) {
            const startingpayment:number = payment?.paymentin

            const updatedpayment = startingpayment + amount

            await prisma.payments.update({
                where : {
                    id:payment.id
                },
                data: {
                    paymentin:updatedpayment
                }
            });

            return true
        }

        else {
            const paymentout = 0;

            await prisma.payments.create({
                data: {
                    teamid:user[0].teamid,
                    creatememid:user[0].id,
                    mememail:user[0].mememail,
                    memname:user[0].memname,
                    paymentin:amount,
                    paymentout
                }
            })
        }

        return true
    }

    return false
};

export default PaymentEntry;