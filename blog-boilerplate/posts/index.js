const express = require('express');
const { randomBytes } = require('crypto')
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const posts = {};
const axios = require('axios')
const cors = require('cors')
app.use(cors())

app.get('/posts', (req, res) => {
    res.send(posts)
})

app.post("/posts/create", async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;
    posts[id] = {
        id, title
    }
    await axios.post("http://event-bus-srv:4005/events", {
        type: "PostCreated",
        data: {
            id, title
        }
    }).catch(e=>console.log(e))
    res.status(201).send(posts[id])

})

app.post("/events", (req, res) => {
    console.log("received events", req, body.type);
    res.send({})
})

app.listen(4000, () => {
    console.log("on 4000")
})