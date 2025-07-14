import { IsString, MinLength, Matches } from "class-validator";

export class ChangePasswordDTO {
  @IsString({ message: "Current password must be a string" })
  @MinLength(8, { message: "Current password must be at least 8 characters" })
  currentPassword: string;

  @IsString({ message: "New password must be a string" })
  @MinLength(8, { message: "New password must be at least 8 characters" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*]{8,}$/, {
    message: "New password must contain at least one uppercase letter, one lowercase letter, and one number or special character",
  })
  newPassword: string;

  constructor(data: Partial<ChangePasswordDTO> = {}) {
    console.log("[ChangePasswordDTO] Raw input data:", data);
    this.currentPassword = data.currentPassword || "";
    this.newPassword = data.newPassword || "";
  }
}