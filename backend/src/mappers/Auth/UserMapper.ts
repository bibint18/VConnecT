import { IUser } from "../../models/User.js";
import { UserResponseDTO } from "../../dtos/auth/loginResponseDto.js";
import { SignupResponseDTO } from "../../dtos/auth/signupResponse.dto.js";
import { VerifyOtpResponseDTO } from "../../dtos/auth/verifyOtpResponse.dto.js";
import { ResendOtpResponseDTO } from "../../dtos/auth/resendOtpResponse.dto.js";
import { HomeDataResponseDTO } from "../../dtos/auth/homeDataResponse.dto.js";

export class UserMapper {
  static toLoginResponse(user: IUser): UserResponseDTO {
    return new UserResponseDTO(
      user._id.toString(),
      user.name,
      user.email,
      user.username || "",
    );
  }

  static toSignupResponse(message: string): SignupResponseDTO {
    return new SignupResponseDTO(message);
  }

  static toVerifyOtpResponse(message: string, user: IUser): VerifyOtpResponseDTO {
    const userDto = this.toLoginResponse(user);
    return new VerifyOtpResponseDTO(message, userDto);
  }

  static toResendOtpResponse(message: string): ResendOtpResponseDTO {
    return new ResendOtpResponseDTO(message);
  }

  static toHomeDataResponse(data: { roomCount: number; userCount: number }): HomeDataResponseDTO {
    return new HomeDataResponseDTO(data.roomCount, data.userCount);
  }
}
