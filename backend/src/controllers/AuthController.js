"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeData = exports.googleLogin = exports.getAbout = exports.ResendOtp = exports.verifyOTP = exports.signup = exports.adminLogout = exports.LoginAdmin = exports.refresh = exports.userLogout = exports.login = void 0;
const AuthService_1 = require("../services/AuthService");
const userRepository_1 = require("../repositories/userRepository");
const generateToken_1 = require("../utils/generateToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const authService = new AuthService_1.AuthService(new userRepository_1.UserRepository());
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("reached login backend", req.body);
        const { email, password } = req.body;
        if (password) {
            console.log("data check password", password, password.length);
        }
        const { accessToken, refreshToken, user } = yield authService.login(email, password, false);
        console.log("access and refresh tookens ", accessToken, refreshToken);
        // res.cookie("accessToken", accessToken, { httpOnly: true });
        // res.cookie("refreshToken", refreshToken, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });
        console.log("Cookie added");
        res.json({ message: "Login successful", accessToken, user });
    }
    catch (error) {
        // res.status(400).json({ message: error.message });
        next(error);
    }
});
exports.login = login;
const userLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('refreshToken');
    res.status(200).json({ message: "user logged out" });
});
exports.userLogout = userLogout;
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            console.log("decoded ", decoded);
            // const accessToken = generateAccessToken(decoded);
            const accessToken = (0, generateToken_1.generateAccessToken)({ _id: decoded.id, isAdmin: decoded.isAdmin });
            console.log(" new CcessToken from refresh accessToken", accessToken);
            // res.cookie("accessToken", accessToken, { httpOnly: true });
            res.json({ accessToken });
        }
        else {
            res.status(403).json({ message: "No token in cookie" });
        }
    }
    catch (_a) {
        res.sendStatus(403);
    }
});
exports.refresh = refresh;
const LoginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("reached admin backend");
        const { email, password } = req.body;
        const { accessToken, refreshToken, user } = yield authService.login(email, password, true);
        // res.cookie("accessTokenAdmin", accessToken, { httpOnly: true });
        // res.cookie("refreshTokenAdmin", refreshToken, { httpOnly: true });
        res.cookie('refreshTokenAdmin', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.json({ message: "Admin login successful", accessToken, user });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(400).json({ message: "An unknown error occurred" });
        }
    }
});
exports.LoginAdmin = LoginAdmin;
const adminLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessTokenAdmin");
    res.status(200).json({ message: "Logged out successfully" });
});
exports.adminLogout = adminLogout;
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        console.log("signup details", req.body, password.length);
        const response = yield authService.singup(name, email, password);
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.signup = signup;
const verifyOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("its here");
        console.log("verofy: ", req.body);
        const { email, otp, name, password } = req.body;
        const response = yield authService.verifyOTP(email, otp, name, password);
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.verifyOTP = verifyOTP;
const ResendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const response = yield authService.resendOTP(email);
        console.log("data passed from controller");
    }
    catch (error) {
        next(error);
    }
});
exports.ResendOtp = ResendOtp;
const getAbout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log(req.user);
        const name = User_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        console.log("from getAbout: ", name);
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAbout = getAbout;
const googleLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("reached google backend");
        const { idToken } = req.body;
        console.log("idTOkrn", idToken);
        const { accessToken, refreshToken, user } = yield authService.googleLogin(idToken);
        console.log("access,refres,user", accessToken, refreshToken, user);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.status(200).json({ message: "Google login successfull", accessToken, user });
    }
    catch (error) {
        next(error);
    }
});
exports.googleLogin = googleLogin;
const HomeData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield authService.HomeData();
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.HomeData = HomeData;
