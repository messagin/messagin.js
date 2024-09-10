export class Store<T> {
  private s: Map<string, T> = new Map();
  private k: string[] = [];

  get size(): number {
    return this.s.size;
  }

  has(key: string): boolean {
    return this.s.has(key);
  }

  set(key: string, value: T): void {
    this.s.set(key, value);
    this.k.push(key);
  }

  get(key: string): T | undefined {
    return this.s.get(key);
  }

  keys(): string[] {
    return this.k;
  }

  delete(key: string) {
    this.k = this.k.filter(k => k !== key);
    return this.s.delete(key);
  }

  values(): T[] {
    return Array.from(this.s.values());
  }

  clone(): Store<T> {
    const store = new Store<T>();
    this.forEach((value, key) => store.set(key, value));
    return store;
  }

  /**
   * Provides asynchronous utility methods for the Store.
   *
   * @returns {Object} An object containing asynchronous methods.
   */
  get async() {
    return {
      /**
       * Asynchronously calls a defined callback function on each element of the Store, and returns a new Store that contains the ordered results.\
       * Useful for ordered execution of async functions.
       * @param callbackfn — A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the Store.
       * @example
       * const store = new Store<number>();
       * store.set('a', 1);
       * store.set('b', 2);
       *
       * const newStore = await store.async.map(async (value, key, store) => {
       *   return value * 2;
       * });
       * console.log(newStore.get('a')); // 2
       * console.log(newStore.get('b')); // 4
       */
      map: async <V>(callbackfn: (value: T, key: string, store: this) => Promise<V>): Promise<Store<V>> => {
        const store = new Store<V>();
        for (const [key, value] of this.s) {
          const result = await callbackfn(value, key, this);
          store.set(key, result);
        }
        return store;
      },
      forEach: async (callbackfn: (value: T, key: string, store: this) => Promise<void>): Promise<this> => {
        for (const [key, value] of this.s) {
          await callbackfn(value, key, this);
        }
        return this;
      }
    }
  }

  /**
   * Calls a defined callback function on each element of the Store, and returns a new Store that contains the results.
   * @param callbackfn — A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the Store.
   */
  map<V>(callbackfn: (value: T, key: string, store: this) => V): Store<V> {
    const store = new Store<V>();
    for (const [key, value] of this.s) {
      store.set(key, callbackfn(value, key, this));
    }
    return store;
  }

  /**
   * Performs the specified action for each element in a Store and returns the Store.
   * @param callbackfn — A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the Store.
   */
  forEach(callbackfn: (value: T, key: string, store: this) => void): this {
    for (const [key, value] of this.s) {
      callbackfn(value, key, this);
    }
    return this;
  }

  filter(predicate: (value: T, key: string, store: this) => unknown): Store<T> {
    const store = new Store<T>();
    for (const [key, value] of this.s) {
      if (predicate(value, key, this)) {
        store.set(key, value);
      }
    }
    return store;
  }

  sort(compareFn: (a: T, b: T) => number): Store<T> {
    const store = new Store<T>();
    Array
      .from(this.s)
      .sort((a, b) => compareFn(a[1], b[1]))
      .map(x => store.set(x[0], x[1]));
    return store;
  }

  find<V>(predicate: (value: T, key: string, store: this) => V): T | undefined {
    for (const [key, value] of this.s) {
      if (predicate(value, key, this)) return value;
    }
    return;
  }

  every(predicate: (value: T, key: string, store: this) => unknown): boolean {
    for (const [key, value] of this.s) {
      if (!predicate(value, key, this)) return false;
    }
    return true;
  }

  some(predicate: (value: T, key: string, store: this) => unknown): boolean {
    for (const [key, value] of this.s) {
      if (predicate(value, key, this)) return true;
    }
    return false;
  }

  // why though ?
  reverse() {
    this.k.reverse();
    return this;
  }

  first(): T | undefined {
    return this.s.get(this.k[0]);
  }

  last(): T | undefined {
    return this.s.get(this.k[this.k.length - 1]);
  }
}
