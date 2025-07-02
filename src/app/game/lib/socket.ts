import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:3000";

// Debug logging
console.log("Socket URL:", SOCKET_URL);

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
    timeout: 20000, // Increased timeout to 20 seconds
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    forceNew: true, // Force new connection
  });

  // Enhanced error handling
  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
    console.error("Error details:", error);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
    if (reason === "io server disconnect") {
      // Server disconnected, try to reconnect
      socket?.connect();
    }
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log("Socket reconnected after", attemptNumber, "attempts");
  });

  socket.on("reconnect_error", (error) => {
    console.error("Socket reconnection error:", error);
  });

  socket.on("reconnect_failed", () => {
    console.error("Socket reconnection failed after all attempts");
  });

  socket.on("connect", () => {
    console.log("Socket connected successfully to room:", roomId);
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
    console.log("Disconnecting socket...");
    socket.disconnect();
    socket = null;
  }
};

// Helper function to check socket health
export const getSocketStatus = (): string => {
  if (!socket) return "not_initialized";
  if (socket.connected) return "connected";
  if (socket.disconnected) return "disconnected";
  return "connecting";
};
