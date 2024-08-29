import { ChatManager } from "../managers/ChatManager";
import { MemberManager } from "../managers/MemberManager";
import { Base } from "./Base";

interface ApiSpace {
  id: string;
  name: string;
  owner_id: string;
  created_at: number;
};

export class Space extends Base implements ApiSpace {
  id: string;
  name: string;
  owner_id: string;
  created_at: number;

  chats: ChatManager;
  members: MemberManager;

  constructor(space: ApiSpace) {
    super();
    this.id = space.id;
    this.name = space.name;
    this.owner_id = space.owner_id;
    this.created_at = space.created_at;

    this.chats = new ChatManager(this);
    this.members = new MemberManager(this);
  }
}
