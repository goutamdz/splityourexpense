import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import * as z from "zod";
import prisma from '../config/prismaClient.config.js';
import jwt from 'jsonwebtoken'


// model User {
//   id           Int        @id @default(autoincrement())
//   name         String
//   email        String     @unique
//   passwordHash String
//   createdAt    DateTime   @default(now())

//   events       EventUser[]
//   expenses     Expense[]
// }

const createUser = async (req: Request, res: Response) => {
    const User = z.object({
        name: z.string(),
        email: z.email(),
        password: z.string()
    });
    const zodresult = User.safeParse(req.body);
    if (!zodresult.success) {
        console.log(zodresult.error);   // ZodError instance
        return res.json({
            "error": zodresult.error
        })
    }
    const { name, email, password } = req.body;
    let passwordHash: string = await bcrypt.hash(password, Number(process.env.Salt_round));

    const result = await prisma.user.create({
        data: {
            name: name.toLowerCase(),
            email: email.toLowerCase(),
            passwordHash
        }
    })

    const token = jwt.sign({ id: result.id, email: result.email, name: result.name }, `${process.env.JWT_SECRET}`);
    res.json({ token });
}

const getAllusers = async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    res.json(users);
}

const searchUser = async (req: Request, res: Response) => {
    const { text } = req.params;

    if (!text) {
        return res.status(400).json({ error: "Email parameter is required" });
    }

    const users = await prisma.user.findMany({
        where: {
            OR:[
                {
                    email: {
                        contains: text
                    }
                },
                {
                    name: {
                        contains: text
                    }
                }
            ]
        },
        select: {
            id: true,
            name: true,
            email: true
        }
    })
    res.json(users);
}


export { createUser, getAllusers, searchUser };