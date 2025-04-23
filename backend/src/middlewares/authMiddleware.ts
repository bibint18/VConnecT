

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

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

export const authenticateToken =async (req: Request, res: Response, next: NextFunction):Promise<void> => {
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
    if(!req.user){
      res.status(401).json({ message: 'please login' });
    return
    }
    console.log("re.user",req.user)
    const user = await User.findById(req.user.id)
    if(user?.isBlocked){
      res.status(403).json({ message: "User is blocked"})
      return
    }
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