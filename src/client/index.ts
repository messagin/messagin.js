import { SpaceManager } from "../managers/SpaceManager";
import { UserManager } from "../managers/UserManager";
import { ChatManager } from "../managers/ChatManager";
import { UserChatManager } from "../managers/UserChatManager";

import { Space } from "../models/Space";
import { Chat, SpaceChat, UserChat } from "../models/Chat";

import { API, Auth } from "./API";
import { ChatEvent, Emitter, ReadyEvent, SpaceEvent } from "./Emitter";
import { WebSocketController } from "./WebsocketController";
import { Internal } from "./Internal";

export class Client extends Emitter {
  private auth: Auth;
  private API: API;
  private WS: WebSocketController;
  private host: string;
  private secure: boolean;

  user: any;
  spaces: SpaceManager;
  users: UserManager;
  chats: UserChatManager;

  constructor() {
    super();
    this.auth = {};
    this.API = new API();
    this.WS = new WebSocketController();
    this.host = "api.chat.webd3vs.xyz";
    this.secure = true;

    Internal.initialize({
      api: this.API,
      client: this,
      ws: this.WS
    });

    this.spaces = new SpaceManager();
    this.users = new UserManager();
    // todo implement GlobalChatManager to separate concerns
    this.chats = new UserChatManager();


    Internal.handlers = {
      Ready: this.handleReady.bind(this),
      SessionCreate: this.handleSessionCreate.bind(this),
      SessionUpdate: this.handleSessionUpdate.bind(this),
      SessionDelete: this.handleSessionDelete.bind(this),
      SpaceCreate: this.handleSpaceCreate.bind(this),
      SpaceUpdate: this.handleSpaceUpdate.bind(this),
      SpaceDelete: this.handleSpaceDelete.bind(this),
      ChatCreate: this.handleChatCreate.bind(this),
      ChatUpdate: this.handleChatUpdate.bind(this),
      ChatDelete: this.handleChatDelete.bind(this),
      MessageCreate: this.handleMessageCreate.bind(this),
      MessageUpdate: this.handleMessageUpdate.bind(this),
      MessageDelete: this.handleMessageDelete.bind(this),
      RoleCreate: this.handleRoleCreate.bind(this),
      RoleUpdate: this.handleRoleUpdate.bind(this),
      RoleDelete: this.handleRoleDelete.bind(this),
      MemberCreate: this.handleMemberCreate.bind(this),
      MemberUpdate: this.handleMemberUpdate.bind(this),
      MemberDelete: this.handleMemberDelete.bind(this),
    };

    this.setup();
  }

  private setup() {
    this.API.setUrl(`http${this.secure ? "s" : ""}://${this.host}`);
    this.WS.setUrl(`ws${this.secure ? "s" : ""}://${this.host}/events`);
  }

  setHost(host: string, secure: boolean) {
    this.host = host;
    this.secure = secure;
    this.setup();
  }

  async login(token: string): Promise<boolean>;
  async login(email: string, password: string): Promise<boolean>;
  async login(a: string, b?: string) {
    const res = await Internal.API.post(
      "/users/authenticate",
      b ? { email: a, password: b } : { token: a }
    );
    if (res.status !== 200) return false;

    this.auth.token = res.data.token;
    this.auth.prefix = res.data.type;
    this.API.setAuth(this.auth);
    this.WS.setAuth(this.auth);
    this.WS.init();
    return true;
  }

  private handleReady(data: ReadyEvent): void {
    this.user = data.user;
    data.spaces.forEach(space => {
      this.spaces.store.set(space.id, new Space(space));
    });
    this.emit("Ready", [data]);
  };
  private handleSessionCreate(): void {

  };
  private handleSessionUpdate(): void {

  };
  private handleSessionDelete(): void {

  };
  private handleSpaceCreate(data: SpaceEvent): void {
    this.spaces.store.set(data.id, new Space(data));
    this.emit("SpaceCreate", [data]);
  };
  private handleSpaceUpdate(data: SpaceEvent): void {
    this.spaces.store.set(data.id, new Space(data));
    this.emit("SpaceUpdate", [data]);
  };
  private handleSpaceDelete(data: SpaceEvent): void {
    this.spaces.store.delete(data.id);
    this.emit("SpaceDelete", [data]);
  };
  private handleChatCreate(data: ChatEvent): void {
    if (!data.space_id) {
      this.chats.store.set(data.id, new UserChat(data));
      this.emit("ChatCreate", [data]);
      return;
    }
    const space = this.spaces.store.get(data.space_id);
    if (!space) return;
    space.chats.store.set(data.id, new SpaceChat(data, space));
    this.chats.store.set(data.id, new SpaceChat(data, space));
    this.emit("ChatCreate", [data]);
  };
  private handleChatUpdate(): void {

  };
  private handleChatDelete(data: ChatEvent): void {
    if (!data.space_id) {
      // user chat deletion
      return;
    }
    const space = this.spaces.store.get(data.space_id!);
    if (!space) return;
    space.chats.store.delete(data.id);
    this.emit("ChatDelete", [data]);
  };
  private handleMessageCreate(): void {
  };
  private handleMessageUpdate(): void {

  };
  private handleMessageDelete(): void {

  };
  private handleRoleCreate(): void {

  };
  private handleRoleUpdate(): void {

  };
  private handleRoleDelete(): void {

  };
  private handleMemberCreate(): void {

  };
  private handleMemberUpdate(): void {

  };
  private handleMemberDelete(): void {

  };
}
