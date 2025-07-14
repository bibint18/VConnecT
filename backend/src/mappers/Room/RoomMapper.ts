import { IRoom } from "../../models/RoomModel";
import { IUser } from "../../models/User";

interface RoomResponseDTO {
  room: {
    _id: string;
    title: string;
    limit: number;
    premium: boolean;
    type: "PUBLIC" | "PRIVATE";
    description: string;
    createdAt: Date;
    createdBy: { name: string; email: string };
    participants: {
      userId: { name: string; email: string } | null;
      firstJoin: Date;
      lastJoin: Date;
      lastLeave: Date | null;
      totalDuration: number;
    }[];
    secretCode?:string
  };
  message?: string; 
}

interface RoomsResponseDTO {
  rooms: RoomResponseDTO["room"][];
  user: {
    name: string;
    email: string;
    availableRoomLimit: number;
  } | null;
  total: number;
}

interface MessageResponseDTO {
  message: string;
}

export class RoomMapper {
  static toRoomResponse(room: IRoom): RoomResponseDTO {
    console.log("[RoomMapper] toRoomResponse - Input room:", room);
    return {
      room: {
        _id: room._id?.toString() || "",
        title: room.title,
        limit: room.limit,
        premium: room.premium,
        type:room.type, 
        description: room.description,
        createdAt: room.createdAt || new Date(),
        createdBy: {
          name: (room.createdBy as unknown as IUser).name || "",
          email: (room.createdBy as unknown as IUser).email || "",
        },
        participants: room.participants.map((p) => ({
          userId: {
            name: (p.userId as unknown as IUser).name || "",
            email: (p.userId as unknown as IUser).email || "",
          },
          firstJoin: p.firstJoin,
          lastJoin: p.lastJoin,
          lastLeave: p.lastLeave,
          totalDuration: p.totalDuration,
        })),
      },
    };
  }

  static toRoomsResponse(rooms: IRoom[], user: IUser | null, total: number): RoomsResponseDTO {
    console.log("[RoomMapper] toRoomsResponse - Input rooms:", rooms, "User:", user, "Total:", total);
    return {
      rooms: rooms.map((room) => RoomMapper.toRoomResponse(room).room),
      user: user
        ? {
            name: user.name,
            email: user.email,
            availableRoomLimit: user.availableRoomLimit,
          }
        : null,
      total,
    };
  }

  static toDeleteRoomResponse(): MessageResponseDTO {
    return { message: "Room deleted successfully" };
  }
}