import jwt from 'jsonwebtoken'
import { IUser } from "../models/User";

interface TokenUser {
  _id: string;
  isAdmin: boolean;
}
export const generateAccessToken = (user: TokenUser) => {
  console.log("reached utils generate")
  console.log("user: ",user)
  return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "1m",
  });
};

export const generateRefreshToken = (user: IUser) => {
  console.log("generate refresh token")
  return jwt.sign({ id: user._id,isAdmin: user.isAdmin }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "7d",
  });
};
