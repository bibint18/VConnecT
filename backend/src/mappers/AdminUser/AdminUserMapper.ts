import { IUser } from "../../models/User.js";
import { UserResponseDTO,UsersResponseDTO,UserActionResponseDTO } from "../../dtos/AdminUser/AdminUserDTO.js";

export class UserMapper {
  static toUserResponseDTO(user: IUser): UserResponseDTO {
    console.log("[UserMapper] toUserResponseDTO - Input user:", user);
    const activePlan = user.plan?.find((p) => p.status === "active");
    return {
      _id: user._id?.toString() || "",
      name: user.name || "",
      email: user.email || "",
      plan: activePlan
        ? {
            planName: activePlan.planName || "Unknown",
            status: activePlan.status,
          }
        : null,
      isBlocked: user.isBlocked || false,
    };
  }

  static toUsersResponseDTO(users: IUser[], totalUsers: number): UsersResponseDTO {
    console.log("[UserMapper] toUsersResponseDTO - Input users:", users, "Total:", totalUsers);
    return {
      users: users.map((user) => UserMapper.toUserResponseDTO(user)),
      totalUsers,
    };
  }

  static toBlockUserResponseDTO(user: IUser): UserActionResponseDTO {
    return {
      message: "User blocked successfully",
      user: UserMapper.toUserResponseDTO(user),
    };
  }

  static toUnblockUserResponseDTO(user: IUser): UserActionResponseDTO {
    return {
      message: "User unblocked successfully",
      user: UserMapper.toUserResponseDTO(user),
    };
  }

  static toDeleteUserResponseDTO(user: IUser): UserActionResponseDTO {
    return {
      message: "User deleted successfully",
      user: UserMapper.toUserResponseDTO(user),
    };
  }
}