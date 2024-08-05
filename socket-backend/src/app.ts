import express from "express";

const app = express();

// Basic HTTP route
app.get("/", (req, res) => {
  return res.json({
    message: "Connected to HTTP",
  });
});

// Middleware for parsing JSON requests
app.use(express.json());

export { app };
