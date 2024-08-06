import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { connectSocket, disconnectSocket, sendMessage } from "./websocket";

type MessageType = {
  key: string;
  messages: string[];
};
type ReceivedMessage = {
  key: string;
  message: string;
};
type Messages = MessageType[];
// Define the WebSocket context interface
interface WebSocketContextType {
  isConnected: boolean;
  // messages: MessageEvent<any>[];
  messages: Messages | null;
  setMessages: React.Dispatch<React.SetStateAction<Messages | null>>;
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
  const [messages, setMessages] = useState<Messages | null>(null);

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
    const response = JSON.parse(message.data) as ReceivedMessage;
    console.log("WebSocket message received:", message);
    // message.data

    setMessages((p) => {
      if (!p) {
        return [
          {
            key: response.key,
            messages: [response.message],
          },
        ];
      }
      let prev = [...p];
      const index = prev?.findIndex((item) => item.key === response.key);
      if (index != -1) {
        prev[index].messages = [...prev[index].messages, response.message];
      } else {
        prev.push({ key: response.key, messages: [response.message] });
      }
      return prev;
    });
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
      value={{ isConnected, messages, setMessages, connect, disconnect, send }}>
      {children}
    </WebSocketContext.Provider>
  );
};
