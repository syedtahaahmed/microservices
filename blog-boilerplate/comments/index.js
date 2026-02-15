const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors')
const app = express();
const axios = require('axios');
const { connected } = require('process');
app.use(bodyParser.json());
const commentsByPostId = {};
app.use(cors())
app.get("/posts/:id/comments", (req, res) => {
    res.send(commentsByPostId[req.params.id] || [])

})

app.post("/posts/:id/comments", async (req, res) => {
    const commnetId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const comments = commentsByPostId[req.params.id] || [];
    comments.push({ id: commnetId, content, status: "pending" });
    commentsByPostId[req.params.id] = comments;
    await axios.post("http://event-bus-srv:4005/events", {
        type: "CommentCreated",
        data: {
            id: commnetId,
            content,
            postId: req.params.id,
            status: "pending"
        }
    }).catch(e => console.log(e))
            console.log("commnet moderated fired")

    res.status(201).send(comments);

})

app.post("/events"), async (req, res) => {
    const { type, data } = req.body;
    if (type == "CommentModerated") {
        console.log("comment moderation reived in comments service")
        console.log(data)
        const { postId, id, status,content } = data;
        const comments = commentsByPostId[postId];
        const comment = comments.find(comment => {
            return comment.id == id;
        })
        comment.status = status;
        console.log("firing commendt uodated")
        await axios.post("http://event-bus-srv:4005/events", {
            type: "CommentUpdated",
            data: {
                id,
                status,
                postId,
                content
            }
        }).catch(e=>console.log(e))
    }
    console.log("event reeibved", req.body.type);
    res.send({})
}

app.listen(4001, () => {
    console.log("4001")
})