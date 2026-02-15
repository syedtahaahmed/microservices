import mongoose from "mongoose";
import { Password } from "../services/password.js";


//interface to create auser
interface userAttrs {
    email: string;
    password: string
}

//what entire collection of users looks like
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: userAttrs): UserDoc;
}

//what properties a single user has
interface UserDoc extends mongoose.Document{
    email:string;
    password:string
}


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
},{
    toJSON:{
        transform(doc,ret:any){
            ret.id=ret._id;
            delete ret._id
            delete ret.password;
            delete ret.__v
        }
    }
})


userSchema.pre('save',async function () {
    if(this.isModified('password')){
        const hashed=await Password.toHash(this.get('password'))
        this.set('password',hashed);
    }
    
})


userSchema.statics.build = (attrs: userAttrs) => {
    return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>("User", userSchema)





export { User }