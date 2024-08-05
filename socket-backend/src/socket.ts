import WebSocket, { WebSocketServer as WSS, ServerOptions } from "ws";
import { parse } from "url";
import { IncomingMessage, Server } from "http";
import { connections } from "./user-manager";

export function WebSocketServer(server: Server, options: ServerOptions = {}) {
  const wss = new WSS({ server, ...options });
  wss.on("connection", async (ws: WebSocket, request: IncomingMessage) => {
    const params = parse(request.url!, true).query;
    const userId = params.userId as string;
    if (!userId) {
      ws.send(JSON.stringify({ error: "UserId is not provided" }));
      ws.close();
      return;
    }

    const alreadyConnected = connections.get(userId);

    if (alreadyConnected) {
      alreadyConnected.close(1000, "Reconnecting user");
      console.log(`User ${userId} reconnected, closing previous connection.`);
      connections.delete(userId);
    }

    connections.add(userId, ws);
    handleWebSocketConnection(ws, userId);
  });

  return wss;
}

export function handleWebSocketConnection(ws: WebSocket, userId: string) {
  console.log(`New client connected with ID: ${userId}`);

  ws.on("error", (error: Error) => {
    console.error(`WebSocket error with user ID ${userId}:`, error.message);
  });

  ws.on("close", (code: number, reason: Buffer) => {
    if (code === 1000) {
      console.log(
        `User ${userId} disconnected with code ${code}, reason: ${reason.toString()}`
      );
      return;
    }
    console.log(
      `Client with ID: ${userId} disconnected with code ${code}, reason: ${reason.toString()}`
    );
    connections.delete(userId);
  });

  // ws.send(JSON.stringify({ message: "Connected to WebSocket Server !!!" }));
}

export function sendToUser(ws: WebSocket, message: WebSocket.RawData | string) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(message, { binary: false });
  }
}
