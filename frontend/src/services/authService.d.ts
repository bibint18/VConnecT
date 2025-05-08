export declare const loginUser: (email: string, password: string, recaptchaToken: string) => Promise<any>;
export declare const logoutUser: () => Promise<void>;
export declare const loginAdmin: (email: string, password: string) => Promise<any>;
export declare const adminLogout: () => Promise<void>;
