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
exports.restrictToAdmin = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
// interface AuthenticatedRequest extends Request {
//   user?: DecodedUser;
// }
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expect "Bearer <token>"
    console.log("at middleware token ", token);
    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        if (!req.user) {
            res.status(401).json({ message: 'please login' });
            return;
        }
        console.log("re.user", req.user);
        const user = yield User_1.User.findById(req.user.id);
        if (user === null || user === void 0 ? void 0 : user.isBlocked) {
            res.status(403).json({ message: "User is blocked" });
            return;
        }
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
    }
});
exports.authenticateToken = authenticateToken;
const restrictToAdmin = (req, res, next) => {
    var _a;
    console.log(req.user);
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
        res.status(403).json({ message: 'Admin access required' });
        return;
    }
    next();
};
exports.restrictToAdmin = restrictToAdmin;
