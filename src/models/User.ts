import { Base } from "./Base";

interface ApiUser {
  id: string;
  username: string;
  name: string;
  flags: number;
}

export class User extends Base implements ApiUser {
  username: string;
  name: string;
  flags: number;

  constructor(user: ApiUser) {
    super();
    this.id = user.id;
    this.username = user.username;
    this.name = user.name;
    this.flags = user.flags;
  }
}
