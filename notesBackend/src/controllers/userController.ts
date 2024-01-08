import {Request, Response} from 'express';
import * as userService from '../services/userService';
import { createUserSchema, loginUserSchema} from '../validators/userValidator';

export const signup = (req : Request, res: Response ): void => {
  // Validate request body when creating a user
  const { error } = createUserSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }


    const { id, username, email, password } = req.body;
    
    //Check if new email already exists 
    if(userService.findUserByEmail(email)){
        res.status(400).json({error: 'Email is already registered'});
        return;
    }

    //Create New User
    const newUser = userService.createUser({id, username, email, password});
    
    res.status(201).json({message: 'User created successfully', user: newUser});
}



export const login = (req: Request, res: Response) : void => {
  // Validate request body when logging in
  const { error } = loginUserSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

    const {id, username, email, password} = req.body;

    //Find user by email 
    const userLogin =  userService.findUserByEmail(email);

    //check if the user exists and the password is  valid 
    if(!userLogin || !userService.validatePassword(userLogin, password)){
        res.status(401).json({error:'Invalid email or password'});
        return;
    }

    // Generate both access and refresh tokens
  const { accessToken, refreshToken } = userService.generateTokens(userLogin);

    res.status(200).json({message: 'Login Successful', accessToken, refreshToken});

}


//Handle token refreshing 


export const refreshToken = (req:Request, res:Response): void => {
    const {refreshToken} = req.body;
    if(!refreshToken){
        res.status(400).json({error:'Refresh token is required'});
        return;
    }

    const newAccessToken = userService.refreshToken(refreshToken);

    if(newAccessToken){
        res.json({accessToken:newAccessToken});
    }
    else{
        res.status(401).json({error:'Invalid refresh token'});
    }

};