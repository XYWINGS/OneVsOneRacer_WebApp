"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GameCanvas } from "./components/GameCanvas";
import { initializeSocket } from "./lib/socket";

export default function GamePage() {
  // ALL HOOKS MUST BE CALLED FIRST - BEFORE ANY CONDITIONAL LOGIC
  const searchParams = useSearchParams();
  const router = useRouter();
  const [players, setPlayers] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [tempRoomId, setTempRoomId] = useState("");

  const roomId = searchParams.get("room");

  // This useEffect will always run, but only do work when roomId exists
  useEffect(() => {
    if (!roomId) return;

    setIsConnecting(true);
    const socket = initializeSocket(roomId);

    socket.connect();

    socket.on("connect", () => {
      setIsConnecting(false);
      console.log("Connected to room:", roomId);
    });

    socket.on("playerJoined", (data) => {
      setPlayers(data.players);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnecting(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  // Always render GameCanvas (even with empty roomId) to maintain hook consistency
  // GameCanvas will handle the empty roomId case internally
  const gameCanvas = <GameCanvas roomId={roomId || ""} />;

  // CONDITIONAL RENDERING AFTER ALL HOOKS
  if (!roomId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Join or Create Room</h2>

          <div className="space-y-4">
            <button
              onClick={() => {
                const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
                router.push(`/game?room=${newRoomId}`);
              }}
              className="w-full px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              disabled={isConnecting}
            >
              Create New Room
            </button>

            <div className="flex gap-2">
              <input
                value={tempRoomId}
                onChange={(e) => setTempRoomId(e.target.value.toUpperCase())}
                placeholder="Enter Room Code"
                className="flex-1 px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                maxLength={6}
              />
              <button
                onClick={() => {
                  if (tempRoomId.trim()) {
                    router.push(`/game?room=${tempRoomId.trim()}`);
                  }
                }}
                className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
                disabled={!tempRoomId.trim() || isConnecting}
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Connecting to room {roomId}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen">
      {gameCanvas}

      {/* Game UI Overlay */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-4 rounded">
        <h2 className="text-xl font-bold">Room: {roomId}</h2>
        <p>Players: {players.length}/2</p>
        {players.length < 2 && <p className="text-yellow-400 text-sm mt-1">Waiting for opponent...</p>}
      </div>

      {/* Room sharing */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded">
        <p className="text-sm mb-2">Share this room code:</p>
        <div className="flex items-center gap-2">
          <code className="bg-gray-700 px-2 py-1 rounded text-lg font-mono">{roomId}</code>
          <button
            onClick={() => {
              navigator.clipboard.writeText(roomId);
            }}
            className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700 transition"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
