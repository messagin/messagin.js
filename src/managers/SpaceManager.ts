import { Space } from "../models/Space";
import { Internal } from "../client/Internal";
import { BaseManager } from "./BaseManager";

export class SpaceManager extends BaseManager<Space> {
  constructor() {
    super();
  }

  async create(name: string): Promise<Space | null> {
    const res = await Internal.API.post("/spaces", { name });
    if (res.status !== 200) return null;
    this.store.set(res.data.id, new Space(res.data));
    return this.store.get(res.data.id)!;
  }

  async fetch(id: string, force = false): Promise<Space | null> {
    if (force || !this.store.has(id)) {
      const res = await Internal.API.get(`/spaces/${id}`);
      if (res.status !== 200) return null;
      this.store.set(id, new Space(res.data));
    }
    return this.store.get(id)!;
  }

  // todo implement fetchAll (spaces)
  // fetchAll(): void {
  //   fetch all spaces
  // }

  // todo implement update (space)
  // update(id: string, space: Space): void {
  //   if (this.spaces.has(id)) {
  //     this.spaces.set(id, space);
  //   }
  // }

  // todo implement delete (space)
  // delete(id: string): void {
  //   this.spaces.delete(id);
  // }
}
