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
exports.AuthService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const OtpModel_1 = require("../models/OtpModel");
const generateToken_1 = require("../utils/generateToken");
const google_auth_library_1 = require("google-auth-library");
const AppError_1 = require("../utils/AppError");
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
class AuthService {
    constructor(userRepo) {
        this.userRepository = userRepo;
    }
    singup(name, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userRepository.findByEmail(email);
            console.log("reaching here");
            console.log("existing user", existingUser);
            if (existingUser)
                throw new Error("Email already exist");
            // const hashedPassword = await bcrypt.hash(password,10)
            // const data = {name:name,email:email,password:hashedPassword,isVerified:false}
            // await this.userRepository.createUser(data)
            const otp = crypto_1.default.randomInt(100000, 999999).toString();
            console.log("otp code ", otp);
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
            // await OtpVerification.updateOne(
            //   { email },
            //   { email, otp, expiresAt: otpExpiry },
            //   { upsert: true } 
            // );
            yield this.userRepository.updateOtp(email, otp, otpExpiry);
            yield this.sendOTP(email, otp);
            return { message: "OTP sent successfully!" };
        });
    }
    sendOTP(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
                service: "gmail",
                auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD }
            });
            yield transporter.sendMail({
                from: process.env.EMAIL,
                to: email,
                subject: "Your OTP Code",
                text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
            });
            return { message: "Otp sent successfully!" };
        });
    }
    verifyOTP(email, otp, name, password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("here");
            console.log("Received data:", { email, otp, name, password });
            // Check if OTP exists
            const otpRecord = yield OtpModel_1.OtpVerification.findOne({ email });
            console.log("otpRecord", otpRecord);
            if (!otpRecord) {
                console.log("OTP not found");
                throw new Error("OTP expired or invalid. Please request a new one.");
            }
            if (otpRecord.otp !== otp) {
                console.log("Incorrect OTP:", otp, "Stored OTP:", otpRecord.otp);
                throw new Error("Incorrect OTP.");
            }
            if (new Date() > otpRecord.expiresAt) {
                console.log("OTP Expired");
                throw new Error("OTP has expired. Request a new one.");
            }
            if (!name || !password) {
                console.log("Name or password is missing", { name, password });
                throw new Error("Invalid request: Missing name or password.");
            }
            console.log("Hashing password...");
            console.log("to be hashed: ", password);
            console.log("length of psw", password.length);
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            console.log("Password hashed:", hashedPassword);
            const isMatch = yield bcryptjs_1.default.compare(password, hashedPassword);
            console.log("Ismatch after the hashing", isMatch);
            const username = yield this.generateUniqueUsername(name);
            const newUser = yield this.userRepository.createUser({
                name,
                email,
                password: hashedPassword,
                isVerified: true,
                username: username
            });
            console.log("User created successfully:", newUser);
            yield OtpModel_1.OtpVerification.deleteOne({ email });
            return { message: "Signup successful", user: newUser };
        });
    }
    resendOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = crypto_1.default.randomInt(100000, 999999).toString();
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
            yield this.userRepository.updateOtp(email, otp, otpExpiry);
            yield this.sendOTP(email, otp);
        });
    }
    login(email, password, isAdminLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("at service as last password: ", password, password.length);
            const user = yield this.userRepository.findByEmail(email);
            if (!user)
                throw new Error("No user");
            if (user)
                console.log("Stored hashed password:", user.password);
            if (user === null || user === void 0 ? void 0 : user.isBlocked)
                throw new Error("User blocked");
            console.log("reached auth login,user: ", user);
            if (!user)
                throw new AppError_1.AppError("Invalid credentials", 403);
            if (isAdminLogin && !user.isAdmin)
                throw new Error("Unauthorized access");
            if (user.failedLoginAttempts >= 3 && user.lockUntil && user.lockUntil > new Date()) {
                throw new Error("account locked try again later");
            }
            const isMatch = yield bcryptjs_1.default.compare(password, user.password);
            console.log("ismatch: ", isMatch);
            if (!isMatch) {
                yield this.userRepository.updateUser(email, {
                    failedLoginAttempts: user.failedLoginAttempts + 1,
                    lockUntil: user.failedLoginAttempts + 2 >= 3 ? new Date(Date.now() + 10 * 60 * 1000) : null
                });
                throw new Error("Invalid credentials");
            }
            yield this.userRepository.updateUser(email, { failedLoginAttempts: 0, lockUntil: null });
            const accessToken = (0, generateToken_1.generateAccessToken)(user);
            console.log("service avcess token", accessToken);
            const refreshToken = (0, generateToken_1.generateRefreshToken)(user);
            return { accessToken, refreshToken, user };
        });
    }
    googleLogin(idToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticket = yield googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            console.log("at google service", ticket);
            const payload = ticket.getPayload();
            console.log("payloadd", payload);
            if (!payload)
                throw new AppError_1.AppError('Invalid GOOGLE TOKEN', 401);
            const { email, name, sub: googleId } = payload;
            if (!email) {
                throw new AppError_1.AppError("Email not provided by Google", 400);
            }
            let user = yield this.userRepository.findByEmail(email);
            if (user) {
                if (user === null || user === void 0 ? void 0 : user.isBlocked) {
                    throw new AppError_1.AppError("User is blocked", 403);
                }
            }
            else {
                const username = yield this.generateUniqueUsername(email);
                user = yield this.userRepository.createUser({
                    email,
                    name: name || "Google User",
                    password: '',
                    isVerified: true,
                    googleId,
                    isAdmin: false,
                    isBlocked: false,
                    failedLoginAttempts: 0,
                    lockUntil: null,
                    username: username
                });
            }
            if (!user) {
                throw new AppError_1.AppError("User creation failed", 500);
            }
            const accessToken = (0, generateToken_1.generateAccessToken)(user);
            const refreshToken = (0, generateToken_1.generateRefreshToken)(user);
            return { accessToken, refreshToken, user };
        });
    }
    generateUniqueUsername(base) {
        return __awaiter(this, void 0, void 0, function* () {
            const prefix = base.slice(0, 4).toLowerCase();
            let username;
            let isUnique = false;
            let attempts = 0;
            const maxAttempts = 10;
            while (!isUnique && attempts < maxAttempts) {
                const randomNum = Math.floor(1000 + Math.random() * 9000);
                username = `${prefix}${randomNum}`;
                const existingUsername = yield this.userRepository.findByUsername(username);
                if (!existingUsername) {
                    isUnique = true;
                }
                attempts++;
            }
            if (!isUnique) {
                throw new AppError_1.AppError("cant generate unique username", 500);
            }
            return username;
        });
    }
    HomeData() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.Homedata();
        });
    }
}
exports.AuthService = AuthService;
