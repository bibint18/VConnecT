export class UpdateProfileResponseDTO {
  user: {
    name: string;
    email: string;
    profileImage?: string;
    mobile?: string;
    username?: string;
    country?: string;
    description?: string;
    gender?: string;
    streak?: number;
    lastStreakUpdate?: string;
  };
  message: string;

  constructor(user: {
    name: string;
    email: string;
    profileImage?: string;
    mobile?: string;
    username?: string;
    country?: string;
    description?: string;
    gender?: string;
    streak?: number;
    lastStreakUpdate?: string;
  }, message: string) {
    this.user = user;
    this.message = message;
  }
}