// import nats, { Message,Stan, SubscriptionOptions } from 'node-nats-streaming';
// import {randomBytes} from 'crypto'
// // console.clear();

// const stan=nats.connect("ticketing",randomBytes(4).toString('hex'),{
//     url:"http://localhost:4222"
// });


// stan.on("connect",()=>{
//     console.log("listner connected to nats")

//     stan.on('close',()=>{
//         console.log("nats connection closed")
//         process.exit();
//     })

//     const options=stan.subscriptionOptions()
//     .setDeliverAllAvailable().
//     setDurableName('order-service')
//     .setManualAckMode(true)
//     const subscription=stan.subscribe("ticket:created",'listnerQueueGroup',options);

//     subscription.on('message',(msg:Message)=>{
//             const data=msg.getData();
//             if(typeof data=="string"){
//                 console.log(`Received message #${msg.getSequence()}, with data: ${data}`)
//             }
//             msg.ack();

//     })
// })


// process.on("SIGINT",()=>stan.close())
// process.on("SIGTERM",()=>stan.close())










import nats, { Message,Stan, SubscriptionOptions } from 'node-nats-streaming';
import {randomBytes} from 'crypto'
import {TicketCreatedListner} from './events/ticket-created-listner'
// console.clear();

const stan=nats.connect("ticketing",randomBytes(4).toString('hex'),{
    url:"http://localhost:4222"
});

console.log("Starting listener file...");
stan.on("connect",()=>{
    console.log("listner connected to nats")

    stan.on('close',()=>{
        console.log("nats connection closed")
        process.exit();
    })
    stan.on('error', (err) => {
  console.log('Stan connection error:', err);
});

   new TicketCreatedListner(stan).listen();
})


process.on("SIGINT",()=>stan.close())
process.on("SIGTERM",()=>stan.close())





