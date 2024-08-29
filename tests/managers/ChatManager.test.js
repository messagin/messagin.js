const { Chat } = require("../../lib/models/Chat");
const { Message } = require("../../lib/models/Message");
const { MessageManager } = require("../../lib/managers/MessageManager");
const { BaseManager } = require("../../lib/managers/BaseManager");
const { Internal } = require("../../lib/client/Internal");

describe("MessageManager", () => {

  /**
   * @type {MessageManager}
   */
  let messageManager;
  let chat;

  beforeEach(() => {
    Internal.API = {};
    chat = new Chat({ id: "chat_id", name: "Test Chat", space_id: "space_id" });
    messageManager = new MessageManager(chat);
  });

  describe("fetch", () => {
    it("should fetch a message from the server and add it to the store", async () => {
      // Mock the API response
      const mockApiResponse = {
        status: 200,
        data: { id: "message_id", /* message properties */ },
      };
      Internal.API.get = jest.fn().mockResolvedValue(mockApiResponse);

      // Call the fetch method
      const message = await messageManager.fetch("message_id");

      // Verify the API was called with the correct URL
      expect(Internal.API.get).toHaveBeenCalledWith("/chats/chat_id/messages/message_id/");

      // Verify the message was added to the store
      expect(messageManager.store.get("message_id")).toBeInstanceOf(Message);
      expect(messageManager.store.get("message_id")?.id).toBe("message_id");
      // Verify the chat property was set correctly
      expect(messageManager.store.get("message_id")?.chat).toBe(chat);

      // Verify the fetched message is returned
      expect(message).toBeInstanceOf(Message);
      expect(message?.id).toBe("message_id");
      expect(message?.chat).toBe(chat);
    });

    it("should return null if the message is not found on the server", async () => {
      // Mock the API response
      const mockApiResponse = {
        status: 404,
        data: null,
      };
      MessageManager.API.get = jest.fn().mockResolvedValue(mockApiResponse);

      // Call the fetch method
      const message = await messageManager.fetch("inexistent_id");

      // Verify the API was called with the correct URL
      expect(MessageManager.API.get).toHaveBeenCalledWith("/chats/chat_id/messages/inexistent_id/");

      // Verify the message was not added to the store
      expect(messageManager.store.get("inexistent_id")).toBeUndefined();

      // Verify undefined is returned
      expect(message).toBeNull();
    });

    it("should fetch a message from the server even if it already exists in the store when force is true", async () => {
      // Mock the API response
      const mockApiResponse = {
        status: 200,
        data: { id: "message_id", /* message properties */ },
      };
      MessageManager.API.get = jest.fn().mockResolvedValue(mockApiResponse);

      // Add a message to the store
      const existingMessage = new Message({ id: "message_id", /* message properties */ }, chat);
      messageManager.store.set("message_id", existingMessage);

      // Call the fetch method with force = true
      const message = await messageManager.fetch("message_id", true);

      // Verify the API was called with the correct URL
      expect(MessageManager.API.get).toHaveBeenCalledWith("/chats/chat_id/messages/message_id/");

      // Verify the existing message was replaced with the fetched message in the store
      expect(messageManager.store.get("message_id")).toBeInstanceOf(Message);
      expect(messageManager.store.get("message_id")).not.toBe(existingMessage);
      expect(messageManager.store.get("message_id")?.id).toBe("message_id");
      expect(messageManager.store.get("message_id")?.chat).toBe(chat);

      // Verify the fetched message is returned
      expect(message).toBeInstanceOf(Message);
      expect(message?.id).toBe("message_id");
      expect(message?.chat).toBe(chat);
    });
  });

  describe("fetchAll", () => {
    it("should fetch all messages for the chat from the server and add them to the store", async () => {
      // Mock the API response
      const mockApiResponse = {
        status: 200,
        data: [
          { id: "message_id_1", /* message properties */ },
          { id: "message_id_2", /* message properties */ },
        ],
      };
      MessageManager.API.get = jest.fn().mockResolvedValue(mockApiResponse);

      // Call the fetchAll method
      const messages = await messageManager.fetchAll();

      // Verify the API was called with the correct URL
      expect(MessageManager.API.get).toHaveBeenCalledWith("/chats/chat_id/messages/");

      // Verify the messages were added to the store
      expect(messageManager.store.get("message_id_1")).toBeInstanceOf(Message);
      expect(messageManager.store.get("message_id_1")?.id).toBe("message_id_1");
      expect(messageManager.store.get("message_id_1")?.chat).toBe(chat);
      expect(messageManager.store.get("message_id_2")).toBeInstanceOf(Message);
      expect(messageManager.store.get("message_id_2")?.id).toBe("message_id_2");
      expect(messageManager.store.get("message_id_2")?.chat).toBe(chat);

      // Verify the fetched messages are returned
      expect(messages).toHaveLength(2);
      expect(messages?.[0]).toBeInstanceOf(Message);
      expect(messages?.[0]?.id).toBe("message_id_1");
      expect(messages?.[0]?.chat).toBe(chat);
      expect(messages?.[1]).toBeInstanceOf(Message);
      expect(messages?.[1]?.id).toBe("message_id_2");
      expect(messages?.[1]?.chat).toBe(chat);
    });

    it("should return null if the chat is not set", async () => {
      // Set the chat property to null
      messageManager.chat = null;

      MessageManager.API.get = jest.fn();

      // Call the fetchAll method
      const messages = await messageManager.fetchAll();

      // Verify the API was not called
      expect(MessageManager.API.get).not.toHaveBeenCalled();

      // Verify the messages were not added to the store
      expect(messageManager.store.size).toBe(0);

      // Verify null is returned
      expect(messages).toEqual([]);
    });

    it("should return an empty array if no messages are found for the chat on the server", async () => {
      // Mock the API response
      const mockApiResponse = {
        code: 20000,
        data: [],
      };
      MessageManager.API.get = jest.fn().mockResolvedValue(mockApiResponse);

      // Call the fetchAll method
      const messages = await messageManager.fetchAll();

      // Verify the API was called with the correct URL
      expect(MessageManager.API.get).toHaveBeenCalledWith("/chats/chat_id/messages/");

      // Verify the messages were not added to the store
      expect(messageManager.store.size).toBe(0);

      // Verify an empty array is returned
      expect(messages).toEqual([]);
    });
  });
});
