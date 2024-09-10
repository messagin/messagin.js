import { Chat } from "../models/Chat";
import { Message } from "../models/Message";
import { Internal } from "../client/Internal";
import { BaseManager } from "./BaseManager";

export class MessageManager extends BaseManager<Message> {
  private chat: Chat;

  constructor(chat: Chat) {
    super();
    this.chat = chat;
  }

  async fetch(id: string, force = false): Promise<Message | null> {
    if (force || !this.store.has(id)) {
      const res = await Internal.API.get(`/chats/${this.chat.id}/messages/${id}/`);
      if (res.status !== 200) return null;
      this.store.set(id, new Message(res.data, this.chat));
    }
    return this.store.get(id)!;
  }

  async fetchAll(): Promise<Message[]> {
    if (!this.chat) return [];
    const res = await Internal.API.get(`/chats/${this.chat.id}/messages/`);
    if (res.status !== 200) return [];
    for (const message of res.data) {
      this.store.set(message.id, new Message(message, this.chat));
    }
    return Array.from(this.store.values());
  }
}
