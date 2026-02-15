const express = require('express');

const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.json())

const events=[];
app.post('/events', (req, res) => {
    const event = req.body;
events.push(event);
    axios.post("http://posts-clusterip-srv:4000/events", event).catch((err => {
         console.log("error while sening 4000/events")
    }))
    axios.post("http://comments-srv:4001/events", event).catch((err => {
         console.log("error while sening 4001/events")
    }))
    axios.post("http://query-srv:4002/events", event).catch((err => {
         console.log("error while sening 4002/events")
    }))
    axios.post("http://moderation-srv:4003/events", event).catch((err => {
        console.log("error while sening 4003/events")
    }))
    res.send({ status: 'ok' })

})
app.get('/events',(req,res)=>{
    res.send(events);
})


app.listen(4005, () => {
    console.log("4005")
})