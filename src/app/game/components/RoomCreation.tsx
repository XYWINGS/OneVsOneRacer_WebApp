// client/src/app/(main)/components/RoomCreation.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { initializeSocket } from '../lib/socket';

export function RoomCreation() {
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const socket = initializeSocket(newRoomId);
    socket.connect();
    router.push(`/game?room=${newRoomId}`);
  };

  const joinRoom = () => {
    if (!roomId) return;
    const socket = initializeSocket(roomId);
    socket.connect();
    router.push(`/game?room=${roomId}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <button onClick={createRoom} className="btn-primary">
        Create New Room
      </button>
      <div className="flex gap-2">
        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value.toUpperCase())}
          placeholder="Enter Room Code"
          className="input-field"
        />
        <button onClick={joinRoom} className="btn-primary">
          Join Room
        </button>
      </div>
    </div>
  );
}