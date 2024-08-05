import WebSocket from "ws";

export class UserManager {
  private users: Map<string, WebSocket>;

  constructor() {
    this.users = new Map<string, WebSocket>();
  }

  add(userId: string, ws: WebSocket) {
    this.users.set(userId, ws);
  }

  get(userId: string): WebSocket | undefined {
    return this.users.get(userId);
  }

  delete(userId: string): boolean {
    return this.users.delete(userId);
  }

  forEach(callback: (ws: WebSocket, userId: string) => void) {
    this.users.forEach(callback);
  }
}

export const connections = new UserManager();
