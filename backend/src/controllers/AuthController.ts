import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";
import { UserRepository } from "../repositories/userRepository.js";
import { generateAccessToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { HTTP_STATUS_CODE } from "../utils/statusCode.js";
import {UserMapper } from "../mappers/Auth/UserMapper.js";
const authService = new AuthService(new UserRepository());

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await authService.login(
      email,
      password,
      false
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    const loginResponseDto=UserMapper.toLoginResponse(user)
   res.json({ message: "Login successful", accessToken, user:loginResponseDto });
   return
  } catch (error) {
    next(error);
  }
};
export const userLogout = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.status(HTTP_STATUS_CODE.OK).json({ message: "user logged out" });
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ message: "NO refresh token provided" });
    }
    if (refreshToken) {
      const decoded: any = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      );
      const accessToken = generateAccessToken({
        _id: decoded.id,
        isAdmin: decoded.isAdmin,
      });
      res.json({ accessToken });
    } else {
      res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ message: "No token in cookie" });
    }
  } catch {
    res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND);
  }
};

export const LoginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await authService.login(
      email,
      password,
      true
    );
    res.cookie("refreshTokenAdmin", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ message: "Admin login successful", accessToken, user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ message: error.message });
    } else {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ message: "An unknown error occurred" });
    }
  }
};

export const adminLogout = async (req: Request, res: Response) => {
  res.clearCookie("accessTokenAdmin");
  res.status(HTTP_STATUS_CODE.OK).json({ message: "Logged out successfully" });
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const response = await authService.signup(name, email, password);
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
    await authService.resendOTP(email);
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
      .status(HTTP_STATUS_CODE.OK)
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
    res.status(HTTP_STATUS_CODE.OK).json(result);
  } catch (error) {
    next(error);
  }
};
