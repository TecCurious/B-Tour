'use server';

import prisma from "@/lib/prisma";
import bcrypt from 'bcryptjs';

export const signUp = async (email: string, name: string,phone: string, password: string) => {
    const user = await prisma.user.findUnique({
        where:{
            email,
        }
    })

    if (user) {
        return 'User already exist'
    }

    const passwordHash = bcrypt.hashSync(password,10);

    await prisma.user.create({
        data: {
            email,
            name,
            phone,
            passwordHash
        }
    })
}