export type WinKind = "about" | "projects" | "experience" | "terminal" | "writing";

export type WinState = {
  id: string;        // unique id 
  kind: WinKind;     
  title: string;
  open: boolean;
  minimized: boolean;
  fullscreen: boolean;
  z: number;         // stacking order (higher = on top)
};

export type WMState = {
  byId: Record<string, WinState>;
  order: string[];   // render order (bottom..top)
  zCursor: number;   // increment to assign next top z
};
