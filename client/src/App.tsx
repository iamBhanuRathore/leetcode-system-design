import { useEffect, useState } from "react";
import "./App.css";
import { useWebSocketContext, userId } from "./context/WebSocketContext";
import axios from "axios";

function App() {
  const { connect, isConnected, messages, setMessages, disconnect } =
    useWebSocketContext();
  const [values, setValues] = useState({
    userId,
    code: "",
    problemId: "",
    language: "",
  });
  useEffect(() => {
    const submissionMessage = messages?.find(
      (message) => message.key === "submission_response"
    );
    console.log(isConnected, submissionMessage, messages);
    if (isConnected && submissionMessage?.messages) {
      setMessages([]);
      alert(JSON.stringify(submissionMessage.messages));
      disconnect();
    }
    if (isConnected && !submissionMessage?.messages) {
      (async () => {
        try {
          const response = await axios.post(
            "http://localhost:3000/submit",
            values
          );
          console.log(response.data);
        } catch (error: any) {
          console.error(
            "Error:",
            error.response ? error.response.data : error.message
          );
        }
      })();
    }
  }, [messages, isConnected]);
  const handleConnectServer = async () => {
    connect();
  };
  return (
    <>
      <div className="flex flex-col w-1/2 m-auto gap-y-10 h-min text-black">
        <p className="text-2xl font-semibold text-white ">User Id: {userId} </p>
        <input
          type="text"
          className="p-3 rounded-md bg-gray-300"
          placeholder="Enter Your Code"
          name="code"
          onChange={(e) => {
            setValues((p) => ({ ...p, [e.target.name]: e.target.value }));
          }}
        />
        <input
          type="text"
          className="p-3 rounded-md bg-gray-300"
          placeholder="Problem Id (Will get automatically)"
          name="problemId"
          onChange={(e) => {
            setValues((p) => ({ ...p, [e.target.name]: e.target.value }));
          }}
        />
        <input
          type="text"
          className="p-3 rounded-md bg-gray-300"
          placeholder="Language (Will get automatically)"
          name="language"
          onChange={(e) => {
            setValues((p) => ({ ...p, [e.target.name]: e.target.value }));
          }}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white duration-300 font-bold py-2 px-4 rounded-lg"
          onClick={handleConnectServer}>
          Submit
        </button>
      </div>
      <div className="absolute right-10 bottom-10 flex gap-x-2 items-center">
        Socket:{" "}
        {isConnected ? (
          <p className="h-5 w-5 rounded-full bg-green-600" />
        ) : (
          <p className="h-5 w-5 rounded-full bg-red-600" />
        )}
      </div>
    </>
  );
}

export default App;
