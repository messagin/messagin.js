import { Client } from ".";
import { API } from "./API";
import { EventName, Events } from "./Emitter";
import { WebSocketController } from "./WebsocketController";

interface InitializeOptions {
  api: API;
  client: Client;
  ws: WebSocketController;
}

// generic class to make every internal class share protected properties
export class Internal {
  protected static API: API;
  protected static WS: WebSocketController;
  protected static client: Client;

  protected static handlers: { [K in EventName]?: (...data: Events[K]) => any } = {};

  protected static initialize(options: InitializeOptions) {
    Internal.API = options.api;
    Internal.client = options.client;
    Internal.WS = options.ws;
  }
}
