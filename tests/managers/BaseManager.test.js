const { BaseManager } = require("../../lib/managers/BaseManager");
const { Store } = require("../../lib/utils/Store");

describe("BaseManager", () => {
  let manager = null;

  beforeEach(() => {
    manager = new BaseManager();
  });

  it("should create a new store", () => {
    expect(manager.store).toBeInstanceOf(Store);
  });

});
