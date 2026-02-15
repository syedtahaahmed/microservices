import { requireAuth, validateRequest } from '@sgtickets/common';
import { body } from 'express-validator';
import express, {Request,Response} from 'express';
import { Ticket } from '../models/ticket.js';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher.js';
import { natsWrapper } from '../nats-wrapper.js';
const router=express.Router();

router.post("/api/tickets",requireAuth,[ 
    body('title').not().isEmpty().withMessage("title is required"),
    body('price').isFloat({gt:0}).withMessage("price should be >0")
],validateRequest,async(req:Request,res:Response)=>{
    const {title,price}=req.body;
    const ticket=Ticket.build({
        title,
        price,
        userId:req.currentUser!.id || "1234"
    })
    const response=await ticket.save();
    new TicketCreatedPublisher(natsWrapper.client).publish({
        id:JSON.stringify(ticket.id),
        title:ticket.title,
        price:ticket.price,
        userId:ticket.userId,
    version:1
    })

    res.status(201).send(ticket)
})

export {router as createTicketRouter};