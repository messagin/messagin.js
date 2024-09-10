import { Auth } from "./API";
import { Emitter, EventName } from "./Emitter";
import { Internal } from "./Internal";

enum OpCodes {
  Dispatch,
  LifeCycle,
  Authenticate
}

type WsEvent = { op?: OpCodes, t?: "Ready" | EventName, d?: any, s?: number };

export class WebSocketController extends Emitter {
  private ws: WebSocket | null;
  private url: string;
  private auth: Auth;

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

  private setupEventHandlers() {
    if (this.ws) {
      this.ws.onopen = () => {
        console.log("WS open");
      }

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

        console.log(event.t!);
        Internal.handlers[event.t!]?.(event.d);
      };

      this.ws.onerror = (ev) => {
        console.log(ev);
      }

      this.ws.onclose = (ev: CloseEvent) => {
        console.log("WebSocket connection closed");
        console.log(ev.code, ev.reason.toString());
      };
    }
  }
}
