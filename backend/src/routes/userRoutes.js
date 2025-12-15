import express from 'express';
import userController from '../controllers/userController.js';
import { validateRegister, validateLogin } from '../middleware/validate.js';
import {authToken} from '../middleware/auth.js';
const userRouter = express.Router();

userRouter.post('/register',userController.register);


userRouter.post('/login',userController.login);

userRouter.get('/get-saved-recipients',authToken,userController.getSavedRecipients);

export default userRouter;