import { Base } from "../models/Base";
import { Internal } from "../client/Internal";
import { Store } from "../utils/Store";

export class BaseManager<T extends Base> extends Internal {
  /**
   * The store for this manager.
   *
   * **Use fetch instead of accessing this directly**
   */
  store: Store<T> = new Store();
}
