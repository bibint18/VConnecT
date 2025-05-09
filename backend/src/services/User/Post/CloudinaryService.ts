
import { v2 as cloudinary } from 'cloudinary';
import { CloudinarySignature,ICloudinaryService } from '../../../interfaces/user/Community/ICloudinaryService.js';
import { AppError } from '../../../utils/AppError.js';

export class CloudinaryService implements ICloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  generateUploadSignature(): CloudinarySignature {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = {
      timestamp,
      folder: 'chat_media',
    };
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );
    return { signature, timestamp };
  }

  async deleteMedia(publicId: string, resourceType: 'image' | 'video'): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
      throw new AppError(`Failed to delete media ${publicId}`, 500);
    }
  }
  
}