import { IsString, IsOptional, MinLength } from "class-validator";

export class JoinRoomDTO {
  @IsString({ message: "Room ID must be a string" })
  @MinLength(1, { message: "Room ID cannot be empty" })
  roomId: string;

  @IsOptional()
  @IsString({ message: "Secret code must be a string" })
  secretCode?: string;

  constructor(data: Partial<JoinRoomDTO> = {}) {
    console.log("[JoinRoomDTO] Constructor data:", data);
    this.roomId = data.roomId || "";
    this.secretCode = data.secretCode || undefined;
  }
}