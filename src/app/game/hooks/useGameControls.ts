import { useRef, useEffect } from "react";
import { getSocket } from "../lib/socket";

// client/src/app/(game)/hooks/useGameControls.ts
export function useGameControls(roomId: string) {
  const socket = getSocket();
  const keys = useRef({
    up: false,
    left: false,
    right: false,
    down: false
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') keys.current.up = true;
      if (e.key === 'ArrowLeft') keys.current.left = true;
      if (e.key === 'ArrowRight') keys.current.right = true;
      if (e.key === 'ArrowDown') keys.current.down = true;
      socket.emit('playerInput', { roomId, input: keys.current });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') keys.current.up = false;
      if (e.key === 'ArrowLeft') keys.current.left = false;
      if (e.key === 'ArrowRight') keys.current.right = false;
      if (e.key === 'ArrowDown') keys.current.down = false;
      socket.emit('playerInput', { roomId, input: keys.current });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [roomId]);
}