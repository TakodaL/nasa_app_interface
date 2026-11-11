import { useEffect, useState } from "react";
import type { RoomState } from "@/lib/moon/model";
import { currentRoom, subscribeRoom, type Link } from "@/lib/moon/sync";

export function useRoom(): { state: RoomState; link: Link; now: number } {
  const [state, setState] = useState<RoomState>(() => currentRoom().state);
  const [link, setLink] = useState<Link>(() => currentRoom().link);
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    const unsub = subscribeRoom((next, nextLink) => {
      setState(next);
      setLink(nextLink);
    });
    const tick = window.setInterval(() => setNow(Date.now()), 3000);
    return () => {
      unsub();
      window.clearInterval(tick);
    };
  }, []);

  return { state, link, now };
}
