import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { connectSocket, disconnectSocket, sendMessage } from "./websocket";

// Define the WebSocket context interface
interface WebSocketContextType {
  isConnected: boolean;
  // messages: MessageEvent<any>[];
  messages: MessageEvent<any> | null;
  connect: () => void;
  disconnect: () => void;
  send: (msg: string) => void;
}

// Create the WebSocket context
const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

// Create a custom hook to use the WebSocket context
export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider"
    );
  }
  return context;
};
export const userId = Date.now();
export const WebSocketProvider: React.FC<{
  url: string;
  children: React.ReactNode;
}> = ({ url, children }) => {
  url = url + "?userId=" + userId;
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageEvent<any> | null>(null);
  // const [messages, setMessages] = useState<MessageEvent<any>[]>([]);

  const handleOpen = useCallback(() => {
    setIsConnected(true);
    console.log("Connected to WebSocket");
  }, []);

  const handleClose = useCallback(() => {
    setIsConnected(false);
    console.log("Disconnected from WebSocket");
  }, []);

  const handleError = useCallback((error: Event) => {
    console.error("WebSocket error:", error);
  }, []);

  const handleMessage = useCallback((message: MessageEvent<any>) => {
    console.log("WebSocket message received:", message.data);
    setMessages(message.data);
    // setMessages((prevMessages) => [...prevMessages, ...message.data]);
  }, []);

  const connect = useCallback(() => {
    connectSocket(url, handleOpen, handleClose, handleError, handleMessage);
  }, [url, handleOpen, handleClose, handleError, handleMessage]);

  const disconnect = useCallback(() => {
    disconnectSocket();
  }, []);

  const send = useCallback((msg: string) => {
    sendMessage(msg);
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Provide WebSocket state and functions to the context
  return (
    <WebSocketContext.Provider
      value={{ isConnected, messages, connect, disconnect, send }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
