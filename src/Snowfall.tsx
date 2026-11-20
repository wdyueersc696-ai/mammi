import { useEffect, useRef, useState, type CSSProperties } from "react";

// Fixed positions keep server and browser markup identical.
const flakes = [
  [8, 7, 31, -9, 8], [17, 3, 26, -19, -10], [27, 11, 34, -5, 13],
  [37, 4, 29, -24, 7], [46, 8, 32, -15, -12], [55, 3, 27, -2, 10],
  [64, 12, 35, -29, -8], [74, 4, 30, -12, 14], [84, 8, 33, -21, -11],
  [93, 3, 28, -7, 8], [12, 4, 36, -30, -6], [42, 3, 30, -10, 9],
  [69, 5, 38, -18, 6], [89, 10, 36, -4, -10],
];

export default function Snowfall({ name, offset = 0 }: { name: string; offset?: number }) {
  const layer = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const card = layer.current?.parentElement;
    if (!card) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const update = () => setActive(visible && !document.hidden && !reducedMotion.matches && !paused);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(card);
    document.addEventListener("visibilitychange", update);
    reducedMotion.addEventListener("change", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, [paused]);

  return <>
    <div ref={layer} className="snowfall" data-active={active} aria-hidden="true">
      {flakes.map(([left, size, duration, delay, drift], index) => <span
        key={index} className={size > 6 ? "snow-track" : "snow-track snow-track--dot"}
        style={{
          "--snow-x": `${left}%`, "--snow-size": `${size}px`,
          "--snow-duration": `${duration}s`, "--snow-delay": `${delay - offset}s`,
          "--snow-drift": `${drift}px`,
        } as CSSProperties}>
        {size > 6 ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M12 2v20M3.34 7l17.32 10M3.34 17 20.66 7M9 4l3 3 3-3M9 20l3-3 3 3M4.3 10.6l4.1-1.1-1.1-4.1M19.7 13.4l-4.1 1.1 1.1 4.1M4.3 13.4l4.1 1.1-1.1 4.1M19.7 10.6l-4.1-1.1 1.1-4.1" />
        </svg> : <i />}
      </span>)}
    </div>
    <button className="snow-toggle" type="button" aria-pressed={paused}
      aria-label={`${paused ? "Включить" : "Приостановить"} снег на плашке «${name}»`}
      title={paused ? "Включить снег" : "Приостановить снег"}
      onClick={() => setPaused(value => !value)}>
      <span aria-hidden="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {paused ? <path d="m7 4 8 6-8 6Z" /> : <path d="M7 5v10M13 5v10" />}
      </svg></span>
    </button>
  </>;
}
