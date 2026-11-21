import { useEffect, useId, useRef } from "react";
import { catalog, productKindLabels } from "./catalog";
import { useCart } from "./CartState";
import { MAX_CART_QUANTITY } from "./cart-model";

type Props = { open: boolean; onClose: () => void };
const productById = new Map(catalog.map(product => [product.id, product]));
const currency = new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 });

function itemLabel(count: number) {
  const lastTwo = count % 100;
  const word = lastTwo >= 11 && lastTwo <= 14 ? "товаров" : count % 10 === 1 ? "товар" : count % 10 >= 2 && count % 10 <= 4 ? "товара" : "товаров";
  return `${count} ${word}`;
}

export default function CartDrawer({ open, onClose }: Props) {
  const { items, count, total, ready, cartHref, setQuantity, remove } = useCart();
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const backdropPress = useRef(false);
  const titleId = useId();

  useEffect(() => {
    const element = dialog.current;
    if (!open || !element) return;
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbar = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    if (scrollbar) document.body.style.paddingRight = `${(parseFloat(getComputedStyle(document.body).paddingRight) || 0) + scrollbar}px`;
    document.body.style.overflow = "hidden";
    if (!element.open) element.showModal();
    closeButton.current?.focus({ preventScroll: true });
    return () => {
      if (element.open) element.close();
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      backdropPress.current = false;
      const returnTarget = opener instanceof HTMLElement && opener.isConnected && opener !== document.body
        ? opener : document.querySelector<HTMLElement>('[data-cart-trigger], [aria-controls="prichudy-cart"]');
      returnTarget?.focus({ preventScroll: true });
    };
  }, [open]);

  function isBackdrop(event: { target: EventTarget; clientX: number; clientY: number }) {
    const element = dialog.current;
    if (!element || event.target !== element) return false;
    const rect = element.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  }

  return <dialog id="prichudy-cart" ref={dialog} className="cart-drawer" aria-labelledby={titleId}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClose={() => { if (open) onClose(); }}
    onPointerDown={event => { backdropPress.current = isBackdrop(event); }}
    onClick={event => { if (backdropPress.current && isBackdrop(event)) onClose(); backdropPress.current = false; }}>
    <header className="cart-drawer-heading">
      <div><h2 id={titleId}>Корзина</h2><p className="cart-drawer-count" role="status">{ready ? itemLabel(count) : "Загружаем корзину…"}</p></div>
      <button ref={closeButton} type="button" className="cart-drawer-close" aria-label="Закрыть корзину" onClick={onClose}>
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" /></svg>
      </button>
    </header>
    <div className="cart-drawer-body">
      {!ready ? <p className="cart-drawer-loading">Восстанавливаем ваш выбор.</p> : items.length === 0 ? <div className="cart-drawer-empty">
        <svg className="cart-drawer-bag" viewBox="0 0 64 72" aria-hidden="true"><path d="M12 22h40l4 44H8l4-44ZM23 24V15a9 9 0 0 1 18 0v9" /></svg>
        <h3>Здесь будут ваши Причуды</h3>
        <p>Выберите варежки или чехол с принтом по настроению.</p>
        <a className="cart-drawer-primary" href="./index.html#collection" onClick={onClose}>К коллекции</a>
      </div> : <ul className="cart-drawer-items">
        {items.map(item => {
          const product = productById.get(item.productId);
          if (!product) return null;
          return <li className="cart-drawer-item" key={item.productId}>
            <div className="cart-drawer-picture"><img src={product.thumbnail} alt="" width="90" height="106" /></div>
            <div className="cart-drawer-details">
              <p className="cart-drawer-kind">{productKindLabels[product.kind]}</p>
              <h3>{product.title}</h3>
              <p className="cart-drawer-price">{currency.format(product.price)}</p>
              <div className="cart-drawer-item-actions">
                <div className="cart-drawer-quantity" role="group" aria-label={`Количество: ${product.title}`}>
                  <button type="button" aria-label={`Уменьшить количество «${product.title}»`} disabled={item.quantity <= 1} onClick={() => setQuantity(item.productId, item.quantity - 1)}>−</button>
                  <output aria-live="polite" aria-label={`Количество «${product.title}»`}>{item.quantity}</output>
                  <button type="button" aria-label={`Увеличить количество «${product.title}»`} disabled={item.quantity >= MAX_CART_QUANTITY} onClick={() => setQuantity(item.productId, item.quantity + 1)}>+</button>
                </div>
                <button type="button" className="cart-drawer-remove" aria-label={`Убрать «${product.title}» из корзины`} onClick={() => remove(item.productId)}>Убрать</button>
              </div>
            </div>
          </li>;
        })}
      </ul>}
    </div>
    {ready && items.length > 0 && <div className="cart-drawer-footer">
      <p className="cart-drawer-total"><span>Итого</span><strong>{currency.format(total)}</strong></p>
      <a className="cart-drawer-primary" href={cartHref} onClick={onClose}>Оформить покупку <span aria-hidden="true">→</span></a>
      <button type="button" className="cart-drawer-continue" onClick={onClose}>Продолжить выбирать</button>
    </div>}
  </dialog>;
}
