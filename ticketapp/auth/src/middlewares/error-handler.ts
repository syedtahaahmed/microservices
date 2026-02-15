import { Request, Response, NextFunction } from "express"
import { CustomError } from "../errors/custom-errors.js"
// import { RequestValidationError } from "../errors/request-validation-errors.js"
// import { DatabaseConnectionError } from "../errors/database-connection-errors.js"

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log("somethubng went wroing")
    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeErrors() })
    }
    res.status(400).send({
        errors: [{ message: "Something is not correct" }]
    })
}