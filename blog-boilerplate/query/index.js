const express = require('express');
const cors = require('cors')
const axios = require('axios')
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.use(cors());
// posts={
//     "ijsks":{
//         id:"asdf",
//         title:"asdfsd",
//         comments:[
//             {id:"Asdf",content:"asdfasd"}
//         ]
//     }
// }
const posts = {};




app.get("/posts", (req, res) => {
    res.send(posts)

})
const handleEvent = (type, data) => {
    if (type == "PostCreated") {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] }
    }
    if (type == "CommentCreated") {
        console.log("commnet moderated received")
        const { id, content, postId, status } = data;
        const post = posts[postId];
        post.comments.push({ id, content, status });
    }
    console.log(" commendt uodated received")

    if (type == "CommentUpdated") {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return comment.id == id
        })
        comment.status = status;
        comment.content = content;
        console.log(comment, "Asdsd")

    }
}

app.post("/events", (req, res) => {
    const { type, data } = req.body;
    handleEvent(type, data)
    res.send({})

})

app.listen(4002, async () => {
    console.log("4002")
    try {
        const res = await axios.get("http://event-bus-srv:4005/eents")
        for (let event of res.data) {
            console.log("preoeing")
            handleEvent(event.type, event.data);
        }
    } catch (error) {

    }
})


