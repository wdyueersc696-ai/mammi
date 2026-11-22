import { useEffect, useRef } from "react";
import ProductFacts from "./ProductFacts";
import type { CatalogProduct } from "./catalog";
import { money } from "./shop-config";

type Props = { product: CatalogProduct; onClose: () => void; onAdd: (product: CatalogProduct) => void };

export default function ShopDialogs({ product, onClose, onAdd }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const isMittens = product.kind === "mittens";
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const opener = document.activeElement;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    heading.current?.focus({ preventScroll: true });
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  return <dialog ref={dialog} className="m-dialog m-dialog--product" aria-labelledby="product-dialog-title"
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => {
      if (event.target !== dialog.current) return;
      const rect = dialog.current.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
    }}>
    <div className="m-dialog-panel">
      <button type="button" className="m-dialog-close" aria-label="Закрыть описание" onClick={onClose}>
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 4 12 12m0-12L4 16" /></svg>
      </button>
      <h2 id="product-dialog-title" ref={heading} tabIndex={-1}>{isMittens ? "Варежки" : "Чехол для коляски"}</h2>
      <div className="m-product-layout">
        <div className={`m-product-picture m-product-picture--${product.kind}`}>
          {!isMittens && <>
            <svg width="0" height="0" aria-hidden="true" className="m-cover-filter">
              <filter id="neutral-cover-studio" colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
                {/* Isolate the light studio paper by its colour distance, retaining the print and contact shadows. */}
                <feFlood floodColor="#e9d9d2" />
                <feBlend in2="SourceGraphic" mode="difference" />
                <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -9 -9 -9 0 1.9" result="paper" />
                <feColorMatrix in="SourceGraphic" type="saturate" values="0" />
                <feComposite in2="paper" operator="in" />
                <feComposite in2="SourceGraphic" operator="over" />
              </filter>
            </svg>
            <span className="m-cover-backdrop" aria-hidden="true" style={{ borderImageSource: `url("${product.image}")` }} />
          </>}
          <img src={product.image} alt={`${isMittens ? "Варежки" : "Чехол"} «${product.title}», эскиз`} width="460" height={isMittens ? 460 : 614} />
        </div>
        <div className="m-product-description">
          <h3 className="m-product-name">{product.title}</h3>
          <p className="product-dialog-price">{money(product.price)}</p>
          <p>{product.description ?? (isMittens ? "Утеплённые варежки для зимних прогулок — с коляской, за руку или просто по любимому маршруту. Внутри мягкий флис и отдельный слой утеплителя." : "Готовим утеплённый чехол для зимних прогулок с коляской. Спереди предусмотрены молния и прозрачное открываемое окно. Принт можно подобрать в тон варежкам.")}</p>
          <button type="button" className="m-dialog-main" onClick={() => onAdd(product)}>В корзину · {money(product.price)}</button>
          <a className="product-delivery-link" href="./delivery.html">О доставке и оплате →</a>
          {isMittens ? <ProductFacts confirmed={true} /> : <>
            <h3>Материалы и детали</h3>
            <dl className="m-product-specs">{[
              ["Верх", "Плащёвая ткань с нашим принтом"],
              ["Подкладка", "Гладкая подкладочная ткань"],
              ["Утепление", "Отдельный синтетический слой"],
              ["Детали", "Центральная молния, открываемое прозрачное окно"],
            ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
            <p className="m-product-note">Материалы пока предварительные. Размеры и список подходящих колясок добавим после примерок образца.</p>
          </>}
        </div>
      </div>
    </div>
  </dialog>;
}
