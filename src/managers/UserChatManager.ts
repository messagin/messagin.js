import { UserChat } from "../models/Chat";
import { Internal } from "../client/Internal";
import { BaseManager } from "./BaseManager";

interface ChatCreateOptions {
  name: string;
}

export class UserChatManager extends BaseManager<UserChat> {
  constructor() {
    super();
  }

  async create(options: ChatCreateOptions) {
    const res = await Internal.API.post(`/chats/`, options);
    if (res.status !== 200) return null;

    const chat = new UserChat(res.data);
    this.store.set(chat.id, chat);
    return chat;
  }

  async fetch(id: string, force = false): Promise<UserChat | null> {
    if (force || !this.store.has(id)) {
      const res = await Internal.API.get(`/chats/${id}/`);
      if (res.status !== 200) return null;
      this.store.set(id, new UserChat(res.data));
    }
    return this.store.get(id)!;
  }

  // todo implement fetchAll (chats)
  async fetchAll(): Promise<UserChat[] | null> {
    // fetch all chats for this user

    const res = await Internal.API.get(`/chats/`)
    if (res.status !== 200) return null;
    for (const chat of res.data) {
      this.store.set(chat.id, new UserChat(chat));
    }
    return Array.from(this.store.values());
  }

  // todo implement update (chats)
  // update(id: string, space: Space): void {
  //   if (this.spaces.has(id)) {
  //     this.spaces.set(id, space);
  //   }
  // }

  // todo implement delete (chats)
  // delete(id: string): void {
  //   this.spaces.delete(id);
  // }
}
