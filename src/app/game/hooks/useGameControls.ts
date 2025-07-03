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
        console.log("Sending input:", keys.current);
        socket.emit("playerInput", {
          roomId,
          input: {
            up: keys.current.up,
            left: keys.current.left,
            right: keys.current.right,
            down: keys.current.down,
          },
        });
      } else {
        console.warn("Socket not connected, cannot send input");
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      let keyChanged = false;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "W", "a", "A", "s", "S", "d", "D"].includes(e.key)) {
        e.preventDefault();
      }

      if (["ArrowUp", "w", "W"].includes(e.key)) {
        if (!keys.current.up) {
          keys.current.up = true;
          keyChanged = true;
        }
      }
      if (["ArrowLeft", "a", "A"].includes(e.key)) {
        if (!keys.current.left) {
          keys.current.left = true;
          keyChanged = true;
        }
      }
      if (["ArrowRight", "d", "D"].includes(e.key)) {
        if (!keys.current.right) {
          keys.current.right = true;
          keyChanged = true;
        }
      }
      if (["ArrowDown", "s", "S"].includes(e.key)) {
        if (!keys.current.down) {
          keys.current.down = true;
          keyChanged = true;
        }
      }

      if (keyChanged) {
        e.preventDefault();
        handleKeyChange();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      let keyChanged = false;

      if (["ArrowUp", "w", "W"].includes(e.key)) {
        if (keys.current.up) {
          keys.current.up = false;
          keyChanged = true;
        }
      }
      if (["ArrowLeft", "a", "A"].includes(e.key)) {
        if (keys.current.left) {
          keys.current.left = false;
          keyChanged = true;
        }
      }
      if (["ArrowRight", "d", "D"].includes(e.key)) {
        if (keys.current.right) {
          keys.current.right = false;
          keyChanged = true;
        }
      }
      if (["ArrowDown", "s", "S"].includes(e.key)) {
        if (keys.current.down) {
          keys.current.down = false;
          keyChanged = true;
        }
      }

      if (keyChanged) {
        e.preventDefault();
        handleKeyChange();
      }
    };

    console.log("Setting up keyboard controls for room:", roomId);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      console.log("Cleaning up keyboard controls");
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [roomId]);
}
