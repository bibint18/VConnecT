export class GetProfileResponseDTO {
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
  }) {
    this.user = user;
  }
}