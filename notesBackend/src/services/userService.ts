import { Knex } from "knex";
import db from "../db";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const TABLE_NAME = 'users';
const jwt_secret = process.env.jwt_secret || 'mySecretKey';

export const createUser = async (newUser: any): Promise<any> => {
  const hashedPassword = await bcrypt.hash(newUser.password, 10);

  const [createdUser] = await db(TABLE_NAME)
    .insert({
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword,
    })
    .returning('*');

  return createdUser;
};

export const findUserByEmail = async (email: string): Promise<any | undefined> => {
  const user = await db(TABLE_NAME).where('email', email).first();
  return user;
};

export const validatePassword = async (checkingUser: any, password: string): Promise<boolean> => {
  const isPasswordValid = await bcrypt.compare(password, checkingUser.password);
  return isPasswordValid;
};

export const generateTokens = (user: any): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign({ userId: user.id }, jwt_secret, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user.id }, jwt_secret, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const refreshToken = (refreshToken: string): string | null | undefined => {
  try {
    const decoded = jwt.verify(refreshToken, jwt_secret);
    if (typeof decoded === 'object' && 'userId' in decoded) {
      const accessToken = jwt.sign({ userId: decoded.userId }, jwt_secret, { expiresIn: '15m' });
      return accessToken;
    }
  } catch (error) {
    return null;
  }
};
