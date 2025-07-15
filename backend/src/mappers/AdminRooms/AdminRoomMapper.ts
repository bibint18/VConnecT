import { IRoom } from "../../models/RoomModel";
import { RoomResponseDTO } from "../../dtos/AdminRooms/RoomResponse.dto";
import { RoomListResponseDTO } from "../../dtos/AdminRooms/RoomListResponse.dto";
import { RoomDetailsResponseDTO } from "../../dtos/AdminRooms/RoomDetailsResponse.dto";
export class RoomMapper {
  static toRoomResponse(room: IRoom): RoomResponseDTO {
    return new RoomResponseDTO(
      room._id?.toString(),
      room.title,
      (room.createdBy as any)?.name ?? "Unknown",
      (room.createdBy as any)?.email ?? "Unknown",
      room.type,
      room.limit,
      room.participants.length,
      room.isBlocked
    );
  }

  static toRoomListResponse(rooms: IRoom[], totalRooms: number): RoomListResponseDTO {
    const roomDTOs = rooms.map((room) => this.toRoomResponse(room));
    return new RoomListResponseDTO(roomDTOs, totalRooms);
  }

  static toRoomDetailsResponse(room: IRoom): RoomDetailsResponseDTO {
    const participantDTOs = room.participants.map((participant) => ({
      name: (participant.userId as any)?.name ?? "Unknown",
      email: (participant.userId as any)?.email ?? "Unknown",
      firstJoin: participant.firstJoin.toISOString(),
      lastJoin: participant.lastJoin.toISOString(),
      lastLeave: participant.lastLeave?.toISOString(),
      totalDuration: participant.totalDuration,
    }));

    return new RoomDetailsResponseDTO(
      room._id?.toString(),
      room.title,
      room.type,
      room.limit,
      room.premium,
      room.description,
      (room.createdBy as any)?.name ?? "Unknown",
      (room.createdBy as any)?.email ?? "Unknown",
      room.createdAt?.toISOString(),
      room.isBlocked,
      room.secretCode,
      participantDTOs
    );
  }
}