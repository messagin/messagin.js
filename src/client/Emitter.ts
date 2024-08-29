import { Internal } from "./Internal";

export interface SessionEvent {
  id: string;
  user_id: string;
}

export interface SessionCreateEvent extends SessionEvent {
  browser: string;
  os: string;
  ip: string;
  time: number;
}

export interface SessionUpdateEvent extends SessionEvent {
  time: number;
}

// tslint:disable-next-line:no-empty-interface
export interface SessionDeleteEvent extends SessionEvent { }

export interface SpaceEvent {
  id: string;
  name: string;
  owner_id: string;
  created_at: number;
}

export interface ChatEvent {
  space_id?: string;
  id: string;
  name: string;
  flags: number;
  created_at: number;
}

export interface MessageEvent {
  id: string;
  user_id: string;
  chat_id: string;
  content: string;
  flags: number;
}

export interface RoleEvent {
  space_id: string;
  id: string;
  permissions: number;
}

export interface MemberEvent {
  space_id: string;
  user_id: string;
  permissions: number;
  color: number | null;
}

interface ReadyEventUser {
  id: string;
  flags: number;
  username: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  created_at: number;
}

export interface ReadyEvent {
  spaces: SpaceEvent[];
  sessions: SessionEvent[];
  user: ReadyEventUser;
}

export interface Events {
  Ready: [ReadyEvent];
  SessionCreate: [SessionCreateEvent];
  SessionUpdate: [SessionUpdateEvent];
  SessionDelete: [SessionDeleteEvent];
  SpaceCreate: [SpaceEvent];
  SpaceUpdate: [SpaceEvent];
  SpaceDelete: [SpaceEvent];
  ChatCreate: [ChatEvent];
  ChatUpdate: [ChatEvent];
  ChatDelete: [ChatEvent];
  MessageCreate: [MessageEvent];
  MessageUpdate: [MessageEvent];
  MessageDelete: [MessageEvent];
  RoleCreate: [RoleEvent];
  RoleUpdate: [RoleEvent];
  RoleDelete: [RoleEvent];
  MemberCreate: [MemberEvent];
  MemberUpdate: [MemberEvent];
  MemberDelete: [MemberEvent];
}

export type EventName = keyof Events;

export class Emitter extends Internal {
  private static instance: Emitter | null;

  private listeners: { [K in EventName]?: Map<number, (...args: Events[K]) => void> };
  private freeIds: { [K in EventName]?: number[] };

  constructor() {
    super();
    this.listeners = {} as { [K in EventName]?: Map<number, (...args: Events[K]) => void> };
    this.freeIds = {} as { [K in EventName]?: number[] };
  }

  static getInstance(): Emitter {
    if (!Emitter.instance) {
      Emitter.instance = new Emitter();
    }
    return Emitter.instance;
  }

  emit<K extends EventName>(eventName: K, data: Events[K]) {
    const listeners = this.listeners[eventName];
    if (!listeners || !listeners.size) return false;
    for (const [_, listener] of listeners) {
      listener?.(...data);
    }
    return true;
  }

  private getId(eventName: EventName): number {
    return this.freeIds[eventName]?.shift() ?? this.listeners[eventName]?.size ?? 0;
  }

  private reuseId(eventName: EventName, id: number): void {
    if (!this.freeIds[eventName]) {
      this.freeIds[eventName] = [];
    }
    this.freeIds[eventName]?.push(id);
  }

  onAny(callback: (eventName: EventName, ...data: any[]) => void) {
    for (const eventName in this.listeners) {
      this.on(eventName as EventName, (...data: any[]) => callback(eventName as EventName, ...data));
    }
  }

  on<K extends EventName = EventName>(eventName: K, callback: (...data: Events[K]) => void) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = new Map();
    }
    const id = this.getId(eventName);
    this.listeners[eventName]?.set(id, callback);
    return this;
  };

  off<K extends EventName>(eventName: K, id: number): void {
    if (!this.listeners[eventName]) return;
    this.listeners[eventName]?.delete(id);
    this.reuseId(eventName, id);
  }
}
