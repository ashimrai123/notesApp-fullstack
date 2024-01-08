import {user} from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const users : user[] = []; //Simulate a database with a list 
const jwt_secret = process.env.jwt_secret || 'mySecretKey';

export const createUser= async (newUser: user) : Promise<user> => {
    const hashedPassword  = await bcrypt.hash(newUser.password, 10); //hash the password
    const createdUser: user = { ...newUser, id: users.length + 1, password: hashedPassword};
    users.push(createdUser);
    return createdUser;
}


export const findUserByEmail = (email:string): user | undefined => {
    return users.find(user => email === user.email);
}


export const validatePassword = async (checkingUser: user, password: string): Promise<boolean> => {
    const  isPasswordValid = await bcrypt.compare(password,checkingUser.password);
    return isPasswordValid;
}


// GENERATE TOKENS 
export const generateTokens = (user: user): {accessToken: string; refreshToken: string} => {
    const accessToken = jwt.sign({userId: user.id}, jwt_secret, {expiresIn: '15m'});
    const refreshToken = jwt.sign({userId: user.id}, jwt_secret, {expiresIn: '7d'});
    return { accessToken, refreshToken};
}


// REFRESH TOKENS 
export const refreshToken = (refreshToken: string): string | null | undefined => {
    try {
        const decoded = jwt.verify(refreshToken, jwt_secret);
        if(typeof decoded === 'object' && 'userId' in decoded){
            const accessToken = jwt.sign({userId: decoded.userId}, jwt_secret, {expiresIn:'15m'});
            return accessToken;
        }
    }
    catch(error){
        return null;
    }
};