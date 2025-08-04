import { useCallback, useMemo, useState } from "react";
import type { WMState, WinKind, WinState } from "./types";

const TITLES: Record<WinKind, string> = {
  about: "ABOUT",
  projects: "PROJECTS",
  experience: "EXPERIENCE",
  terminal: "TERMINAL",
  writing: "WRITING",
};

export function useWindowManager() {
  const [wm, setWM] = useState<WMState>({
    byId: {},
    order: [],
    zCursor: 10,
  });

  const focus = useCallback((id: string) => {
    setWM(s => {
      const win = s.byId[id];
      if (!win) return s;
      const topZ = s.zCursor + 1;
      const byId = { ...s.byId, [id]: { ...win, z: topZ } };
      const order = s.order.filter(x => x !== id).concat(id);
      return { byId, order, zCursor: topZ };
    });
  }, []);

  // Single-instance windows: reuse by kind id. Change to multi-instance by appending #timestamp
  const open = useCallback((kind: WinKind) => {
    const id = kind; // for multi-instance use: `${kind}#${Date.now()}`
    setWM(s => {
      const existing = s.byId[id];
      if (existing) {
        const topZ = s.zCursor + 1;
        const byId = {
          ...s.byId,
          [id]: { ...existing, open: true, minimized: false, z: topZ },
        };
        const order = s.order.filter(x => x !== id).concat(id);
        return { byId, order, zCursor: topZ };
      }
      const z = s.zCursor + 1;
      const win: WinState = {
        id,
        kind,
        title: TITLES[kind],
        open: true,
        minimized: false,
        fullscreen: false,
        z,
      };
      return { byId: { ...s.byId, [id]: win }, order: [...s.order, id], zCursor: z };
    });
  }, []);

  const close = useCallback((id: string) => {
    setWM(s => {
      const win = s.byId[id];
      if (!win) return s;
      const byId = { ...s.byId, [id]: { ...win, open: false, minimized: false, fullscreen: false } };
      const order = s.order.filter(x => x !== id);
      return { ...s, byId, order };
    });
  }, []);

  const minimize = useCallback((id: string) => {
    setWM(s => {
      const win = s.byId[id];
      if (!win) return s;
      const byId = { ...s.byId, [id]: { ...win, minimized: true } };
      return { ...s, byId };
    });
  }, []);

  const toggleFullscreen = useCallback((id: string) => {
    setWM(s => {
      const win = s.byId[id];
      if (!win) return s;
      const byId = { ...s.byId, [id]: { ...win, fullscreen: !win.fullscreen, minimized: false } };
      return { ...s, byId };
    });
  }, []);

  return useMemo(
    () => ({ wm, open, close, minimize, toggleFullscreen, focus }),
    [wm, open, close, minimize, toggleFullscreen, focus]
  );
}
