import { Request, Response } from 'express'
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

const createEvent = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const user = req.user;
    const Event = z.object({
        eventname: z.string(),
    });
    let userId: number = Number(user.id);
    let userEmail: string = user.email;
    let userName:string=user.name;

    const zodresult = Event.safeParse(req.body);
    if (!zodresult.success) {
        console.log(zodresult.error);   // ZodError instance
        res.json({
            "error": zodresult.error
        })
        return;
    }
    const eventName = req.body.eventname;
    await prisma.$transaction(async (prisma) => {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const event = await prisma.event.create({
            data: {
                name:eventName.toLowerCase(),
            }
            
        });
        
        await prisma.eventUser.create({
            data: {
                userId: user.id,
                eventId: event.id
            }
        });

        res.json({ eventId: event.id });
    })
}

const getEvents=async(req:Request,res:Response)=>{
    if(!req.user){
       return res.json({error:"Unauthorized",})
    }

    const userId=Number(req.user.id);
    const events=await prisma.eventUser.findMany({
        where:{
            userId:userId
        },
        include:{
            event:true
        }
    })
    res.json(events);
}

const addUserToEvent=async(req:Request,res:Response)=>{
    if(!req.user){
        return res.json({error:"Unauthorized"})
    }
    const userId=Number(req.user.id);
    const eventId=Number(req.params.eventId);
    const user=await prisma.user.findUnique({
        where:{
            id:userId
        }
    })
    if(!user){
        return res.json({error:"User not found"})
    }
    const event=await prisma.event.findUnique({
        where:{
            id:eventId
        }
    })
    if(!event){
        return res.json({error:"Event not found"})
    }
    await prisma.eventUser.create({
        data:{
            userId:userId,
            eventId:eventId
        }
    })
    res.json({message:"User added to event"})
}
export { createEvent,getEvents,addUserToEvent };