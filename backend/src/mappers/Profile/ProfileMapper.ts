import { IUser } from "../../models/User.js";
import { GetProfileResponseDTO } from "../../dtos/profile/getProfileResponse.dto.js";
import { UpdateProfileResponseDTO } from "../../dtos/profile/updateProfileResponse.dto.js";
import { UpdateProfileImageResponseDTO } from "../../dtos/profile/updateProfileImageResponse.dto.js";
import { UpdateStreakResponseDTO } from "../../dtos/profile/updateStreakResponse.dto.js";
import { ChangePasswordResponseDTO } from "../../dtos/profile/changePasswordResponse.dto.js";

export class ProfileMapper {
  static toProfileResponse(user: IUser): {
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
  } {
    return {
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      mobile: user.mobile,
      username: user.username,
      country: user.country,
      description: user.description,
      gender: user.gender,
      streak: user.streak,
      lastStreakUpdate: user.lastStreakUpdate?.toISOString(),
    };
  }

  static toGetProfileResponse(user: IUser): GetProfileResponseDTO {
    return new GetProfileResponseDTO(this.toProfileResponse(user));
  }

  static toUpdateProfileResponse(user: IUser, message: string): UpdateProfileResponseDTO {
    return new UpdateProfileResponseDTO(this.toProfileResponse(user), message);
  }

  static toUpdateProfileImageResponse(user: IUser, message: string): UpdateProfileImageResponseDTO {
    return new UpdateProfileImageResponseDTO(this.toProfileResponse(user), message);
  }

  static toUpdateStreakResponse(user: IUser, message: string): UpdateStreakResponseDTO {
    return new UpdateStreakResponseDTO(this.toProfileResponse(user), message);
  }

  static toChangePasswordResponse(user: IUser, message: string): ChangePasswordResponseDTO {
    return new ChangePasswordResponseDTO(this.toProfileResponse(user), message);
  }
}