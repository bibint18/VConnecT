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
exports.CloudinaryService = void 0;
const cloudinary_1 = require("cloudinary");
const AppError_1 = require("../../../utils/AppError");
class CloudinaryService {
    constructor() {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    generateUploadSignature() {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const paramsToSign = {
            timestamp,
            folder: 'chat_media',
        };
        const signature = cloudinary_1.v2.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);
        return { signature, timestamp };
    }
    deleteMedia(publicId, resourceType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield cloudinary_1.v2.uploader.destroy(publicId, { resource_type: resourceType });
            }
            catch (error) {
                throw new AppError_1.AppError(`Failed to delete media ${publicId}`, 500);
            }
        });
    }
}
exports.CloudinaryService = CloudinaryService;
