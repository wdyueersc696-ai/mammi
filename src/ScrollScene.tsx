import { useEffect, useRef } from "react";

type Props = { imageSrc: string };

export default function ScrollScene({ imageSrc }: Props) {
  const scene = useRef<HTMLDivElement>(null);
  const art = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const element = scene.current;
    const illustration = art.current;
    if (!element || !illustration) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    function update() {
      frame = 0;
      if (reducedMotion.matches) {
        element!.removeAttribute("data-animated");
        element!.style.removeProperty("--scene-x");
        return;
      }

      const bounds = element!.getBoundingClientRect();
      const viewport = window.innerHeight;
      const start = viewport * 0.97;
      const end = Math.min(viewport * 0.6, viewport - bounds.height - 24);
      const progress = Math.max(0, Math.min(1, (start - bounds.top) / (start - end)));
      const remaining = Math.pow(1 - progress, 3);
      const distance = (bounds.width + illustration!.clientWidth) / 2 + 24;
      element!.style.setProperty("--scene-x", (remaining * distance).toFixed(2) + "px");
      element!.setAttribute("data-animated", "true");
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, []);

  return <div className="scroll-scene" ref={scene}>
    <img ref={art} className="scroll-scene-art" src={imageSrc}
      alt="Девушка в зимней куртке и полосатых варежках везёт коляску с чехлом в тон"
      width="1536" height="1024" loading="lazy" decoding="async" />
  </div>;
}

