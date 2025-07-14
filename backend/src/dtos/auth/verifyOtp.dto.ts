import { IsEmail, IsNotEmpty, MinLength, Length, Matches } from "class-validator";

export class VerifyOtpDTO {
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @IsNotEmpty({ message: "OTP is required" })
  @Length(6, 6, { message: "OTP must be 6 digits" })
  otp: string;

  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  })
  password: string;

  constructor(email?: string, otp?: string, name?: string, password?: string) {
    this.email = email ?? "";
    this.otp = otp ?? "";
    this.name = name ?? "";
    this.password = password ?? "";
  }
}