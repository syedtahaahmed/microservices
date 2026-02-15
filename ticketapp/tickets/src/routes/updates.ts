import express,{Request,Response} from 'express'
import { body } from 'express-validator';
import { Ticket } from '../models/ticket.js';
import { NotFoundError,validateRequest,requireAuth, NotAuthorizedError } from '@sgtickets/common';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher.js';
import { natsWrapper } from '../nats-wrapper.js';


const router=express.Router();

router.put("/api/tickets/:id",requireAuth,[
    body('title').not().isEmpty().withMessage("title is required"),
    body('price').isFloat({gt:0}).withMessage("price mus tbe provied")

],
    async(req:Request,res:Response)=>{
    const ticket=await Ticket.findById(req.params.id);
    if(!ticket){
        throw new NotFoundError();
    }
    ticket.set({
        title:req.body.title,
        price:req.body.price
    })
    await ticket.save();
    res.send(ticket)
    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id:JSON.stringify(ticket.id),
        title:ticket.title,
        price:ticket.price,
        userId:ticket.userId,
        version:1
    })
    if(ticket.userId!==req.currentUser!.id){
        throw new NotAuthorizedError();
    }
})

export {router as updateTicketRouter}