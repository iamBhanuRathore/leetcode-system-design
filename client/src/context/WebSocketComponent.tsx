// WebSocketComponent.tsx

import React, { useState } from "react";
import { useWebSocketContext } from "./WebSocketContext";

const WebSocketComponent: React.FC = () => {
  // Access the WebSocket context
  const { isConnected, messages, connect, disconnect, send } =
    useWebSocketContext();

  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      send(message);
      setMessage("");
    }
  };

  return (
    <div>
      <h1>WebSocket Example</h1>
      <div>
        <button onClick={connect} disabled={isConnected}>
          Connect
        </button>
        <button onClick={disconnect} disabled={!isConnected}>
          Disconnect
        </button>
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={handleSendMessage} disabled={!isConnected}>
          Send Message
        </button>
      </div>
      <div>
        <h2>Messages:</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg.toString()}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebSocketComponent;
