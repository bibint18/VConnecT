export interface IAuthService {
  signup(name: string, email: string, password: string): Promise<{ message: string }>;
  sendOTP(email: string, otp: string): Promise<{ message: string }>;
  verifyOTP(
    email: string,
    otp: string,
    name: string,
    password: string
  ): Promise<{ message: string; user: any }>;
  resendOTP(email: string): Promise<void>;
  login(
    email: string,
    password: string,
    isAdminLogin: boolean
  ): Promise<{ accessToken: string; refreshToken: string; user: any }>;
  googleLogin(
    idToken: string
  ): Promise<{ accessToken: string; refreshToken: string; user: any }>;
  generateUniqueUsername(base: string): Promise<string>;
  HomeData(): Promise<{ roomCount: number; userCount: number }>;
}
