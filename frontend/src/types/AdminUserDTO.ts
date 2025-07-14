export interface UserResponseDTO {
  _id: string;
  name: string;
  email: string;
  plan: {
    planName: string;
    status: "active" | "expired" | "cancelled";
  } | null;
  isBlocked: boolean;
}

export interface UsersResponseDTO {
  users: UserResponseDTO[];
  totalUsers: number;
}

export interface UserActionResponseDTO {
  message: string;
  user: UserResponseDTO;
}