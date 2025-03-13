import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../utils/generateToken";
// import { IUser } from "../models/User";

interface AuthRequest extends Request {
  user?: { id: string; isAdmin: boolean };
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, async (err: any, decoded: any) => {
      if (err) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ message: "Forbidden - No refresh token" });

        try {
          const decodedRefresh: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
          const newAccessToken = generateAccessToken(decodedRefresh); 
          res.cookie("accessToken", newAccessToken, { httpOnly: true });
          req.user = { id: decodedRefresh.id, isAdmin: decodedRefresh.isAdmin };
          return next();
        } catch {
          return res.status(403).json({ message: "Invalid refresh token" });
        }
      } else {
        req.user = { id: decoded.id, isAdmin: decoded.isAdmin };
        next();
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const verifyAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (!req.user.isAdmin) return res.status(403).json({ message: "Forbidden - Admins only" });
  next();
};






