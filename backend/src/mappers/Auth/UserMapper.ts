// src/mappers/auth/UserMapper.ts

import { IUser } from "../../models/User";
import { UserResponseDTO } from "../../dtos/auth/loginResponseDto";

export class UserMapper {
  static toLoginResponse(user: IUser): UserResponseDTO {
    return new UserResponseDTO(
      user._id.toString(),
      user.name,
      user.email,
      user.username || "",
    );
  }
}
