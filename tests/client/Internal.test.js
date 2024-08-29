const { Internal } = require("../../lib/client/Internal");
const { Client } = require("../../lib/client");
const { API } = require("../../lib/client/API");
const { WebSocketController } = require("../../lib/client/WebsocketController");

describe("BaseManager", () => {
  let internal = null;

  beforeEach(() => {
    internal = new Internal();
  });

  it("should initialize the API and client", () => {
    const api = new API();
    const client = new Client();
    const ws = new WebSocketController();

    Internal.initialize({
      api,
      client,
      ws
    });

    expect(Internal.WS).toBe(ws);
    expect(Internal.API).toBe(api);
    expect(Internal.client).toBe(client);
  });
});
