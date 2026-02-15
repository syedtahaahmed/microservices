import { CustomError } from "./custom-errors.js";

export class NotAuthorizedError extends CustomError{
    statusCode: 401;
    constructor(){
        super("Not authorized");
        Object.setPrototypeOf(this,NotAuthorizedError.prototype)
    }
    serializeErrors() {
       return [{message:"Not authorized"}]
    }

}