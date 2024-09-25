'use server';

import prisma from "@/lib/prisma";
import bcrypt from 'bcryptjs';

export const signIn = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where:{
            email,
        }
    })

    if (user) {
        const status = await bcrypt.compare(password,user.passwordHash)
        const name = user.name

        await prisma.logindata.create({
            data:{
                email,
                name
            }
        })

        return status
    }
    else {
        return 'Invalid credentials'
    }

}