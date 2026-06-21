import { useEffect } from "react";

export function useAutoScrollDrag() {
  useEffect(() => {
    let direction = 0;

    const onDragOver = (e: DragEvent) => {
      const y = e.clientY;

      if (y < 100) {
        direction = -1;
      } else if (window.innerHeight - y < 100) {
        direction = 1;
      } else {
        direction = 0;
      }
    };

    const tick = () => {
      if (direction !== 0) {
        window.scrollBy(0, direction * 10);
      }

      requestAnimationFrame(tick);
    };

    window.addEventListener("dragover", onDragOver);

    const frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("dragover", onDragOver);
      cancelAnimationFrame(frame);
    };
  }, []);
}
