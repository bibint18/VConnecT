import jwt from 'jsonwebtoken'
import { IUser } from "../models/User.js";

interface TokenUser {
  _id: string;
  isAdmin: boolean;
}
export const generateAccessToken = (user: TokenUser) => {
  return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "2h",
  });
};

export const generateRefreshToken = (user: IUser) => {
  return jwt.sign({ id: user._id,isAdmin: user.isAdmin }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "7d",
  });
};
