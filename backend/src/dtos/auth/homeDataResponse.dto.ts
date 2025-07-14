export class HomeDataResponseDTO {
  roomCount: number;
  userCount: number;

  constructor(roomCount: number, userCount: number) {
    this.roomCount = roomCount;
    this.userCount = userCount;
  }
}