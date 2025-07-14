import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginDTO {
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters" })
  password: string;

  constructor(email?: string, password?: string) {
    this.email = email ?? "";
    this.password = password ?? "";
  }
}
