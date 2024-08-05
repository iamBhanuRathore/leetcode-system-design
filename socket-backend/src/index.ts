import { createServer } from "http";
import { connectToRedis } from "./redis";
import { app } from "./app";
import { WebSocketServer } from "./socket";

const PORT = process.env.PORT || 8080;

// Create an HTTP server
const server = createServer(app);

// Initialize WebSocket server
WebSocketServer(server);

// Start Redis connection and then start the server
async function startServer() {
  try {
    await connectToRedis();
    server.listen(PORT, () => {
      console.log(`Server is listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); // Exit process if Redis connection fails
  }
}

startServer();
