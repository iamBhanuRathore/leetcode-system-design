import { createClient } from "redis";
import { sendToUser } from "./socket";
import { connections } from "./user-manager";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on("error", (err) => {
  console.error("Redis client error:", err);
});

export async function connectToRedis() {
  try {
    await redisClient.connect();
    console.log("Connected to Redis server");
    // Subscribe to the Redis channel named "problem_done"
    redisClient.subscribe("problem_done", (message: string, channel) => {
      console.log(
        `Received message from Redis channel "${channel}": ${message}`
      );
      const redisData = JSON.parse(message);
      console.log(redisData);
      const userId = String(redisData.userId);
      const userWS = connections.get(userId);
      if (userWS) {
        sendToUser(userWS, "submission_response", redisData);
      } else {
        console.log("User Socket Not found");
      }
    });
  } catch (error) {
    console.error("Error connecting to Redis:", error);
    throw error; // Propagate the error for the caller to handle
  }
}

export { redisClient };
