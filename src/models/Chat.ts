import { MessageManager } from "../managers/MessageManager";
import { Internal } from "../client/Internal";
import { Base } from "./Base";
import { Space } from "./Space";

interface ApiBaseChat {
  id: string;
  name: string;
  flags: number;
};

interface ApiChat extends ApiBaseChat {
  space_id: string;
}

interface ApiUserChat extends ApiBaseChat { };

export class BaseChat extends Base implements ApiBaseChat {
  id: string;
  name: string;
  flags: number;

  messages: MessageManager;

  constructor(chat: ApiBaseChat) {
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

export class Chat extends BaseChat {
  space: Space;
  space_id: string;

  constructor(chat: ApiChat, space: Space) {
    super(chat);
    this.space_id = chat.space_id;
    this.space = space;
  }
}

export class UserChat extends BaseChat {
  constructor(chat: ApiUserChat) {
    super(chat);
  }
}
