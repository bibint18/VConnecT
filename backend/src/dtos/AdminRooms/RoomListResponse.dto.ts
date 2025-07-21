import { IsArray, IsNumber, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { RoomResponseDTO } from "./RoomResponse.dto.js";

export class RoomListResponseDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoomResponseDTO)
  rooms: RoomResponseDTO[] = [];

  @IsNumber()
  totalRooms: number = 0;

  constructor(rooms: RoomResponseDTO[] = [], totalRooms: number = 0) {
    this.rooms = rooms;
    this.totalRooms = totalRooms;
  }
}