'use server'

import prisma from "@/lib/prisma"

const DueEntry = async (teamid: string, mememail: string, selectedEmail: string, amount: number, paymenttype: string) => {
    const mainuser = await prisma.user.findUnique({
        where: {
            email: mememail,
        }
    })

    if (mainuser) {

        const user = await prisma.createmember.findMany({
            where: {
                teamid,
                mememail: selectedEmail
            }
        });

        if (user.length !== 0 && user[0].isverfied === true) {
            if (paymenttype === 'send') {

                const payment = await prisma.payments.findUnique({
                    where: {
                        creatememid: user[0].id,
                    }
                });

                if (payment) {
                    const startingpayment: number = payment?.paymentin

                    const updatedpayment = startingpayment - amount

                    await prisma.payments.update({
                        where: {
                            id: payment.id
                        },
                        data: {
                            paymentin: updatedpayment
                        }
                    });

                    await prisma.passbook.create({
                        data:{
                            teamid:user[0].teamid,
                            creatememid:user[0].id,
                            mememail:selectedEmail,
                            amount,
                            paymenttype
                        }
                    })

                    return true
                }

                else {
                    const paymentout = 0;

                    const paymentin = -amount

                    await prisma.payments.create({
                        data: {
                            teamid: user[0].teamid,
                            creatememid: user[0].id,
                            mememail: user[0].mememail,
                            memname: user[0].memname,
                            paymentin,
                            paymentout
                        }
                    })

                    await prisma.passbook.create({
                        data:{
                            teamid:user[0].teamid,
                            creatememid:user[0].id,
                            mememail:selectedEmail,
                            amount,
                            paymenttype
                        }
                    })
                }
            }

            else if (paymenttype === 'recive') {
                const payment = await prisma.payments.findUnique({
                    where: {
                        creatememid: user[0].id,
                    }
                });

                if (payment) {
                    const startingpayment: number = payment?.paymentout

                    const updatedpayment = startingpayment - amount

                    await prisma.payments.update({
                        where: {
                            id: payment.id
                        },
                        data: {
                            paymentout: updatedpayment
                        }
                    });

                    await prisma.passbook.create({
                        data:{
                            teamid:user[0].teamid,
                            creatememid:user[0].id,
                            mememail:selectedEmail,
                            amount,
                            paymenttype
                        }
                    })

                    return true
                }

                else {
                    const paymentin = 0;

                    const paymentout = -amount

                    await prisma.payments.create({
                        data: {
                            teamid: user[0].teamid,
                            creatememid: user[0].id,
                            mememail: user[0].mememail,
                            memname: user[0].memname,
                            paymentin,
                            paymentout
                        }
                    })

                    await prisma.passbook.create({
                        data:{
                            teamid:user[0].teamid,
                            creatememid:user[0].id,
                            mememail:selectedEmail,
                            amount,
                            paymenttype
                        }
                    })
                }
            }
        }
    }
};

export default DueEntry;