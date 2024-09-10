import { Member } from "../models/Member";
import { Space } from "../models/Space";
import { Internal } from "../client/Internal";
import { BaseManager } from "./BaseManager";

export class MemberManager extends BaseManager<Member> {
  private space?: Space;

  constructor(space?: Space) {
    super();
    this.space = space;
  }

  async fetch(id: string, force = false): Promise<Member | null> {
    if (force || !this.store.has(id)) {
      const res = await Internal.API.get(`/spaces/${this.space?.id}/members/${id}/`);
      if (res.status !== 200) return null;
      this.store.set(id, new Member(res.data));
    }
    return this.store.get(id)!;
  }

  async fetchAll(): Promise<Member[] | null> {
    if (!this.space) return null;
    // fetch all chats for this space

    const res = await Internal.API.get(`/spaces/${this.space}/members/`);
    if (res.status !== 200) return null;
    for (const member of res.data) {
      this.store.set(member.id, new Member(member));
    }
    return Array.from(this.store.values());
  }
}
