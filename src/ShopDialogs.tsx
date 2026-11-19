import { useEffect, useRef, useState } from "react";

type Page = "product" | "order" | "policy" | "terms" | "complete";
type Props = {
  modal: "order" | "policy" | null;
  onClose: () => void;
  kind: "mittens" | "cover";
  print: "stripes" | "dots" | "geese" | "horses";
};

const names = {
  stripes: "Туда / сюда", dots: "Ой / всё",
  geese: "Ни пуха / ни пера", horses: "Конь / огонь",
};
const titles = {
  product: "Об изделии",
  order: "Пример предзаказа",
  policy: "Политика конфиденциальности",
  terms: "Об этой форме",
  complete: "Так выглядит ваш выбор",
};

const descriptions = {
  mittens: {
    intro: "Утеплённые варежки для зимних прогулок с коляской, поездок на санках и дороги домой за руку. Внутри предусмотрены мягкий флис и отдельный слой утеплителя.",
    details: [
      ["Верх", "Плащёвая ткань дюспо с нашим принтом"],
      ["Подкладка", "Мягкий флис"],
      ["Утепление", "Отдельный синтетический слой"],
      ["Детали", "Сборка на запястье и съёмный шнур, чтобы варежки оставались вместе"],
    ],
    note: "Сейчас готовим первый образец. После примерки уточним размеры, окончательный состав и рекомендации по уходу.",
  },
  cover: {
    intro: "Готовим утеплённый чехол для зимних прогулок с коляской. Спереди предусмотрены молния и прозрачное открываемое окно. Принт можно подобрать в тон варежкам.",
    details: [
      ["Верх", "Плащёвая ткань с нашим принтом"],
      ["Подкладка", "Гладкая подкладочная ткань"],
      ["Утепление", "Отдельный синтетический слой"],
      ["Детали", "Центральная молния, открываемое прозрачное окно"],
    ],
    note: "Материалы пока предварительные. Размеры и список подходящих колясок добавим после примерок образца.",
  },
};

function PreviewDialog({ modal, onClose, kind, print }: Props & { modal: "order" | "policy" }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const returnTarget = useRef<string | null>(null);
  const [page, setPage] = useState<Page>(modal === "order" ? "product" : "policy");
  const [accepted, setAccepted] = useState(false);
  const product = kind === "mittens" ? "Варежки" : "Чехол для коляски";
  const description = descriptions[kind];

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const opener = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = originalOverflow;
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    if (page === "order" && returnTarget.current) {
      document.getElementById(returnTarget.current)?.focus();
      returnTarget.current = null;
    } else {
      heading.current?.focus({ preventScroll: true });
    }
    dialog.current?.scrollTo({ top: 0 });
  }, [page]);

  const nested = modal === "order" && (page === "policy" || page === "terms");
  function closeOrBack() {
    if (nested) setPage("order");
    else onClose();
  }

  return <dialog ref={dialog} className={`m-dialog${page === "product" ? " m-dialog--product" : ""}`} aria-labelledby="dialog-title"
    onCancel={event => { event.preventDefault(); closeOrBack(); }}
    onClick={event => { if (event.target === dialog.current) closeOrBack(); }}>
    <div className="m-dialog-panel">
      <button type="button" className="m-dialog-close" aria-label={nested ? "Назад к форме" : "Закрыть"} onClick={closeOrBack}>
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 4 12 12m0-12L4 16" /></svg>
      </button>
      <h2 id="dialog-title" ref={heading} tabIndex={-1}>{page === "product" ? product : titles[page]}</h2>
      {page === "product" && <div className="m-product-layout">
        <div className={`m-product-picture m-product-picture--${kind}`}>
          <img src={`./products/${kind}-${print}.webp`} alt={`${product} «${names[print]}», эскиз`} width="460" height={kind === "mittens" ? 460 : 614} />
        </div>
        <div className="m-product-description">
          <h3 className="m-product-name">{names[print]}</h3>
          <p>{description.intro}</p>
          <h3>Материалы и детали</h3>
          <dl className="m-product-specs">{description.details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          <p className="m-product-note">{description.note}</p>
          <button type="button" className="m-dialog-main" onClick={() => setPage("order")}>Посмотреть форму предзаказа</button>
          <p className="m-product-availability">Предзаказ пока не открыт. Цена и сроки появятся здесь позже.</p>
        </div>
      </div>}
      {page === "order" && <>
        <div className="m-dialog-product">
          <img src={`./products/${kind}-${print}-460.webp`} alt="" width="82" height="82" />
          <div><span>{product}</span><strong>{names[print]}</strong></div>
        </div>
        <button type="button" className="m-dialog-link m-product-back" onClick={() => setPage("product")}>К описанию и составу</button>
        <p>Предзаказ откроется позже. Пока можно посмотреть форму с примером электронной почты.</p>
        <form className="m-dialog-form" onSubmit={event => { event.preventDefault(); if (accepted) setPage("complete"); }}>
          <label htmlFor="demo-email">Пример электронной почты</label>
          <input id="demo-email" type="email" value="primer@example.com" readOnly autoComplete="off" />
          <div className="m-dialog-consent">
            <input type="checkbox" id="demo-consent" required checked={accepted}
              onChange={event => setAccepted(event.target.checked)} />
            <div><label htmlFor="demo-consent">Понимаю, что это пример заявки.</label>{" "}
              <button id="demo-terms" className="m-dialog-link" type="button" onClick={() => { returnTarget.current = "demo-terms"; setPage("terms"); }}>Подробнее</button>
            </div>
          </div>
          <button type="submit" className="m-dialog-main">Посмотреть итог</button>
          <button id="demo-policy" type="button" className="m-dialog-link m-dialog-policy-link" onClick={() => { returnTarget.current = "demo-policy"; setPage("policy"); }}>Политика конфиденциальности</button>
        </form>
      </>}
      {page === "policy" && <>
        <div className="m-dialog-document">
          <p>Оператор mammi — Крицких Галина Алексеевна.</p>
          <h3>Демонстрационная форма</h3>
          <p>Форма показывает выбранное изделие и принт на вашем устройстве. В поле почты подставлен демонстрационный адрес. Отправки контактных данных и регистрации предзаказа здесь нет.</p>
          <h3>На вашем устройстве</h3>
          <p>Браузер запоминает закрытие подсказки о данных. Эту отметку можно удалить в настройках сайта. Выбор в форме сбрасывается при её закрытии.</p>
          <h3>Размещение сайта</h3>
          <p>Файлы витрины загружаются с GitHub Pages. Обслуживание запросов хостингом регулирует <a href="https://docs.github.com/ru/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noreferrer">политика конфиденциальности GitHub</a>.</p>
        </div>
        <button type="button" className="m-dialog-main" onClick={closeOrBack}>{nested ? "Вернуться к форме" : "Всё схвачено"}</button>
      </>}
      {page === "terms" && <>
        <p>Можно пройти все шаги и посмотреть выбранное сочетание. Магазин пока не принимает заявки, а покупателю не нужно вводить свою почту.</p>
        <button type="button" className="m-dialog-main" onClick={closeOrBack}>Вернуться к форме</button>
      </>}
      {page === "complete" && <>
        <p className="m-dialog-receipt">{product} «{names[print]}»</p>
        <p>Готово! Вы посмотрели пример. Заявка в магазин не отправлялась.</p>
        <button type="button" className="m-dialog-main" onClick={onClose}>К коллекции</button>
      </>}
    </div>
  </dialog>;
}

export default function ShopDialogs(props: Props) {
  if (!props.modal) return null;
  return <PreviewDialog {...props} modal={props.modal} />;
}
