import { Auth } from "./API";
import { Emitter, EventName, Events } from "./Emitter";
import { Internal } from "./Internal";

enum OpCodes {
  Dispatch,
  LifeCycle,
  Authenticate,
  Hello = 10,
  PingRecv = 11,
}


type WsDispatchEvent = { op: OpCodes.Dispatch; t: EventName; d: Events[EventName] };
type WsLifeCycleEvent = { op: OpCodes.LifeCycle; };
type WsAuthEvent = { op: OpCodes.Authenticate; d?: { auth: string } };
type WsHelloEvent = { op: OpCodes.Hello, d: { interval: number } };
type WsPingRecvEvent = { op: OpCodes.PingRecv };

type TypedWsDispatchEvent<K extends EventName> = { op: OpCodes.Dispatch, t: K, d: Events[K] };
type WsEvent = WsDispatchEvent | WsLifeCycleEvent | WsAuthEvent | WsHelloEvent | WsPingRecvEvent;

export class WebSocketController extends Emitter {
  private ws: WebSocket | null;
  private url: string;
  private auth: Auth;
  private interval?: NodeJS.Timeout;

  private get authorization() {
    return `${this.auth.prefix} ${this.auth.token}`;
  }

  constructor() {
    super();

    // this.client = client;
    this.ws = null;
    this.url = "";
    this.auth = {};
  }

  setUrl(url: string) {
    this.url = url;
  }

  setAuth(auth: Auth) {
    this.auth = auth;
  }

  init() {
    this.ws = new WebSocket(this.url);

    this.setupEventHandlers();
  }

  private dispatchEvent<K extends EventName>(event: TypedWsDispatchEvent<K>) {
    Internal.handlers[event.t]?.(event.d);
  }

  private setupEventHandlers() {
    if (this.ws) {
      this.ws.onopen = () => { }

      this.ws.onmessage = async (ev: MessageEvent) => {
        const event = JSON.parse(ev.data.toString()) as WsEvent;

        if (event.op === OpCodes.Authenticate) {
          this.ws?.send(JSON.stringify({
            op: OpCodes.Authenticate,
            d: {
              auth: this.authorization
            }
          } as WsEvent));
        }

        if (event.op == OpCodes.Hello) {
          const interval = event.d.interval;
          if (!interval) return;
          if (this.interval) clearInterval(this.interval);
          this.interval = setInterval(() => {
            this.ws?.send(JSON.stringify({
              op: OpCodes.LifeCycle
            } as WsEvent));
          }, interval);
        }

        if (event.op !== OpCodes.Dispatch) return;

        console.log(event);
        this.dispatchEvent(event);
      };

      this.ws.onerror = (ev) => {
        console.log(ev);
      }

      this.ws.onclose = (ev: CloseEvent) => {
        console.log("WebSocket connection closed");
        console.log(ev.code, ev.reason.toString());

        if (ev.code !== 3003) {
          this.init();
        }
      };
    }
  }
}
