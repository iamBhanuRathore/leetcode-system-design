// Declare the WebSocket object
let socket: WebSocket | null = null;

/**
 * Connects to a WebSocket server with the given URL.
 * @param url - The WebSocket server URL.
 * @param handleOpen - Callback function when the WebSocket connection is opened.
 * @param handleClose - Callback function when the WebSocket connection is closed.
 * @param handleError - Callback function when an error occurs in the WebSocket connection.
 * @param handleMessage - Callback function when a message is received from the WebSocket.
 */
// url, handleOpen, handleClose, handleError, handleMessage
export const connectSocket = (
  url: string,
  handleOpen: (event: Event) => void,
  handleClose: (event: CloseEvent) => void,
  handleError: (event: Event) => void,
  handleMessage: (event: MessageEvent<any>) => void
) => {
  socket = new WebSocket(url);

  socket.onopen = (event) => {
    console.log("WebSocket connected:", event);
    handleOpen(event);
  };

  socket.onclose = (event) => {
    console.log("WebSocket disconnected:", event);
    handleClose(event);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    handleError(error);
  };

  socket.onmessage = (message) => {
    console.log("WebSocket message received:", message.data);
    handleMessage(message);
  };
};

/**
 * Disconnects the WebSocket connection if it exists.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

/**
 * Sends a message over the WebSocket connection.
 * @param message - The message to be sent.
 */
export const sendMessage = (message: string) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
  } else {
    console.error("WebSocket is not open. Unable to send message:", message);
  }
};
