import mongoose from "mongoose";

interface TicketAttrs{
    title:string;
    price:number;
    userId:string
}

interface TicketDoc extends mongoose.Document{
    title:string;
    price: number;
    userId:string
    _id: mongoose.Types.ObjectId;
    id: mongoose.Types.ObjectId; 

}

interface TicketModel extends mongoose.Model<TicketDoc>{
    build(attrs:TicketAttrs):TicketDoc;


}

const tikcetSchema=new mongoose.Schema<TicketDoc>({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    userId:{
        type:String,
        required:true
    }
    
},{
    toJSON:{
        transform(doc,ret){
            ret.id=ret._id;
            delete ret._id;
        }
    }
})

tikcetSchema.statics.build=(attrs:TicketAttrs)=>{
    return new Ticket(attrs);
}

const Ticket=mongoose.model<TicketDoc,TicketModel>('Ticket',tikcetSchema)

export {Ticket};