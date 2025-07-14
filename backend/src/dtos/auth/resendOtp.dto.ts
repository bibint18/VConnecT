import { IsEmail, IsNotEmpty } from "class-validator";

export class ResendOtpDTO {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}