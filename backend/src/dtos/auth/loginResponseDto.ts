export class UserResponseDTO {
  _id: string;
  name: string;
  email: string;
  username?: string;
  profileImage?: string;
  constructor(
    _id: string,
    name: string,
    email: string,
    username: string,
  ) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.username = username;
  }
}
