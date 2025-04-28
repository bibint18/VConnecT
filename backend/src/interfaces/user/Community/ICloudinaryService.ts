
export interface CloudinarySignature {
  signature: string;
  timestamp: number;
}

export interface ICloudinaryService {
  generateUploadSignature(): CloudinarySignature;
  deleteMedia(publicId: string, resourceType: 'image' | 'video'): Promise<void>;
}