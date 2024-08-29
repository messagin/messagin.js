const { WebSocketController } = require("../../lib/client/WebsocketController");

jest.mock("ws", () => ({
  WebSocket: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
  }))
}));
const ws = require("ws");

describe("WebSocketController", () => {
  /**
   * @type {WebSocketController}
   */
  let webSocketController;

  beforeEach(() => {
    webSocketController = new WebSocketController();
  });

  afterEach(() => {
    // Clean up any resources if needed
  });

  it("should set the URL correctly", () => {
    const url = "wss://example.com";
    webSocketController.setUrl(url);
    expect(webSocketController["url"]).toBe(url);
  });

  it("should set the authentication correctly", () => {
    const auth = { prefix: "Bearer", token: "abc123" };
    webSocketController.setAuth(auth);
    expect(webSocketController["auth"]).toEqual(auth);
  });

  it("should initialize the WebSocket connection", () => {

    const url = "wss://example.com";
    const auth = { prefix: "Bearer", token: "abc123" };
    webSocketController.setUrl(url);
    webSocketController.setAuth(auth);
    webSocketController.init();

    expect(ws.WebSocket).toHaveBeenCalledWith(url, {
      headers: { authorization: `${auth.prefix} ${auth.token}` },
    });
  });
});
