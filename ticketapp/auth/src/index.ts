import express from 'express';
import 'express-async-errors'
import { currentUserRouter } from './routes/current-user.js';
import { signinRouter } from './routes/signin.js';
import { signupRouter } from './routes/signup.js';
import { signoutRouter } from './routes/signout.js';
import { errorHandler } from './middlewares/error-handler.js';
import { NotfoundError } from './errors/nout-found.js';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
const app = express();
app.set("trust proxy",true)
app.use(express.json());

// app.use(cookieSession({
//     signed:false,
//     secure:true
// }))

app.use(
  cookieSession({
    signed: false,
    secure:false //process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter)


app.all('*', async (req, res) => {
    console.log(req)
    throw new NotfoundError();
})
app.use(errorHandler)
console.log("tesst added")
const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("key not found")
    }
    try {
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
        console.log("DB connected")
    } catch (error) {
        console.log(error)
    }
    app.listen(3000, '0.0.0.0', () => {
        console.log('Listening on 3000');
    });
}


start();

