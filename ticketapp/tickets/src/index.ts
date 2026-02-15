import express from 'express';
import 'express-async-errors'



import { errorHandler, NotFoundError, currentUser } from '@sgtickets/common';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { createTicketRouter } from './routes/new.js';
import { showTicketRouter } from './routes/show.js';
import { indexTicketRouter } from './routes/index.js';
import { updateTicketRouter } from './routes/updates.js';


import { natsWrapper } from './nats-wrapper.js';
const app = express();
app.set("trust proxy", true)
app.use(express.json());

// app.use(cookieSession({
//     signed:false,
//     secure:true
// }))

app.use(
    cookieSession({
        signed: false,
        secure: false //process.env.NODE_ENV !== 'test',
    })
);

app.use(currentUser);
app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)


app.all('*', async (req, res) => {
    console.log(req)
    throw new NotFoundError();
})
app.use(errorHandler)

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("key not found")
    }
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO URI NOT FOUND")
    }
    try {
        await natsWrapper.connect('ticketing', 'lask', 'http://nats-srv:4222');
        natsWrapper.client.on('close', () => {
            console.log("nats connection closed");
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())

        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB connected")
    } catch (error) {
        console.log(error)
    }
    app.listen(3000, '0.0.0.0', () => {
        console.log('Listening on 3000');
    });
}


start();

