import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, TouchEvent } from "react";

export type LookbookItem = {
  id: string;
  title: string;
  location: string;
  style: string;
  image: string;
};

export type LookbookProps = { items: LookbookItem[] };

function Arrow({ next = false }: { next?: boolean }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={next ? "M5 12h14m-6-6 6 6-6 6" : "M19 12H5m6-6-6 6 6 6"} /></svg>;
}

export default function Lookbook({ items }: LookbookProps) {
  const uid = useId();
  const dialogId = `lb-dialog-${uid}`;
  const trackId = `lb-track-${uid}`;
  const dialog = useRef<HTMLDialogElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const previousOverflow = useRef<string | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const backdropPress = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const index = Math.min(activeIndex, Math.max(items.length - 1, 0));
  const item = items[index];

  function releaseDialog() {
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current;
      previousOverflow.current = null;
    }
    if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
    opener.current = null;
    touchStart.current = null;
  }

  useEffect(() => {
    const element = dialog.current;
    return () => {
      if (element?.open) element.close();
      releaseDialog();
    };
  }, []);

  useEffect(() => {
    if (!items.length && dialog.current?.open) dialog.current.close();
  }, [items.length]);

  function openAt(nextIndex: number, event: MouseEvent<HTMLButtonElement>) {
    if (!dialog.current) return;
    opener.current = event.currentTarget;
    setActiveIndex(nextIndex);
    if (!dialog.current.open) {
      previousOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      dialog.current.showModal();
    }
    setIsOpen(true);
  }

  function changeImage(direction: number) {
    if (items.length < 2) return;
    setActiveIndex(current => (Math.min(current, items.length - 1) + direction + items.length) % items.length);
  }

  function handleKey(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      changeImage(event.key === "ArrowRight" ? 1 : -1);
    }
  }

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    if (event.touches.length !== 1) {
      touchStart.current = null;
      return;
    }
    touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }

  function handleTouchEnd(event: TouchEvent<HTMLElement>) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) changeImage(dx < 0 ? 1 : -1);
  }

  function scrollPreview(direction: number) {
    if (!track.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.current.scrollBy({ left: direction * track.current.clientWidth * 0.78, behavior: reduced ? "auto" : "smooth" });
  }

  if (!item) return null;

  return (
    <section className="lb-section bounds" aria-labelledby={`lb-heading-${uid}`}>
      <div className="lb-heading-row">
        <div>
          <p className="lb-eyebrow">Санкт-Петербург · разные образы</p>
          <h2 className="lb-heading" id={`lb-heading-${uid}`}>Причуды в городе</h2>
          <p className="lb-intro">К пуховику, пальто и вашему настроению. Посмотрите, как носить наши варежки.</p>
        </div>
        <div className="lb-strip-controls" aria-label="Прокрутка образов">
          <button className="lb-icon-button" type="button" onClick={() => scrollPreview(-1)} aria-controls={trackId} aria-label="Прокрутить образы влево"><Arrow /></button>
          <button className="lb-icon-button" type="button" onClick={() => scrollPreview(1)} aria-controls={trackId} aria-label="Прокрутить образы вправо"><Arrow next /></button>
        </div>
      </div>

      <ul className="lb-track" id={trackId} ref={track}>
        {items.map((entry, entryIndex) => (
          <li className="lb-card" key={entry.id}>
            <button className="lb-card-button" type="button" aria-haspopup="dialog" aria-controls={dialogId} aria-label={`Открыть образ ${entryIndex + 1} из ${items.length}: ${entry.title}, ${entry.location}`} onClick={event => openAt(entryIndex, event)}>
              <span className="lb-card-image">
                <img src={entry.image} alt={`Модель в варежках «${entry.title}». ${entry.style}. ${entry.location}`} loading="lazy" decoding="async" width="1000" height="1250" />
                <span className="lb-card-open" aria-hidden="true">Смотреть образ <span>↗</span></span>
              </span>
              <span className="lb-card-caption"><strong>{entry.title}</strong><span>{entry.location}</span></span>
            </button>
          </li>
        ))}
      </ul>
      <div className="lb-footnote"><span>Листайте и открывайте фотографии</span><span>Образы созданы с помощью ИИ.</span></div>

      <dialog
        className="lb-dialog"
        ref={dialog}
        id={dialogId}
        aria-labelledby={`lb-dialog-title-${uid}`}
        aria-describedby={`lb-dialog-description-${uid}`}
        onKeyDown={handleKey}
        onClose={() => { setIsOpen(false); releaseDialog(); }}
        onPointerDown={event => { backdropPress.current = event.target === event.currentTarget; }}
        onClick={event => { if (backdropPress.current && event.target === event.currentTarget) dialog.current?.close(); backdropPress.current = false; }}
      >
        <div className="lb-dialog-panel">
          <div className="lb-dialog-top">
            <span className="lb-dialog-brand">Причуды в городе</span>
            <button className="lb-icon-button lb-close" type="button" onClick={() => dialog.current?.close()} aria-label="Закрыть фотографии" autoFocus>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
          </div>

          <div className="lb-dialog-content">
            <div className="lb-photo" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchCancel={() => { touchStart.current = null; }}>
              <img src={item.image} alt={`Модель в варежках «${item.title}». ${item.style}. ${item.location}`} width="1000" height="1250" decoding="async" draggable={false} />
            </div>
            <div className="lb-detail">
              <p className="lb-eyebrow">Варежки «Причуды»</p>
              <h3 className="lb-dialog-title" id={`lb-dialog-title-${uid}`}>{item.title}</h3>
              <div id={`lb-dialog-description-${uid}`}>
                <p className="lb-location">{item.location}</p>
                <p className="lb-style">{item.style}</p>
              </div>
              <div className="lb-pagination">
                <button className="lb-icon-button" type="button" onClick={() => changeImage(-1)} disabled={items.length < 2} aria-label="Предыдущий образ"><Arrow /></button>
                <p className="lb-count" role="status" aria-live="polite" aria-atomic="true"><span className="lb-sr-only">Образ </span>{index + 1} <span aria-hidden="true">/</span><span className="lb-sr-only"> из </span> {items.length}<span className="lb-sr-only">. {item.title}, {item.location}</span></p>
                <button className="lb-icon-button" type="button" onClick={() => changeImage(1)} disabled={items.length < 2} aria-label="Следующий образ"><Arrow next /></button>
              </div>
              <p className="lb-dialog-hint">Листайте свайпом или стрелками</p>
              <div className="lb-thumbnails" aria-label="Выбрать образ">
                {items.map((entry, entryIndex) => (
                  <button className={`lb-thumb${entryIndex === index ? " lb-thumb-active" : ""}`} key={entry.id} type="button" aria-label={`Образ ${entryIndex + 1}: ${entry.title}`} aria-pressed={entryIndex === index} onClick={() => setActiveIndex(entryIndex)}>
                    {isOpen && <img src={entry.image} alt="" width="60" height="80" decoding="async" />}
                    <span>{entryIndex + 1}</span>
                  </button>
                ))}
              </div>
              <p className="lb-ai-caption">Образы созданы с помощью ИИ.</p>
            </div>
          </div>
        </div>
      </dialog>
    </section>
  );
}
