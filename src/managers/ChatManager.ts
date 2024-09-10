import { SpaceChat } from "../models/Chat";
import { Space } from "../models/Space";
import { Internal } from "../client/Internal";
import { BaseManager } from "./BaseManager";

interface ChatCreateOptions {
  name: string;
}

export class ChatManager extends BaseManager<SpaceChat> {
  private space: Space;

  constructor(space: Space) {
    super();
    this.space = space;
  }

  async create(options: ChatCreateOptions) {
    const res = await Internal.API.post(`/spaces/${this.space}/chats/`, options);
    if (res.status !== 200) return null;

    const chat = new SpaceChat(res.data, this.space!);
    this.store.set(chat.id, chat);
    return chat;
  }

  async fetch(id: string, force = false): Promise<SpaceChat | null> {
    if (force || !this.store.has(id)) {
      const res = await Internal.API.get(`/chats/${id}/`);
      if (res.status !== 200) return null;
      const space = this.space ?? await Internal.client.spaces.fetch(res.data.space_id);
      this.store.set(id, new SpaceChat(res.data, space!));
    }
    return this.store.get(id)!;
  }

  // todo implement fetchAll (chats)
  async fetchAll(): Promise<SpaceChat[] | null> {
    if (!this.space) return null;
    // fetch all chats for this space

    const res = await Internal.API.get(`/spaces/${this.space}/chats/`)
    if (res.status !== 200) return null;
    for (const chat of res.data) {
      this.store.set(chat.id, new SpaceChat(chat, this.space));
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
