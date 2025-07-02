import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:3001";

let socket: Socket | null = null;

export const initializeSocket = (roomId: string): Socket => {
  // Clean up existing socket if any
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  if (!roomId || roomId.trim() === "") {
    throw new Error("Room ID is required to initialize socket");
  }

  socket = io(SOCKET_URL, {
    query: { roomId: roomId.trim() },
    autoConnect: false,
    transports: ["websocket", "polling"], // Fallback to polling if websocket fails
    timeout: 5000,
  });

  // Add error handling
  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  return socket;
};

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initializeSocket first.");
  }
  return socket;
};

export const isSocketConnected = (): boolean => {
  return socket ? socket.connected : false;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
