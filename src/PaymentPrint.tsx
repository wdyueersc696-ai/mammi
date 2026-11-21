import { useCart } from "./CartState";
import { shopConfig } from "./shop-config";
import Wordmark from "./Wordmark";

export default function PaymentPrint() {
  const { cartHref } = useCart();
  const marks = "./illustrations/prichudy/payments/";

  return (
    <section className="payment-print" aria-labelledby="delivery-payment-title">
      <div className="payment-print-heading">
        <h2 id="delivery-payment-title">Оплата</h2>
        <span className="payment-print-sign" role="img" aria-label="Причуды store">
          <Wordmark illustrated={false} />
          <i lang="en">store</i>
        </span>
      </div>
      <img
        className="payment-print-scene"
        src="./illustrations/prichudy/friends-payment.webp"
        width="920" height="614" loading="lazy" decoding="async"
        alt="Одна подруга протягивает бордовую карту, другая держит жёлтый терминал."
      />
      <div className="payment-print-paper">
        <div className="payment-print-methods">
          <div>
            <h3>Целиком</h3>
            <ul className="payment-print-full">
              <li className="payment-print-card"><span aria-hidden="true" />Картой</li>
              <li><img src={marks + "yandex-pay.svg"} width="70" height="29" alt="Яндекс Пэй" /></li>
              <li><img src={marks + "t-pay.svg"} width="70" height="29" alt="T-Pay от Т-Банка" /></li>
            </ul>
          </div>
          <div className="payment-print-installments">
            <h3>По частям</h3>
            <img src={marks + "yandex-split.svg"} alt="Яндекс Сплит" width="140" height="60" />
          </div>
        </div>
        <p className="payment-print-status">
          {shopConfig.checkoutEnabled
            ? "Способы оплаты для вашего заказа покажет Робокасса."
            : "Онлайн-оплату готовим к запуску. После подключения Робокасса покажет доступные способы для вашего заказа."}
        </p>
        <a className="payment-print-link" href={cartHref}>Перейти в корзину <span aria-hidden="true">→</span></a>
      </div>
    </section>
  );
}
