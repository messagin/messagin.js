import { Internal } from "../client/Internal";

export class Base extends Internal {
  id: string = "";

  toString() { return this.id; }
  valueOf() { return this.id; }
}
