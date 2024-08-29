const { Store } = require("../../lib/utils/Store");

describe("Store", () => {
  let store = null;

  beforeEach(() => {
    store = new Store();
  });

  it("should set and get values correctly", () => {
    store.set("key1", 1);
    store.set("key2", 2);

    expect(store.get("key1")).toBe(1);
    expect(store.get("key2")).toBe(2);
  });

  it("should check if a key exists", () => {
    store.set("key1", 1);

    expect(store.has("key1")).toBe(true);
    expect(store.has("key2")).toBe(false);
  });

  it("should delete a key", () => {
    store.set("key1", 1);
    store.set("key2", 2);

    expect(store.delete("key1")).toBe(true);
    expect(store.has("key1")).toBe(false);
    expect(store.keys()).toEqual(["key2"]);
  });

  it("should return all keys", () => {
    store.set("key1", 1);
    store.set("key2", 2);

    expect(store.keys()).toEqual(["key1", "key2"]);
  });

  it("should return all values", () => {
    store.set("key1", 1);
    store.set("key2", 2);

    expect(store.values()).toEqual([1, 2]);
  });

  it("should clone the store", () => {
    store.set("key1", 1);
    store.set("key2", 2);

    const clonedStore = store.clone();

    expect(clonedStore).toBeInstanceOf(Store);
    expect(clonedStore.keys()).toEqual(store.keys());
    expect(clonedStore.values()).toEqual(store.values());
  });

  it("should map values", async () => {
    store.set("key1", 1);
    store.set("key2", 2);

    const mappedStore = store.map(value => value * 2);

    expect(mappedStore).toBeInstanceOf(Store);
    expect(mappedStore.values()).toEqual([2, 4]);
  });

  it("should perform forEach operation", () => {
    store.set("key1", 1);
    store.set("key2", 2);

    let sum = 0;
    store.forEach(value => {
      sum += value;
    });

    expect(sum).toBe(3);
  });

  it("should filter values", () => {
    store.set("key1", 1);
    store.set("key2", 2);
    store.set("key3", 3);

    const filteredStore = store.filter(value => value > 1);

    expect(filteredStore).toBeInstanceOf(Store);
    expect(filteredStore.keys()).toEqual(["key2", "key3"]);
    expect(filteredStore.values()).toEqual([2, 3]);
  });

  it("should sort values", () => {
    store.set("key1", 3);
    store.set("key2", 1);
    store.set("key3", 2);

    const sortedStore = store.sort((a, b) => a - b);

    expect(sortedStore).toBeInstanceOf(Store);
    expect(sortedStore.keys()).toEqual(["key2", "key3", "key1"]);
    expect(sortedStore.values()).toEqual([1, 2, 3]);
  });

  it("should find a value", () => {
    store.set("key1", 1);
    store.set("key2", 2);
    store.set("key3", 3);

    const foundValue = store.find((value) => value === 2);

    expect(foundValue).toBe(2);
  });

  it("should check if every value satisfies a condition", () => {
    store.set("key1", 1);
    store.set("key2", 2);
    store.set("key3", 3);

    const isGreaterThanZero = store.every((value) => value > 0);
    const isGreaterThanTwo = store.every((value) => value > 2);

    expect(isGreaterThanZero).toBe(true);
    expect(isGreaterThanTwo).toBe(false);
  });

  it("should check if some value satisfies a condition", () => {
    store.set("key1", 1);
    store.set("key2", 2);
    store.set("key3", 3);

    const isGreaterThanTwo = store.some((value) => value > 2);
    const isGreaterThanThree = store.some((value) => value > 3);

    expect(isGreaterThanTwo).toBe(true);
    expect(isGreaterThanThree).toBe(false);
  });

  it("should reverse the order of keys", () => {
    store.set("key1", 1);
    store.set("key2", 2);
    store.set("key3", 3);

    store.reverse();

    expect(store.keys()).toEqual(["key3", "key2", "key1"]);
  });

  it("should return the first and last values", () => {
    store.set("key1", 1);
    store.set("key2", 2);
    store.set("key3", 3);

    expect(store.first()).toBe(1);
    expect(store.last()).toBe(3);
  });
});
