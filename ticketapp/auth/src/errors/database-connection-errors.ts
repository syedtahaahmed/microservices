import { ValidationError } from "express-validator";
import { CustomError } from "./custom-errors.js";

export class DatabaseConnectionError extends CustomError{
    reason="Error connectiong Data base"
    statusCode=500;
    constructor(){
        super('invalid req params');

        Object.setPrototypeOf(this,DatabaseConnectionError.prototype)
    }

    serializeErrors(){
        return [ {
            message:this.reason
        }]
    }
}


