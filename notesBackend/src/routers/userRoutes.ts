import express from 'express';
import * as userController from '../controllers/userController';

const userRouter = express.Router();

userRouter.post('/signup', userController.signup);
userRouter.post('/login', userController.login);
userRouter.post('/refresh',userController.refreshToken);

export default userRouter;