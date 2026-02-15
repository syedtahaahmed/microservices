const express=require('express');
const bodyparser=require('body-parser');
const axios=require('axios');

const app=express();
app.use(bodyparser.json());

app.post("/events",async(req,res)=>{
    const {type,data}=req.body;
    if(type=="CommentCreated"){
        const status=data.content.includes('orange')?'rejected':'approved';
        console.log("moderation staus:: ", status)
        await axios.post("http://event-bus-srv:4005/events",{
            type:"CommentModerated",
            data:{
                id:data.id,
                postId:data.postId,
                status,
                content:data.content
            }
        }).catch(e=>console.log(e))
    }
    res.send({});

})

app.listen(4003,()=>{
    console.log("4003")
})