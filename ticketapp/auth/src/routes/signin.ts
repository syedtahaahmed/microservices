import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/user.js';
// import { validateRequest } from '../middlewares/validate-request.js';
// import { BadRequestError } from '../errors/bad-requestError.js';
import { validateRequest,BadRequestError } from '@sgtickets/common';
import { Password } from '../services/password.js';
import jwt from 'jsonwebtoken';
const router = express.Router();

router.post("/api/users/signin", [
    body('email')
        .isEmail()
        .withMessage("invalid email"),
    body('password')
        .trim()
        .notEmpty()
        .withMessage("you must apply a password")

], validateRequest, async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new BadRequestError("Invalid creds")
    }
    const passwordsMacth = await Password.compare(existingUser.password, password);
    if (!passwordsMacth) {
        throw new BadRequestError("Invalid creds")
    }
    const userJwt = jwt.sign({
        id: existingUser.directModifiedPaths,
        email: existingUser.email
    }, process.env.JWT_KEY!)
    req.session = {
        jwt: userJwt
    }
    res.status(200).send(existingUser);

})
export { router as signinRouter };