import { Base } from "./Base";
import { BaseChat } from "./Chat";

interface ApiMessage {
  id: string;
  user_id: string;
  chat_id: string;
  content: string;
  flags: number;
}

export class Message extends Base implements ApiMessage {
  id: string;
  user_id: string;
  chat_id: string;
  content: string;
  flags: number;
  chat: BaseChat;

  constructor(message: ApiMessage, chat: BaseChat) {
    super();
    this.chat = chat;
    this.id = message.id;
    this.user_id = message.user_id;
    this.chat_id = message.chat_id;
    this.content = message.content;
    this.flags = message.flags;
  }
}
