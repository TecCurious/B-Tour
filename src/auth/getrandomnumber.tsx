'use server'
import prisma from "@/lib/prisma";

const Getrandnum = async (creatememid:string) => {
    const randomcode = await prisma.memberverify.findUnique({
        where: {
            creatememid
        }
    });

    return randomcode?.randomcode
};

export default Getrandnum
