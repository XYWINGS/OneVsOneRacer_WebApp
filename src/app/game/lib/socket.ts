import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:3001';

let socket: Socket;

export const initializeSocket = (roomId: string) => {
  socket = io(SOCKET_URL, {
    query: { roomId },
    autoConnect: false,
  });
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initializeSocket first.');
  }
  return socket;
};