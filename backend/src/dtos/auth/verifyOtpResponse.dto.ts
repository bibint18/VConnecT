import { UserResponseDTO } from "./loginResponseDto";

export class VerifyOtpResponseDTO {
  message: string;
  user: UserResponseDTO;

  constructor(message: string, user: UserResponseDTO) {
    this.message = message;
    this.user = user;
  }
}