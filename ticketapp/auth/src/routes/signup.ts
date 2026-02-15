import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-errors.js';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken'
// import { BadRequestError } from '../errors/bad-requestError.js';
// import { validateRequest } from '../middlewares/validate-request.js';
import { BadRequestError,validateRequest } from '@sgtickets/common';

declare global {
  namespace Express {
    interface Request {
      session?: {
        jwt?: string;
      };
    }
  }
}
const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters')
  ],validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("email in use")
      throw new BadRequestError("email in use")
    }
    const user = User.build({ email, password });
    await user.save();
    const userJwt = jwt.sign({
      id: user._id,
      email: user.email
    }, process.env.JWT_KEY!)
    req.session = {
      jwt: userJwt
    }
    res.status(201).send(user);


  }
);

export { router as signupRouter };
