import { RoomFormData } from "@/components/User/Room/AddRoom";
export declare const createRoom: (RoomData: RoomFormData) => Promise<any>;
export declare const getAllRooms: (page?: number, limit?: number, search?: string, type?: "PUBLIC" | "PRIVATE" | "") => Promise<any>;
export declare const joinRoom: (roomId: string, secretCode?: string) => Promise<any>;
export interface Participant {
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    firstJoin: Date;
    lastJoin: Date;
    lastLeave: Date | null;
    totalDuration: number;
}
export interface IDetailRoom {
    _id: string;
    title: string;
    createdBy: {
        _id: string;
        name: string;
        email: string;
    };
    limit: number;
    participants: Participant[];
    createdAt: Date;
    isDeleted?: boolean;
    isBlocked: boolean;
    type: "PUBLIC" | "PRIVATE";
    premium: boolean;
    description: string;
    secretCode?: string;
}
export declare const getRoomDetails: (roomId: string) => Promise<{
    room: IDetailRoom;
}>;
