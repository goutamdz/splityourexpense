import {Request,Response} from 'express'
import jwt from 'jsonwebtoken'
import * as z from 'zod';
import prisma from '../config/prismaClient.config.js';

// model Event {
//   id        Int        @id @default(autoincrement())
//   name      String
//   createdAt DateTime   @default(now())

//   users     EventUser[]
//   expenses  Expense[]
// }

// model EventUser {
//   id      Int   @id @default(autoincrement())

//   user    User  @relation(fields: [userId], references: [id])
//   userId  Int

//   event   Event @relation(fields: [eventId], references: [id])
//   eventId Int
// }

const createEvent=async(req:Request,res:Response)=>{
    const token=req.headers.authorization?.split(' ')[1];
    //verify token
    if(!token){
        res.status(401).json({error:"Unauthorized"});
        return;
    }
    let decoded:any;
    try{
        decoded=jwt.verify(token,`${process.env.JWT_SECRET}`);
    }catch(err){
        res.status(401).json({error:"Unauthorized"});
        return;
    }
    const Event=z.object({
        name:z.string(),
    });
    let userId:string=decoded.id;
    let userEmail:string=decoded.email;
    
    const zodresult=Event.safeParse(req.body);
    if(!zodresult.success){
        console.log(zodresult.error);   // ZodError instance
        res.json({
            "error":zodresult.error
        })
        return;
    }
    const {name}=req.body;
    await prisma.$transaction(async(prisma)=>{
        const event=await prisma.event.create({
            data:{
                name
            }
        });
        const user=await prisma.user.findUnique({
            where:{
                email:userEmail
            }
        });
        if(!user){
            res.status(404).json({error:"User not found"});
            return;
        }
        await prisma.eventUser.create({
            data:{
                userId:user.id,
                eventId:event.id
            }
        });
        
        res.json({eventId:event.id});
    })
}