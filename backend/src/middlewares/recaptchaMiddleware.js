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
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require("axios");
const verifyRecaptcha = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { recaptchaToken } = req.body;
    if (!recaptchaToken) {
        res.status(400).json({ message: "reCAPTCHA token is required" });
    }
    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        if (!secretKey) {
            res.status(500).json({ message: "Missing reCAPTCHA secret key" });
        }
        const response = yield axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: secretKey,
                response: recaptchaToken,
            },
        });
        if (!response.data.success) {
            res.status(400).json({ message: "reCAPTCHA verification failed" });
        }
        next();
    }
    catch (error) {
        // return res.status(500).json({ message: "Error verifying reCAPTCHA" });
        next(error);
    }
});
exports.default = verifyRecaptcha;
