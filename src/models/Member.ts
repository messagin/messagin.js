import { Base } from "./Base";

interface ApiMember {
  space_id: string;
  user_id: string;
  permissions: number;
  color: number | null;
}


export class Member extends Base implements ApiMember {
  space_id: string;
  user_id: string;
  permissions: number;
  color: number | null;

  constructor(member: ApiMember) {
    super();
    this.space_id = member.space_id;
    this.user_id = member.user_id;
    this.permissions = member.permissions;
    this.color = member.color;
  }
}
