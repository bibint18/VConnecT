declare global {
    interface Window {
        cloudinary: {
            createUploadWidget: (options: {
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
            }, callback: (error: Error | null, result: CloudinaryUploadResult) => void) => {
                open: () => void;
                close: () => void;
            };
        };
    }
}
export declare const ProfileContent: () => import("react/jsx-runtime").JSX.Element;
