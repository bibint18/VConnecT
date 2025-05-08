interface IUserProfile {
    name: string;
    email: string;
    googleId?: string;
    mobile?: string;
    username?: string;
    country?: string;
    description?: string;
    gender?: string;
}
export declare const getUserProfile: () => Promise<any>;
export declare const updateUserProfile: (profileData: Partial<IUserProfile>) => Promise<any>;
export declare const userCheckin: () => Promise<any>;
export declare const changePassword: (data: {
    currentPassword: string;
    newPassword: string;
}) => Promise<any>;
export {};
