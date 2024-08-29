import axios from "axios"
export type Auth = { prefix?: "User" | "Bot", token?: string };

export class API {
  private auth: Auth;
  private url: string;

  constructor() {
    this.auth = {};
    this.url = "";
  }

  setUrl(url: string) {
    this.url = url;
  }

  setAuth(auth: Auth) {
    this.auth = auth;
  }

  get token() {
    return `${this.auth.prefix} ${this.auth.token}`;
  }

  async get(path: string) {
    return await axios.get(this.url + path, {
      headers: {
        Authorization: this.token
      }
    });

  }

  async post(path: string, data: any) {
    return await axios.post(this.url + path, data, {
      headers: {
        Authorization: this.token
      }
    });
  }
}
