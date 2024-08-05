import { createClient } from "redis";
const client = createClient();
let count = 0;
async function processSubmission(submission: string) {
  const { problemId, code, language, userId } = JSON.parse(submission);

  console.log(`Processing submission for problemId ${problemId}...`);
  console.log(`Code: ${code}`);
  console.log(`Language: ${language}`);
  console.log(`User Id: ${userId}`);
  console.log(++count);
  // Here you would add your actual processing logic
  // -----------------------------------------------
  // Mocking code verification for demonstration purposes
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Finished processing submission for problemId ${problemId}.`);
  console.log("________________");
  client.publish(
    "problem_done",
    JSON.stringify({ problemId, status: "TLE", userId })
  );
}

async function startWorker() {
  try {
    await client.connect();
    console.log("Worker connected to Redis.");
    // Main loop
    while (true) {
      try {
        const submission = await client.brPop("submissions", 0);
        console.log(submission);
        await processSubmission(submission.element);
      } catch (error) {
        console.error("Error processing submission:", error);
        // Implement your error handling logic here. For example, you might want to push
        // the submission back onto the queue or log the error to a file. Ack / Nack
      }
    }
  } catch (error) {
    console.error("Failed to connect to Redis", error);
  }
}

startWorker();
