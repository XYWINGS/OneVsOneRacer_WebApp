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
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const roomId = searchParams.get("room");

  // This useEffect will always run, but only do work when roomId exists
  useEffect(() => {
    if (!roomId) return;

    setIsConnecting(true);
    setConnectionError(null);

    try {
      const socket = initializeSocket(roomId);

      socket.connect();

      socket.on("connect", () => {
        setIsConnecting(false);
        socket.emit("joinRoom", { roomId });
        setConnectionError(null);
        console.log("Connected to room:", roomId);
      });

      socket.on("playerJoined", (data) => {
        setPlayers(data.players);
        console.log("Players updated:", data.players);

        // Start game when 2 players are connected
        if (data.players.length >= 2) {
          setGameStarted(true);
        }
      });

      socket.on("playerLeft", (data) => {
        setPlayers(data.players);
        setGameStarted(false); // Stop game if player leaves
      });

      socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        setIsConnecting(false);
        setConnectionError("Failed to connect to server. Please try again.");
      });

      socket.on("disconnect", (reason) => {
        console.log("Disconnected:", reason);
        setGameStarted(false);
        if (reason === "io server disconnect") {
          setConnectionError("Server disconnected. Please refresh and try again.");
        }
      });

      // Handle game state updates
      socket.on("gameState", (gameState) => {
        // This will be handled by the GameCanvas component
      });

      return () => {
        socket.disconnect();
      };
    } catch (error) {
      console.error("Socket initialization error:", error);
      setIsConnecting(false);
      setConnectionError("Failed to initialize connection. Please check your network.");
    }
  }, [roomId]);

  // Always render GameCanvas (even with empty roomId) to maintain hook consistency
  // GameCanvas will handle the empty roomId case internally
  const gameCanvas = <GameCanvas roomId={roomId || ""} />;

  // CONDITIONAL RENDERING AFTER ALL HOOKS
  if (!roomId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🏁 Racing Lobby
          </h2>

          <div className="space-y-4">
            <button
              onClick={() => {
                const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
                router.push(`/game?room=${newRoomId}`);
              }}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
              disabled={isConnecting}
            >
              🆕 Create New Room
            </button>

            <div className="flex gap-2">
              <input
                value={tempRoomId}
                onChange={(e) => setTempRoomId(e.target.value.toUpperCase())}
                placeholder="Enter Room Code"
                className="flex-1 px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                maxLength={6}
              />
              <button
                onClick={() => {
                  if (tempRoomId.trim()) {
                    router.push(`/game?room=${tempRoomId.trim()}`);
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg"
                disabled={!tempRoomId.trim() || isConnecting}
              >
                🚪 Join
              </button>
            </div>

            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">How to play:</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Use arrow keys or WASD to control your car</li>
                <li>• Share the room code with a friend to race</li>
                <li>• Race starts when 2 players join</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
          <p className="text-xl font-semibold">Connecting to room {roomId}...</p>
          <p className="text-gray-400 mt-2">Please wait while we establish connection</p>
        </div>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4 text-red-400">Connection Error</h2>
          <p className="text-gray-300 mb-6">{connectionError}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              🔄 Retry Connection
            </button>
            <button
              onClick={() => router.push("/game")}
              className="w-full px-6 py-3 bg-gray-600 rounded-lg hover:bg-gray-700 transition"
            >
              ← Back to Lobby
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-gray-900">
      {/* Game Canvas Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative inset-0"
          style={{
            width: "min(100%, 800px)",
            height: "min(100%, 600px)",
            left: "0%",
          }}
        >
          {gameCanvas}
        </div>
      </div>

      {/* Game UI Overlay */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white p-4 rounded-lg border border-gray-700">
        <h2 className="text-xl font-bold flex items-center gap-2">
          🏁 Room: <span className="text-blue-400">{roomId}</span>
        </h2>
        <p className="flex items-center gap-2">
          👥 Players: <span className="text-green-400">{players.length}/2</span>
        </p>
        {players.length < 2 && (
          <p className="text-yellow-400 text-sm mt-2 flex items-center gap-1">⏳ Waiting for opponent...</p>
        )}
        {gameStarted && <p className="text-green-400 text-sm mt-2 flex items-center gap-1">🚗 Race in progress!</p>}
      </div>

      {/* Room sharing */}
      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white p-4 rounded-lg border border-gray-700">
        <p className="text-sm mb-2 flex items-center gap-1">🔗 Share this room code:</p>
        <div className="flex items-center gap-2">
          <code className="bg-gray-700 px-3 py-2 rounded text-lg font-mono font-bold text-blue-300">{roomId}</code>
          <button
            onClick={() => {
              navigator.clipboard.writeText(roomId);
            }}
            className="px-3 py-2 bg-blue-600 rounded text-xs hover:bg-blue-700 transition font-semibold"
            title="Copy room code"
          >
            📋 Copy
          </button>
        </div>
      </div>

      {/* Game controls help */}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white p-3 rounded-lg border border-gray-700">
        <p className="text-xs text-gray-300 mb-1">Controls:</p>
        <div className="text-xs space-y-1">
          <div>🔺 Up: W or ↑</div>
          <div>🔻 Down: S or ↓</div>
          <div>◀️ Left: A or ←</div>
          <div>▶️ Right: D or →</div>
        </div>
      </div>

      {/* Back button */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={() => router.push("/game")}
          className="px-4 py-2 bg-gray-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-gray-700 transition border border-gray-600"
        >
          ← Back to Lobby
        </button>
      </div>
    </div>
  );
}
