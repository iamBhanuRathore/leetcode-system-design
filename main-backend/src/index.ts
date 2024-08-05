import express from "express";
import { createClient } from "redis";
import bodyParser from "body-parser";
import cors from "cors";
const app = express();
const port = parseInt(process.env.PORT || "3000");
const redisClient = createClient({
  url: "redis://localhost:6379",
}); 

app.use(cors({
  origin: "https://5173-idx-pub-sub-1722409699592.cluster-3g4scxt2njdd6uovkqyfcabgo6.cloudworkstations.dev", // Allow your specific frontend domain
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
}));
app.use(bodyParser());

app.get("/", (req, res) => {
  const name = process.env.NAME || "World";
  res.send(`Hello ${name}!`);
});

app.post("/submit", async (req, res) => {
  try {
    const { userId, problemId, code, language } = await req.body;
    let info = {
      userId,
      problemId,
      code,
      language,
    };
    // Should put this submission in the database - and cache in the redis.
    redisClient.lPush("submissions", JSON.stringify(info));
    return res.json({
      succcess: true,
      message: "Submission received",
      data: info,
    });
  } catch (error) {
    console.log("Error", error);
  }
});

async function main() {
  try {
    await redisClient.connect();
    app.listen(port, () => {
      console.log(`listening on port http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Error", error);
    process.exit(1);
  }
}
main();
