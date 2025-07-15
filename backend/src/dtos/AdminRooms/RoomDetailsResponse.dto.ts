import { IsString, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsArray, ValidateNested, IsDateString, IsOptional } from "class-validator";
import { Type } from "class-transformer";

class ParticipantDTO {
  @IsString()
  @IsNotEmpty({ message: "Participant name is required" })
  name: string = "";

  @IsString()
  @IsNotEmpty({ message: "Participant email is required" })
  email: string = "";

  @IsDateString()
  firstJoin: string = "";

  @IsDateString()
  lastJoin: string = "";

  @IsDateString()
  @IsOptional()
  lastLeave?: string;

  @IsNumber()
  totalDuration: number = 0;

  constructor(
    name?: string,
    email?: string,
    firstJoin?: string,
    lastJoin?: string,
    lastLeave?: string,
    totalDuration?: number
  ) {
    this.name = name ?? "";
    this.email = email ?? "";
    this.firstJoin = firstJoin ?? "";
    this.lastJoin = lastJoin ?? "";
    this.lastLeave = lastLeave;
    this.totalDuration = totalDuration ?? 0;
  }
}

export class RoomDetailsResponseDTO {
  @IsString()
  @IsNotEmpty({ message: "Room ID is required" })
  _id: string = "";

  @IsString()
  @IsNotEmpty({ message: "Title is required" })
  title: string = "";

  @IsEnum(["PUBLIC", "PRIVATE"], { message: "Type must be PUBLIC or PRIVATE" })
  type: "PUBLIC" | "PRIVATE" = "PUBLIC";

  @IsNumber()
  limit: number = 0;

  @IsBoolean()
  premium: boolean = false;

  @IsString()
  description: string = "";

  @IsString()
  @IsNotEmpty({ message: "Created by name is required" })
  createdByName: string = "";

  @IsString()
  @IsNotEmpty({ message: "Created by email is required" })
  createdByEmail: string = "";

  @IsDateString()
  createdAt: string = "";

  @IsBoolean()
  isBlocked: boolean = false;

  @IsString()
  @IsOptional()
  secretCode?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParticipantDTO)
  participants: ParticipantDTO[] = [];

  constructor(
    _id?: string,
    title?: string,
    type?: "PUBLIC" | "PRIVATE",
    limit?: number,
    premium?: boolean,
    description?: string,
    createdByName?: string,
    createdByEmail?: string,
    createdAt?: string,
    isBlocked?: boolean,
    secretCode?: string,
    participants?: ParticipantDTO[]
  ) {
    this._id = _id ?? "";
    this.title = title ?? "";
    this.type = type ?? "PUBLIC";
    this.limit = limit ?? 0;
    this.premium = premium ?? false;
    this.description = description ?? "";
    this.createdByName = createdByName ?? "";
    this.createdByEmail = createdByEmail ?? "";
    this.createdAt = createdAt ?? "";
    this.isBlocked = isBlocked ?? false;
    this.secretCode = secretCode;
    this.participants = participants ?? [];
  }
}