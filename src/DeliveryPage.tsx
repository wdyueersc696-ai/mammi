import { shopConfig } from "./shop-config";
import PaymentPrint from "./PaymentPrint";

function Arrow() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function DeliveryPage() {
  const phone = shopConfig.phone.trim();
  const telegram = shopConfig.telegram.trim();
  const hasContacts = Boolean(phone || telegram);

  return (
    <main id="main-content" className="delivery-page bounds">
      <nav className="delivery-breadcrumb" aria-label="Хлебные крошки">
        <a href="./index.html">Главная</a><span aria-hidden="true">/</span><span aria-current="page">Доставка и оплата</span>
      </nav>

      <header className="delivery-heading">
        <div className="delivery-postcard-copy">
          <h1>Доставка<br /> и оплата</h1>
          <p className="delivery-lead">Готовим доставку из Петербурга по России и в Беларусь. Здесь можно посмотреть варианты получения к открытию магазина.</p>
          <nav className="delivery-jumps" aria-label="На этой странице">
            <a href="#delivery-shipping">О доставке ↓</a>
            <a href="#delivery-payment">Об оплате ↓</a>
            <a href="./returns.html">Возврат и обмен →</a>
          </nav>
        </div>
        <img className="delivery-postcard-art" src="./illustrations/prichudy/friends-delivery.webp" width="1440" height="960"
          alt="Две героини везут на санках по Петербургу коробку с варежками. На бирке — «Причуды store»." fetchPriority="high" />
      </header>

      <div className="delivery-content">
        <section id="delivery-shipping" className="delivery-shipping" aria-labelledby="delivery-shipping-title">
          <div className="delivery-section-heading">
            <h2 id="delivery-shipping-title">Доставка</h2>
            <p>Курьером до двери или в удобный пункт выдачи — выбирайте подходящий вариант при оформлении.</p>
          </div>

          <section className="delivery-region" aria-labelledby="delivery-russia-title">
            <span className="delivery-number" aria-hidden="true">01</span>
            <div>
              <h3 id="delivery-russia-title">По России</h3>
              <p>Планируем доставку СДЭК курьером или до пункта выдачи. Ещё один вариант — получить посылку в пункте выдачи Яндекс Маркета.</p>
              <p>При оформлении укажите город и выберите способ получения. Стоимость и срок зависят от адреса, службы доставки и размера посылки. Их согласуем до оплаты заказа.</p>
              <p className="delivery-small">Если нужного города или пункта выдачи нет в списке, свяжитесь с нами — поможем подобрать доставку.</p>
            </div>
          </section>

          <section className="delivery-region" aria-labelledby="delivery-petersburg-title">
            <span className="delivery-number" aria-hidden="true">02</span>
            <div>
              <h3 id="delivery-petersburg-title">По Санкт-Петербургу</h3>
              <p>Если хочется получить «Причуды» побыстрее, для товаров в наличии можно согласовать экспресс-доставку через Яндекс Такси.</p>
              <p>Сначала подтвердим, что заказ готов, и договоримся о времени передачи. После этого вы сможете вызвать доставку самостоятельно. Пожалуйста, дождитесь нашего подтверждения перед вызовом курьера.</p>
              <p className="delivery-small">Стоимость рассчитывается по тарифу сервиса и зависит от адреса, времени суток и спроса. Она оплачивается отдельно.</p>
            </div>
          </section>

          <section className="delivery-region" aria-labelledby="delivery-belarus-title">
            <span className="delivery-number" aria-hidden="true">03</span>
            <div>
              <h3 id="delivery-belarus-title">В Беларусь</h3>
              <p>Доставка СДЭК — курьером или до пункта выдачи. Укажите Беларусь и город получения при оформлении заказа.</p>
              <p>Если с выбором города или оформлением возникнут сложности, напишите нам. Проверим доступные варианты и согласуем стоимость и срок доставки.</p>
            </div>
          </section>
        </section>

        <div id="delivery-payment"><PaymentPrint /></div>
      </div>

      {hasContacts && (
        <section className="delivery-help" aria-labelledby="delivery-help-title">
          <div>
            <p className="delivery-eyebrow">Остались вопросы?</p>
            <h2 id="delivery-help-title">Мы на связи</h2>
            <p>Поможем с выбором доставки, городом или оформлением заказа. Расскажите, куда нужно отправить ваши «Причуды».</p>
          </div>
          <div className="delivery-contact-links">
            {phone && <a className="delivery-contact" href={`tel:${phone.replace(/[^+\d]/g, "")}`}><span>Позвонить</span><strong>{phone}</strong><Arrow /></a>}
            {telegram && <a className="delivery-contact" href={telegram} target="_blank" rel="noopener noreferrer"><span>Новости и связь</span><strong>Наш Telegram</strong><Arrow /></a>}
          </div>
        </section>
      )}

      <div className="delivery-bottom">
        <a className="delivery-action delivery-action-secondary" href="./index.html#collection">Выбрать свои «Причуды» <Arrow /></a>
        <p>По вопросам работы витрины — {shopConfig.owner}.</p>
      </div>
    </main>
  );
}
