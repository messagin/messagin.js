import { User } from "../models/User";
import { Internal } from "../client/Internal";
import { BaseManager } from "./BaseManager";

export class UserManager extends BaseManager<User> {
  constructor() {
    super();
  }

  async fetch(id: string, force = false): Promise<User | null> {
    if (force || !this.store.has(id)) {
      const res = await Internal.API.get(`/users/${id}`);
      if (res.status !== 200) return null;
      // todo update this to use the User model
      this.store.set(id, res.data);
    }
    return this.store.get(id)!;
  }
}




// todo implement create (users)
// create(id: string, name???): void {
//   this.spaces.set(id, space);
// }


//? // todo implement fetchAll (users)
// fetchAll(): void {
//   fetch all users???
// }

// todo implement update (users)
// update(id: string, space: Space): void {
//   if (this.spaces.has(id)) {
//     this.spaces.set(id, space);
//   }
// }

// todo implement delete (users)
// delete(id: string): void {
//   this.spaces.delete(id);
// }
