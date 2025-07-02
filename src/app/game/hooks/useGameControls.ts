import { useRef, useEffect } from "react";
import { getSocket } from "../lib/socket";

export function useGameControls(roomId: string) {
  const keys = useRef({
    up: false,
    left: false,
    right: false,
    down: false,
  });

  useEffect(() => {
    // Don't set up controls if no roomId
    if (!roomId) return;

    let socket;
    try {
      socket = getSocket();
    } catch (error) {
      console.warn("Socket not initialized, skipping game controls setup");
      return;
    }

    const handleKeyChange = () => {
      if (socket && socket.connected) {
        socket.emit("playerInput", {
          roomId,
          input: {
            up: keys.current.up,
            left: keys.current.left,
            right: keys.current.right,
            down: keys.current.down,
          },
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      let keyChanged = false;

      if (["ArrowUp", "w", "W"].includes(e.key)) {
        keys.current.up = true;
        keyChanged = true;
      }
      if (["ArrowLeft", "a", "A"].includes(e.key)) {
        keys.current.left = true;
        keyChanged = true;
      }
      if (["ArrowRight", "d", "D"].includes(e.key)) {
        keys.current.right = true;
        keyChanged = true;
      }
      if (["ArrowDown", "s", "S"].includes(e.key)) {
        keys.current.down = true;
        keyChanged = true;
      }

      if (keyChanged) {
        e.preventDefault();
        handleKeyChange();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      let keyChanged = false;

      if (["ArrowUp", "w", "W"].includes(e.key)) {
        keys.current.up = false;
        keyChanged = true;
      }
      if (["ArrowLeft", "a", "A"].includes(e.key)) {
        keys.current.left = false;
        keyChanged = true;
      }
      if (["ArrowRight", "d", "D"].includes(e.key)) {
        keys.current.right = false;
        keyChanged = true;
      }
      if (["ArrowDown", "s", "S"].includes(e.key)) {
        keys.current.down = false;
        keyChanged = true;
      }

      if (keyChanged) {
        e.preventDefault();
        handleKeyChange();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [roomId]);
}
