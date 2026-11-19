import { useEffect, useRef, useState } from "react";

type Props = {
  onSelect: (kind: "mittens" | "cover") => void;
  onPolicy: () => void;
  illustrationSrc?: string;
};

export default function MenuDrawer({ onSelect, onPolicy, illustrationSrc }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pendingAction = useRef<(() => void) | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollLock = useRef<{ overflow: string; paddingRight: string } | null>(null);
  const [phase, setPhase] = useState<"closed" | "open" | "closing">("closed");

  function releaseScroll() {
    if (!scrollLock.current) return;
    document.body.style.overflow = scrollLock.current.overflow;
    document.body.style.paddingRight = scrollLock.current.paddingRight;
    scrollLock.current = null;
  }

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    releaseScroll();
  }, []);

  function openMenu() {
    if (!dialog.current || dialog.current.open) return;
    scrollLock.current = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbar > 0) document.body.style.paddingRight = scrollbar + "px";
    document.body.style.overflow = "hidden";
    dialog.current.showModal();
    setPhase("open");
  }

  function finishClose() {
    if (!dialog.current?.open) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
    dialog.current?.close();
    releaseScroll();
    setPhase("closed");
    trigger.current?.focus({ preventScroll: true });
    const action = pendingAction.current;
    pendingAction.current = null;
    action?.();
  }

  function closeMenu(action?: () => void) {
    if (phase !== "open") return;
    pendingAction.current = action ?? null;
    setPhase("closing");
    closeTimer.current = setTimeout(finishClose, 450);
  }

  return <>
    <button ref={trigger} className="menu-toggle" type="button"
      aria-label="Открыть меню" aria-expanded={phase !== "closed"}
      aria-controls="mammi-menu" onClick={openMenu}>
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9h22M3 19h22" />
      </svg>
    </button>
    <dialog id="mammi-menu" ref={dialog} className="menu-drawer" data-phase={phase}
      aria-label="Меню mammi"
      onCancel={event => { event.preventDefault(); closeMenu(); }}
      onAnimationEnd={event => {
        if (event.target === dialog.current && phase === "closing") finishClose();
      }}
      onClick={event => {
        if (event.target !== dialog.current) return;
        const rect = dialog.current.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right ||
            event.clientY < rect.top || event.clientY > rect.bottom) closeMenu();
      }}>
      <div className="drawer-inner">
        <div className="drawer-heading">
          <span className="wordmark" aria-hidden="true">mammi</span>
          <button className="drawer-close" type="button" aria-label="Закрыть меню"
            onClick={() => closeMenu()}>
            <svg viewBox="0 0 28 28" width="28" height="28" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 6 16 16M22 6 6 22" />
            </svg>
          </button>
        </div>
        <nav className="drawer-nav" aria-label="Разделы сайта">
          <a href="#" onClick={event => { event.preventDefault(); closeMenu(() => window.scrollTo({ top: 0 })); }}>Главная</a>
          <button type="button" onClick={() => closeMenu(() => onSelect("mittens"))}>Варежки</button>
          <button type="button" onClick={() => closeMenu(() => onSelect("cover"))}>Чехлы на коляску</button>
          <a href="#preorder" onClick={event => {
            event.preventDefault();
            closeMenu(() => document.getElementById("preorder")?.scrollIntoView({ block: "start" }));
          }}>Как заказать</a>
        </nav>
        {illustrationSrc && <img className="drawer-friends" src={illustrationSrc}
          alt="Два рисованных персонажа с варежками mammi" width="640" height="420" />}
        <button className="drawer-policy" type="button" onClick={() => closeMenu(onPolicy)}>
          Политика конфиденциальности
        </button>
      </div>
    </dialog>
  </>;
}
