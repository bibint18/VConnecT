export declare const signup: (data: {
    name: string;
    email: string;
    password: string;
}) => Promise<any>;
export declare const verifyOtp: (data: {
    email: string;
    name: string;
    password: string;
}) => Promise<any>;
