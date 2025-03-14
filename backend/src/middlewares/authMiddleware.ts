// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { generateAccessToken } from "../utils/generateToken";
// // import { IUser } from "../models/User";

// interface AuthRequest extends Request {
//   user?: { id: string; isAdmin: boolean };
// }

// export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     let token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//     if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" });

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, async (err: any, decoded: any) => {
//       if (err) {
//         const refreshToken = req.cookies.refreshToken;
//         if (!refreshToken) return res.status(401).json({ message: "Forbidden - No refresh token" });

//         try {
//           const decodedRefresh: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
//           const newAccessToken = generateAccessToken(decodedRefresh); 
//           res.cookie("accessToken", newAccessToken, { httpOnly: true });
//           req.user = { id: decodedRefresh.id, isAdmin: decodedRefresh.isAdmin };
//           return next();
//         } catch {
//           return res.status(403).json({ message: "Invalid refresh token" });
//         }
//       } else {
//         req.user = { id: decoded.id, isAdmin: decoded.isAdmin };
//         next();
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };


// export const verifyAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
//   if (!req.user) return res.status(401).json({ message: "Unauthorized" });
//   if (!req.user.isAdmin) return res.status(403).json({ message: "Forbidden - Admins only" });
//   next();
// };






import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedUser {
  id: string;
  isAdmin: boolean;
}

declare module 'express' {
  interface Request {
    user?: DecodedUser;
  }
}
// interface AuthenticatedRequest extends Request {
//   user?: DecodedUser;
// }

export const authenticateToken = (req: Request, res: Response, next: NextFunction):void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expect "Bearer <token>"
  console.log("at middleware token ",token)
  if (!token){
    res.status(401).json({ message: 'No token provided' });
    return
  } 

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as DecodedUser;
    req.user = decoded;
    console.log("re.user",req.user)
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
    return
  }
};

export const restrictToAdmin = (req: Request, res: Response, next: NextFunction):void => {
  console.log(req.user)
  if (!req.user?.isAdmin) {
    res.status(403).json({ message: 'Admin access required' });
    return 
  }
  next();
};