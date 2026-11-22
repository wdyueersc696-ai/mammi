import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useCart } from "./CartState";
import { MAX_CART_QUANTITY } from "./cart-model";
import { catalog, productKindLabels } from "./catalog";
import { money, shopConfig } from "./shop-config";

type Country = "RU" | "BY";
type DeliveryMethod = "yandex-pickup" | "cdek-pickup" | "cdek-courier";
type Customer = { name: string; email: string; phone: string; comment: string };

const deliveryMethods: { id: DeliveryMethod; title: string; description: string }[] = [
  { id: "yandex-pickup", title: "Яндекс Доставка", description: "В пункт выдачи / 5post" },
  { id: "cdek-pickup", title: "СДЭК", description: "В пункт выдачи" },
  { id: "cdek-courier", title: "СДЭК", description: "Курьером до двери" },
];
const cities: Record<Country, string[]> = {
  RU: ["Санкт-Петербург", "Москва", "Казань", "Екатеринбург", "Новосибирск", "Нижний Новгород", "Калининград"],
  BY: ["Минск", "Брест", "Гродно", "Гомель", "Витебск", "Могилёв"],
};

function Arrow() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Quantity({ title, value, onChange }: { title: string; value: number; onChange: (quantity: number) => void }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => { setDraft(String(value)); }, [value]);

  function finish() {
    const parsed = Number(draft);
    const next = draft.trim() && Number.isFinite(parsed)
      ? Math.min(MAX_CART_QUANTITY, Math.max(1, Math.floor(parsed)))
      : value;
    setDraft(String(next));
    if (next !== value) onChange(next);
  }

  return <div className="checkout-quantity">
    <button type="button" aria-label={`Уменьшить количество «${title}»`} disabled={value <= 1} onClick={() => onChange(value - 1)}>−</button>
    <input type="number" min="1" max={MAX_CART_QUANTITY} step="1" inputMode="numeric" aria-label={`Количество «${title}»`} value={draft}
      onChange={event => {
        const raw = event.currentTarget.value;
        setDraft(raw);
        const next = Number(raw);
        if (raw !== "" && Number.isInteger(next) && next >= 1 && next <= MAX_CART_QUANTITY) onChange(next);
      }}
      onBlur={finish}
      onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); event.currentTarget.blur(); } }} />
    <button type="button" aria-label={`Увеличить количество «${title}»`} disabled={value >= MAX_CART_QUANTITY} onClick={() => onChange(value + 1)}>+</button>
  </div>;
}

export default function CheckoutPage() {
  const { items, count, total, ready, setQuantity, remove, clear } = useCart();
  const [country, setCountry] = useState<Country>("RU");
  const [method, setMethod] = useState<DeliveryMethod>("cdek-pickup");
  const [city, setCity] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [street, setStreet] = useState("");
  const [house, setHouse] = useState("");
  const [apartment, setApartment] = useState("");
  const [customer, setCustomer] = useState<Customer>({ name: "", email: "", phone: "", comment: "" });
  const [newsletter, setNewsletter] = useState(false);
  const [policyRead, setPolicyRead] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);
  const [promo, setPromo] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);
  const courier = method === "cdek-courier";
  const products = items.flatMap(item => {
    const product = catalog.find(product => product.id === item.productId);
    return product ? [{ ...item, product }] : [];
  });
  const phone = shopConfig.phone.trim();
  const telegram = shopConfig.telegram.trim();

  useEffect(() => {
    if (submitMessage) resultRef.current?.focus();
  }, [submitMessage]);

  function resetAddress() {
    setPickupAddress("");
    setStreet("");
    setHouse("");
    setApartment("");
  }

  function changeCountry(next: Country) {
    setCountry(next);
    if (next === "BY" && method === "yandex-pickup") setMethod("cdek-pickup");
    setCity("");
    resetAddress();
    setSubmitMessage("");
  }

  function updateCustomer(field: keyof Customer, value: string) {
    setCustomer(current => ({ ...current, [field]: value }));
    setSubmitMessage("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || !count) return;
    // Fail closed until a real order/payment flow has been implemented and verified.
    setSubmitMessage(!shopConfig.checkoutEnabled
      ? "Проверка формы завершена. Это демоверсия. Заказ и платёж не созданы, введённые данные остались в этой вкладке."
      : "Сервис оформления сейчас недоступен. Заказ не отправлен. Свяжитесь с нами, чтобы уточнить возможность покупки.");
  }

  return <main id="main-content" className="checkout-page bounds">
    <nav className="checkout-breadcrumb" aria-label="Хлебные крошки"><a href="./index.html">Главная</a><span aria-hidden="true">/</span><span aria-current="page">Корзина</span></nav>
    <header className="checkout-heading"><h1>Корзина</h1><p><strong>Оформление в деморежиме.</strong> Вы можете проверить корзину и посмотреть варианты доставки. Для пробы используйте вымышленные контакты и адрес. Магазин пока не принимает заказы и оплату.</p></header>

    {!ready ? <p className="checkout-loading" role="status">Загружаем вашу корзину…</p> : !products.length ? (
      <section className="checkout-empty" aria-labelledby="checkout-empty-title">
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M15 23h34l3 32H12l3-32Z" strokeLinejoin="round" /><path d="M23 25V17a9 9 0 0 1 18 0v8" strokeLinecap="round" /></svg>
        <h2 id="checkout-empty-title">Здесь пока пусто</h2>
        <p>Загляните в коллекцию — там есть варежки и чехлы для прогулок с характером.</p>
        <a className="checkout-button checkout-button-primary" href="./index.html#collection">Выбрать свои «Причуды» <Arrow /></a>
      </section>
    ) : <>
      <section className="checkout-cart" aria-labelledby="checkout-items-title">
        <div className="checkout-cart-heading"><h2 id="checkout-items-title">Ваш заказ <span>{count}</span></h2><button type="button" className="checkout-text-button" onClick={clear}>Очистить корзину</button></div>
        <ul className="checkout-items">
          {products.map(({ product, quantity }) => <li className="checkout-item" key={product.id}>
            <a className={`checkout-item-photo ${product.kind}`} href="./index.html#collection" aria-label={`Посмотреть коллекцию: ${product.title}`}><img src={product.thumbnail} alt={product.color} width="120" height="120" /></a>
            <div className="checkout-item-copy"><p className="checkout-item-kind">{productKindLabels[product.kind]}</p><h3>{product.title}</h3><p className="checkout-item-color">{product.color}</p><p className="checkout-item-unit">{money(product.price)} / шт.</p></div>
            <div className="checkout-item-controls"><Quantity title={product.title} value={quantity} onChange={value => setQuantity(product.id, value)} /><button type="button" className="checkout-text-button checkout-remove" aria-label={`Удалить «${product.title}» из корзины`} onClick={() => remove(product.id)}>Удалить</button></div>
            <p className="checkout-item-total">{money(product.price * quantity)}</p>
          </li>)}
        </ul>
        <div className="checkout-cart-total" aria-live="polite"><span>Стоимость товаров</span><strong>{money(total)}</strong></div>
        <a className="checkout-continue" href="./index.html#collection">Продолжить покупки <Arrow /></a>
      </section>

      <form className="checkout-form" onSubmit={submit}>
        <fieldset className="checkout-section checkout-delivery">
          <legend><span aria-hidden="true">01</span> Доставка</legend>
          <div className="checkout-field">
            <label htmlFor="checkout-country">Страна доставки</label>
            <select id="checkout-country" name="country" autoComplete="country" value={country} onChange={event => changeCountry(event.currentTarget.value as Country)}><option value="RU">Россия</option><option value="BY">Беларусь</option></select>
          </div>

          <div className="checkout-method-label" id="checkout-method-label">Выберите способ доставки</div>
          <div className="checkout-methods" role="radiogroup" aria-labelledby="checkout-method-label">
            {deliveryMethods.filter(option => country === "RU" || option.id !== "yandex-pickup").map(option => <label className={`checkout-method${method === option.id ? " is-selected" : ""}`} key={option.id}>
              <input type="radio" name="deliveryMethod" value={option.id} checked={method === option.id} onChange={() => { setMethod(option.id); resetAddress(); setSubmitMessage(""); }} required />
              <span><strong>{option.title}</strong><span>{option.description}</span></span>
            </label>)}
          </div>

          <div className="checkout-field">
            <label htmlFor="checkout-city">Город доставки <span aria-hidden="true">*</span></label>
            <input id="checkout-city" name="city" autoComplete="address-level2" list="checkout-cities" value={city} onChange={event => { setCity(event.currentTarget.value); resetAddress(); setSubmitMessage(""); }} placeholder={country === "RU" ? "Например, Санкт-Петербург" : "Например, Минск"} required maxLength={120} pattern=".*\S.*" aria-describedby="checkout-city-hint" />
            <datalist id="checkout-cities">{cities[country].map(name => <option key={name} value={name} />)}</datalist>
            <p id="checkout-city-hint" className="checkout-hint">Можно выбрать подсказку или написать свой город.</p>
          </div>

          {courier ? <div className="checkout-address">
            <div className="checkout-field checkout-street"><label htmlFor="checkout-street">Улица <span aria-hidden="true">*</span></label><input id="checkout-street" name="street" autoComplete="address-line1" value={street} onChange={event => setStreet(event.currentTarget.value)} required maxLength={180} pattern=".*\S.*" /></div>
            <div className="checkout-field"><label htmlFor="checkout-house">Дом, корпус <span aria-hidden="true">*</span></label><input id="checkout-house" name="house" autoComplete="address-line2" value={house} onChange={event => setHouse(event.currentTarget.value)} required maxLength={60} pattern=".*\S.*" /></div>
            <div className="checkout-field"><label htmlFor="checkout-apartment">Квартира / офис</label><input id="checkout-apartment" name="apartment" autoComplete="address-line3" value={apartment} onChange={event => setApartment(event.currentTarget.value)} maxLength={60} /></div>
          </div> : <div className="checkout-field">
            <label htmlFor="checkout-pickup">Адрес пункта выдачи <span aria-hidden="true">*</span></label>
            <input id="checkout-pickup" name="pickupAddress" autoComplete="off" value={pickupAddress} onChange={event => setPickupAddress(event.currentTarget.value)} placeholder="Улица, дом и название пункта" required maxLength={240} pattern=".*\S.*" aria-describedby="checkout-pickup-hint" />
            <p id="checkout-pickup-hint" className="checkout-hint">Укажите точный адрес пункта {method === "yandex-pickup" ? "Яндекс Доставки или 5post" : "СДЭК"}. Доступность подтвердим до оплаты.</p>
          </div>}
          <p className="checkout-delivery-note">Стоимость и срок доставки уточняются до оплаты. <a href="./delivery.html">Подробнее о доставке</a></p>
        </fieldset>

        <fieldset className="checkout-section checkout-payment">
          <legend><span aria-hidden="true">02</span> Оплата</legend>
          <label className="checkout-method is-selected"><input type="radio" name="paymentMethod" value="robokassa" defaultChecked required /><span><strong>Робокасса</strong><span>Оплата на защищённой странице</span></span></label>
          <p className="checkout-hint">Онлайн-оплату готовим. Сейчас деньги на сайте не списываются.</p>
        </fieldset>

        <div className="checkout-promo">
          <button type="button" className="checkout-promo-toggle" aria-expanded={promoOpen} aria-controls="checkout-promo-panel" onClick={() => setPromoOpen(value => !value)}>Есть промокод? <span aria-hidden="true">{promoOpen ? "−" : "+"}</span></button>
          {promoOpen && <div id="checkout-promo-panel" className="checkout-promo-panel">
            <label htmlFor="checkout-promo">Промокод</label>
            <div className="checkout-promo-row"><input id="checkout-promo" name="promo" value={promo} onChange={event => { setPromo(event.currentTarget.value); setPromoMessage(""); }} autoComplete="off" maxLength={40} /><button type="button" onClick={() => setPromoMessage(promo.trim() ? "Проверка промокодов пока недоступна. Сумма заказа не изменена." : "Введите промокод.")}>Применить</button></div>
            <p className="checkout-hint" role="status">{promoMessage}</p>
          </div>}
        </div>

        <section className="checkout-summary" aria-labelledby="checkout-summary-title">
          <p className="checkout-eyebrow">Всё, что вы выбрали</p><h2 id="checkout-summary-title">Сумма заказа</h2>
          <dl><div><dt>Товары, {count} шт.</dt><dd>{money(total)}</dd></div><div><dt>Доставка</dt><dd>Уточним до оплаты</dd></div></dl>
          <div className="checkout-grand-total" aria-live="polite"><span>К оплате</span><strong>{money(total)} <small>+ доставка</small></strong></div>
          <p>Точную общую сумму подтвердим, когда согласуем доставку.</p>
        </section>

        <fieldset className="checkout-section checkout-customer">
          <legend><span aria-hidden="true">03</span> Ваши данные</legend>
          <div className="checkout-field"><label htmlFor="checkout-name">Имя <span aria-hidden="true">*</span></label><input id="checkout-name" name="name" autoComplete="name" value={customer.name} onChange={event => updateCustomer("name", event.currentTarget.value)} required maxLength={120} pattern=".*\S.*" /></div>
          <div className="checkout-field"><label htmlFor="checkout-email">Электронная почта <span aria-hidden="true">*</span></label><input id="checkout-email" name="email" type="email" autoComplete="email" inputMode="email" value={customer.email} onChange={event => updateCustomer("email", event.currentTarget.value)} required maxLength={254} placeholder="you@example.ru" /></div>
          <div className="checkout-field"><label htmlFor="checkout-phone">Телефон <span aria-hidden="true">*</span></label><input id="checkout-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" value={customer.phone}
            onChange={event => {
              const value = event.currentTarget.value;
              updateCustomer("phone", value);
              const digits = value.replace(/\D/g, "").length;
              const validCharacters = /^\+?[\d()\s-]*$/.test(value);
              event.currentTarget.setCustomValidity(value && !validCharacters
                ? "Используйте цифры, пробелы, скобки, дефис и знак + в начале номера."
                : value && (digits < 10 || digits > 15) ? "Укажите телефон: от 10 до 15 цифр с кодом страны." : "");
            }} required maxLength={32} placeholder={country === "RU" ? "+7" : "+375"} /></div>
          <div className="checkout-field"><label htmlFor="checkout-comment">Ваш комментарий <span className="checkout-optional">необязательно</span></label><textarea id="checkout-comment" name="comment" rows={4} value={customer.comment} onChange={event => updateCustomer("comment", event.currentTarget.value)} maxLength={2000} placeholder="Например, как удобнее с вами связаться" /></div>
        </fieldset>

        <div className="checkout-consents">
          <label className="checkout-checkbox"><input type="checkbox" name="newsletter" checked={newsletter} onChange={event => setNewsletter(event.currentTarget.checked)} /><span>Хочу получать новости и специальные предложения. <a href="./privacy.html#newsletter" target="_blank" rel="noopener noreferrer">В демоверсии подписка не оформляется</a>.</span></label>
          <label className="checkout-checkbox"><input type="checkbox" name="policyRead" checked={policyRead} onChange={event => { setPolicyRead(event.currentTarget.checked); setSubmitMessage(""); }} required /><span>Я прочитал(а) <a href="./privacy.html#consent" target="_blank" rel="noopener noreferrer">политику обработки персональных данных</a>. <span aria-hidden="true">*</span></span></label>
        </div>

        <div className="checkout-submit">
          <button className="checkout-button checkout-button-primary" type="submit" disabled={!ready || !count}>Проверить форму <Arrow /></button>
          {submitMessage && <div className="checkout-result" role="alert" tabIndex={-1} ref={resultRef}>
            <p>{submitMessage}</p>
            <div>{telegram && <a href={telegram} target="_blank" rel="noopener noreferrer">Написать в Telegram <Arrow /></a>}{phone && <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a>}</div>
          </div>}
        </div>
      </form>
    </>}
  </main>;
}
