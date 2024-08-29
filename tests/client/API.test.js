const { API } = require("../../lib/client/API");

jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn()
}));

const axios = require("axios");

describe("API", () => {
  /**
   * @type {API}
   */
  let api;

  beforeEach(() => {
    api = new API();
    api.setUrl("https://example.com/api");
    api.setAuth({ prefix: "User", token: "123456789" });
  });

  describe("get", () => {

    it("should make a GET request", async () => {

      const mockResponse = { status: 200, data: { content: "Hello, World!" } };

      axios.get.mockReturnValue(mockResponse);

      const result = await api.get("/data");

      expect(axios.get).toHaveBeenCalledWith("https://example.com/api/data", {
        headers: {
          Authorization: "User 123456789",
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("post", () => {
    it("should make a POST request", async () => {

      const mockResponse = { status: 200, data: { content: "Success" } };

      axios.post.mockReturnValue(mockResponse);

      const result = await api.post("/data", { name: "John" });

      expect(axios.post).toHaveBeenCalledWith("https://example.com/api/data", { name: "John" }, {
        headers: {
          Authorization: "User 123456789",
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
