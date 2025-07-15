import { IsString, IsBoolean, IsEnum, IsNotEmpty,IsNumber } from "class-validator";

export class RoomResponseDTO {
  @IsString()
  @IsNotEmpty({ message: "Room ID is required" })
  _id: string = "";

  @IsString()
  @IsNotEmpty({ message: "Title is required" })
  title: string = "";

  @IsString()
  @IsNotEmpty({ message: "Created by name is required" })
  createdByName: string = "";

  @IsString()
  @IsNotEmpty({ message: "Created by email is required" })
  createdByEmail: string = "";

  @IsEnum(["PUBLIC", "PRIVATE"], { message: "Type must be PUBLIC or PRIVATE" })
  type: "PUBLIC" | "PRIVATE" = "PUBLIC";

  @IsNumber()
  limit: number = 0;

  @IsNumber()
  participantCount: number = 0;

  @IsBoolean()
  isBlocked: boolean = false;

  constructor(
    _id?: string,
    title?: string,
    createdByName?: string,
    createdByEmail?: string,
    type?: "PUBLIC" | "PRIVATE",
    limit?: number,
    participantCount?: number,
    isBlocked?: boolean
  ) {
    this._id = _id ?? "";
    this.title = title ?? "";
    this.createdByName = createdByName ?? "";
    this.createdByEmail = createdByEmail ?? "";
    this.type = type ?? "PUBLIC";
    this.limit = limit ?? 0;
    this.participantCount = participantCount ?? 0;
    this.isBlocked = isBlocked ?? false;
  }
}