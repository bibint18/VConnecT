// src/types/cloudinary.d.ts
interface CloudinaryWidget {
  open: () => void;
  close: () => void;
}

interface CloudinaryUploadResult {
  event: string;
  info: {
    secure_url: string;
    [key: string];
  };
}

interface Cloudinary {
  createUploadWidget: (
    options: {
      cloudName: string;
      apiKey: string;
      uploadSignature: string;
      uploadSignatureTimestamp: number;
      cropping: boolean;
      croppingAspectRatio: number;
      croppingShowDimensions: boolean;
      multiple: boolean;
      maxFileSize: number;
      resourceType: string;
      folder: string;
      sources: string[];
    },
    callback: (error: Error | null, result: CloudinaryUploadResult) => void
  ) => CloudinaryWidget;
}

declare global {
  interface Window {
    cloudinary: Cloudinary;
  }
}