import React, { useEffect, useRef, useState } from "react";

type WindowProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize?: () => void;
  onToggleFullscreen?: () => void;
  onFocus?: () => void;
  contentClassName?: string; // override the inner content area (padding/overflow/bg)
  frameClassName?: string;   // override the outer frame (border/bg/shadow/radius)
  zIndex?: number;
  initialX?: number;
  initialY?: number;
};

const MIN_W = 320;
const MIN_H = 200;
const DEFAULT_W = 640;
const DEFAULT_H = 420;

export default function Window({
  title,
  children,
  onClose,
  onMinimize,
  onToggleFullscreen,
  onFocus,
  contentClassName,
  frameClassName,
  zIndex = 1,
  initialX,
  initialY,
}: WindowProps) {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  const [w, setW] = useState(() => Math.min(DEFAULT_W, Math.round(vw * 0.9)));
  const [h, setH] = useState(() => Math.min(DEFAULT_H, Math.round(vh * 0.7)));

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
  const [x, setX] = useState(() => {
    const cw = Math.min(DEFAULT_W, Math.round(vw * 0.9));
    const def = Math.round((vw - cw) / 2);
    const raw = initialX ?? def;
    return clamp(raw, 0, Math.max(0, vw - cw));
  });
  const [y, setY] = useState(() => {
    const ch = Math.min(DEFAULT_H, Math.round(vh * 0.7));
    const def = Math.round((vh - ch) / 2);
    const raw = initialY ?? def;
    return clamp(raw, 0, Math.max(0, vh - ch));
  });

  // drag/resize state
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ dx: 0, dy: 0 });
  const [resizing, setResizing] = useState(false);
  const resizeStart = useRef({ sx: 0, sy: 0, sw: 0, sh: 0 });

  // minimize/fullscreen (local)
  const [minimized, setMinimized] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const prevRect = useRef<{ x: number; y: number; w: number; h: number } | null>(null);

  // preserve scroll across minimize
  const contentRef = useRef<HTMLDivElement | null>(null);
  const savedScrollTop = useRef(0);

  const clampPos = (nx: number, ny: number, ww: number, hh: number) => {
    const maxX = Math.max(0, window.innerWidth - ww);
    const maxY = Math.max(0, window.innerHeight - hh);
    return { x: clamp(nx, 0, maxX), y: clamp(ny, 0, maxY) };
  };

  // DRAG (mouse)
  const onTitleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    dragOffset.current = { dx: e.clientX - x, dy: e.clientY - y };
    setDragging(true);
    onFocus?.();
  };
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      if ((e.buttons & 1) !== 1) { setDragging(false); return; }
      const nx = e.clientX - dragOffset.current.dx;
      const ny = e.clientY - dragOffset.current.dy;
      const p = clampPos(nx, ny, w, minimized ? 32 : h);
      setX(p.x); setY(p.y);
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging, w, h, minimized, x, y]);

  // DRAG (touch)
  const onTitleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]; if (!t) return;
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    dragOffset.current = { dx: t.clientX - x, dy: t.clientY - y };
    setDragging(true);
    onFocus?.();
  };
  const onTitleTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return;
    const t = e.touches[0]; if (!t) return;
    e.preventDefault();
    const nx = t.clientX - dragOffset.current.dx;
    const ny = t.clientY - dragOffset.current.dy;
    const p = clampPos(nx, ny, w, minimized ? 32 : h);
    setX(p.x); setY(p.y);
  };
  const onTitleTouchEnd = () => setDragging(false);

  // RESIZE (mouse)
  const onResizeMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    resizeStart.current = { sx: e.clientX, sy: e.clientY, sw: w, sh: h };
    setResizing(true);
    onFocus?.();
  };
  useEffect(() => {
    if (!resizing) return;
    const onMove = (e: MouseEvent) => {
      if ((e.buttons & 1) !== 1) { setResizing(false); return; }
      const dx = e.clientX - resizeStart.current.sx;
      const dy = e.clientY - resizeStart.current.sy;
      const nw = clamp(resizeStart.current.sw + dx, MIN_W, window.innerWidth - x);
      const nh = clamp(resizeStart.current.sh + dy, MIN_H, window.innerHeight - y);
      setW(nw); setH(nh);
    };
    const onUp = () => setResizing(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [resizing, x, y]);

  // RESIZE (touch)
  const onResizeTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]; if (!t) return;
    e.preventDefault();
    resizeStart.current = { sx: t.clientX, sy: t.clientY, sw: w, sh: h };
    setResizing(true);
    onFocus?.();
  };
  const onResizeTouchMove = (e: React.TouchEvent) => {
    if (!resizing) return;
    const t = e.touches[0]; if (!t) return;
    e.preventDefault();
    const dx = t.clientX - resizeStart.current.sx;
    const dy = t.clientY - resizeStart.current.sy;
    const nw = clamp(resizeStart.current.sw + dx, MIN_W, window.innerWidth - x);
    const nh = clamp(resizeStart.current.sh + dy, MIN_H, window.innerHeight - y);
    setW(nw); setH(nh);
  };
  const onResizeTouchEnd = () => setResizing(false);

  // FULLSCREEN toggle
  const toggleFullscreen = () => {
    onToggleFullscreen?.();
    if (!fullscreen) {
      prevRect.current = { x, y, w, h };
      setX(0); setY(0);
      setW(window.innerWidth); setH(window.innerHeight);
      setMinimized(false);
      setFullscreen(true);
    } else {
      if (prevRect.current) {
        setX(prevRect.current.x); setY(prevRect.current.y);
        setW(prevRect.current.w); setH(prevRect.current.h);
      } else {
        const dw = Math.min(DEFAULT_W, Math.round(window.innerWidth * 0.9));
        const dh = Math.min(DEFAULT_H, Math.round(window.innerHeight * 0.7));
        setW(dw); setH(dh);
        setX(Math.round((window.innerWidth - dw) / 2));
        setY(Math.round((window.innerHeight - dh) / 2));
      }
      setFullscreen(false);
    }
  };

  // MINIMIZE toggle
  const toggleMinimize = () => {
    onMinimize?.();
    if (!minimized) {
      if (contentRef.current) savedScrollTop.current = contentRef.current.scrollTop;
      setMinimized(true);
    } else {
      setMinimized(false);
      requestAnimationFrame(() => {
        if (contentRef.current) contentRef.current.scrollTop = savedScrollTop.current;
      });
    }
  };

  // keep in viewport
  useEffect(() => {
    const onResize = () => {
      if (fullscreen) { setX(0); setY(0); setW(window.innerWidth); setH(window.innerHeight); return; }
      const p = clampPos(x, y, w, minimized ? 32 : h);
      setX(p.x); setY(p.y);
      setW(cur => Math.min(cur, window.innerWidth));
      setH(cur => Math.min(cur, window.innerHeight));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [x, y, w, h, minimized, fullscreen]);

  return (
    <div
      className={`fixed select-none rounded-md overflow-hidden ${
        frameClassName ?? "shadow-lg border border-gray-400 bg-white text-black"
      }`}
      style={{ left: x, top: y, width: w, height: minimized ? 32 : h, zIndex }}
      onMouseDown={() => onFocus?.()}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-3 py-1 bg-gray-200/90 border-b border-gray-400 cursor-move touch-none"
        onMouseDown={onTitleMouseDown}
        onTouchStart={onTitleTouchStart}
        onTouchMove={onTitleTouchMove}
        onTouchEnd={onTitleTouchEnd}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Close window"
            className="w-3 h-3 rounded-full bg-red-500 hover:brightness-110"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            onTouchStart={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            aria-label="Minimize window"
            className="w-3 h-3 rounded-full bg-yellow-400 hover:brightness-110"
            onClick={(e) => { e.stopPropagation(); toggleMinimize(); }}
            onTouchStart={(e) => e.stopPropagation()}
            title="Minimize"
          />
          <button
            type="button"
            aria-label="Toggle fullscreen"
            className="w-3 h-3 rounded-full bg-green-500 hover:brightness-110"
            onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
            onTouchStart={(e) => e.stopPropagation()}
            title={fullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          />
        </div>
        <span className="text-[13px] font-semibold text-gray-800 pointer-events-none">
          {title}
        </span>
        <div className="w-10" />
      </div>

      {/* Content */}
      {!minimized && (
        <div
          ref={contentRef}
          className={`w-full h-[calc(100%-28px)] overflow-auto p-4 text-sm ${contentClassName ?? ""}`}
        >
          {children}
        </div>
      )}

      {/* Resize handle */}
      {!fullscreen && !minimized && (
        <div
          className="absolute right-0 bottom-0 w-4 h-4 cursor-nwse-resize touch-none"
          onMouseDown={onResizeMouseDown}
          onTouchStart={onResizeTouchStart}
          onTouchMove={onResizeTouchMove}
          onTouchEnd={onResizeTouchEnd}
          title="Resize"
        >
          <div className="absolute right-1 bottom-1 w-2 h-2 border-r-2 border-b-2 border-gray-400" />
        </div>
      )}
    </div>
  );
}
