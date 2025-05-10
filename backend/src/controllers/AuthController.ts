import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";
import { UserRepository } from "../repositories/userRepository.js";
import { generateAccessToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
const authService = new AuthService(new UserRepository());

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("reached login backend", req.body);
    const { email, password } = req.body;
    if (password) {
      console.log("data check password", password, password.length);
    }
    const { accessToken, refreshToken, user } = await authService.login(
      email,
      password,
      false
    );
    console.log("access and refresh tookens ", accessToken, refreshToken);
    // res.cookie("accessToken", accessToken, { httpOnly: true });
    // res.cookie("refreshToken", refreshToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    console.log("Cookie added");
   res.json({ message: "Login successful", accessToken, user });
   return
  } catch (error) {
    // res.status(400).json({ message: error.message });
    next(error);
  }
};
export const userLogout = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "user logged out" });
};

export const refresh = async (req: Request, res: Response) => {
  try {
    console.log("Reached backend refresh Token");
    // if(!req.cookies.refreshToken){
    //   window.location.href='/login'
    // }
    // console.log("refresh token",(req as any).cookies.refreshToken)
    const refreshToken = req.cookies.refreshToken;
    // console.log("refresh Token: ",refreshToken)
    if (!refreshToken) {
      res.status(403).json({ message: "NO refresh token provided" });
    }
    if (refreshToken) {
      const decoded: any = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      );
      console.log("decoded ", decoded);
      // const accessToken = generateAccessToken(decoded);
      const accessToken = generateAccessToken({
        _id: decoded.id,
        isAdmin: decoded.isAdmin,
      });
      console.log(" new CcessToken from refresh accessToken", accessToken);
      // res.cookie("accessToken", accessToken, { httpOnly: true });
      res.json({ accessToken });
    } else {
      res.status(403).json({ message: "No token in cookie" });
    }
  } catch {
    res.sendStatus(403);
  }
};

export const LoginAdmin = async (req: Request, res: Response) => {
  try {
    console.log("reached admin backend");
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await authService.login(
      email,
      password,
      true
    );

    // res.cookie("accessTokenAdmin", accessToken, { httpOnly: true });
    // res.cookie("refreshTokenAdmin", refreshToken, { httpOnly: true });
    res.cookie("refreshTokenAdmin", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ message: "Admin login successful", accessToken, user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};

export const adminLogout = async (req: Request, res: Response) => {
  res.clearCookie("accessTokenAdmin");
  res.status(200).json({ message: "Logged out successfully" });
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    console.log("signup details", req.body, password.length);
    const response = await authService.singup(name, email, password);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("its here");
    console.log("verofy: ", req.body);

    const { email, otp, name, password } = req.body;
    const response = await authService.verifyOTP(email, otp, name, password);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const ResendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const response = await authService.resendOTP(email);
    console.log("data passed from controller", response);
  } catch (error: any) {
    next(error);
  }
};

export const getAbout = async (req: Request, res: Response) => {
  try {
    console.log(req.user);
    const name = User.findById(req.user?.id);
    console.log("from getAbout: ", name);
  } catch (error) {
    console.log(error);
  }
};

export const googleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("reached google backend");
    const { idToken } = req.body;
    console.log("idTOkrn", idToken);
    const { accessToken, refreshToken, user } = await authService.googleLogin(
      idToken
    );
    console.log("access,refres,user", accessToken, refreshToken, user);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res
      .status(200)
      .json({ message: "Google login successfull", accessToken, user });
  } catch (error) {
    next(error);
  }
};

export const HomeData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.HomeData();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
