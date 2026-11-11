import { useEffect, useRef } from "react";

type Star = { x: number; y: number; z: number; r: number };

export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stars: Star[] = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      r: Math.random() * 1.15 + 0.25,
    }));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w, h };
    };

    const draw = (time: number) => {
      if (!running) return;
      const { w, h } = resize();
      ctx.clearRect(0, 0, w, h);
      for (const star of stars) {
        const twinkle = reduced ? 0.75 : 0.4 + Math.sin(time / 800 + star.z * 14) * 0.35;
        ctx.globalAlpha = Math.max(0.15, twinkle);
        ctx.fillStyle = star.z > 0.86 ? "#3ee0ff" : "#d5e4ff";
        ctx.beginPath();
        ctx.arc(star.x * w, star.y * h, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    const onResize = () => {
      resize();
      if (reduced) draw(0);
    };
    window.addEventListener("resize", onResize);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 h-full w-full" />;
}
