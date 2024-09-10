import { MessageManager } from "../managers/MessageManager";
import { Internal } from "../client/Internal";
import { Base } from "./Base";
import { Space } from "./Space";

interface ApiChat {
  id: string;
  name: string;
  flags: number;
};

interface ApiSpaceChat extends ApiChat {
  space_id?: string;
}

export class Chat extends Base implements ApiChat {
  id: string;
  name: string;
  flags: number;

  messages: MessageManager;

  constructor(chat: ApiChat) {
    super();
    this.id = chat.id;
    this.name = chat.name;
    this.flags = chat.flags;

    this.messages = new MessageManager(this);
  }

  async send(content: string) {
    if (!content) return;
    Internal.API.post(`/chats/${this.id}/messages/`, { content });
  }
}

export class SpaceChat extends Chat {
  space: Space;
  space_id?: string;

  constructor(chat: ApiSpaceChat, space: Space) {
    super(chat);
    this.space_id = chat.space_id;
    this.space = space;
  }
}

export class UserChat extends Chat {
  constructor(chat: ApiChat) {
    super(chat);
  }
}
