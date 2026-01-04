import { Router } from "express";
import { Request ,Response} from "express";
const router=Router();
import {createUser} from '../controller/user.controller.js'


// const {name,email,password}=req.body;

router.get('/',(req:Request,res:Response)=>{
    res.send("Successfully landed to user route");
})



router.post('/create',createUser);


export default router;