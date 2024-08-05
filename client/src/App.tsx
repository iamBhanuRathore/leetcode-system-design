import { useEffect, useState } from "react";
import "./App.css";
import { useWebSocketContext, userId } from "./context/WebSocketContext";
import axios from "axios";

function App() {
  const { connect, isConnected, send, messages, disconnect } =
    useWebSocketContext();
  const [values, setValues] = useState({
    userId,
    code: "",
    problemId: "",
    language: "",
  });
  useEffect(() => {
    if (isConnected && messages) {
      alert(JSON.stringify(messages));
      disconnect();
    }
    console.log(messages);
    if (isConnected && !messages) {
      (async()=>{
        try {
          const response = await axios.post('https://3000-idx-pub-sub-1722409699592.cluster-3g4scxt2njdd6uovkqyfcabgo6.cloudworkstations.dev/submit', {
            userId: '123',
            problemId: '456',
            code: 'console.log("Hello, World!");',
            language: 'javascript',
          });
          console.log(response.data);
        } catch (error:any) {
          console.error('Error:', error.response ? error.response.data : error.message);
        }
      })()
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
          className="p-3 rounded-md"
          placeholder="Enter Your Code"
          name="code"
          onChange={(e) => {
            setValues((p) => ({ ...p, [e.target.name]: e.target.value }));
          }}
        />
        <input
          type="text"
          className="p-3 rounded-md"
          placeholder="Problem Id (Will get automatically)"
          name="problemId"
          onChange={(e) => {
            setValues((p) => ({ ...p, [e.target.name]: e.target.value }));
          }}
        />
        <input
          type="text"
          className="p-3 rounded-md"
          placeholder="Language (Will get automatically)"
          name="language"
          onChange={(e) => {
            setValues((p) => ({ ...p, [e.target.name]: e.target.value }));
          }}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white duration-300 font-bold py-2 px-4 rounded-lg"
          onClick={handleConnectServer}
        >
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
