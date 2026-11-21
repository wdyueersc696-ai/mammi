import { shopConfig } from "./shop-config";

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
        <p className="delivery-eyebrow">Из Петербурга — к вашим прогулкам</p>
        <h1>Доставка и оплата</h1>
        <p className="delivery-lead">Выбирайте свои «Причуды», а здесь можно узнать, как получить заказ и оплатить покупку.</p>
      </header>

      <div className="delivery-photos">
        <figure>
          <img src="./lookbook/lines-final-20261122.webp" alt="Девушка на прогулке в Петербурге в голубых полосатых варежках «Хочу на ручки»" width="1122" height="1402" fetchPriority="high" />
          <figcaption>Для долгих прогулок и маленьких радостей</figcaption>
        </figure>
        <figure>
          <img src="./lookbook/polka-final-20261122.webp" alt="Девушка у Исаакиевского собора в бордовых варежках «Пу пупу» с розовым горошком" width="1122" height="1402" loading="lazy" />
          <figcaption>Из города, где умеют ценить тепло</figcaption>
        </figure>
      </div>

      <div className="delivery-content">
        <section className="delivery-shipping" aria-labelledby="delivery-shipping-title">
          <div className="delivery-section-heading">
            <p className="delivery-eyebrow">Как получить заказ</p>
            <h2 id="delivery-shipping-title">Доставка</h2>
            <p>Курьером до двери или в удобный пункт выдачи — выбирайте подходящий вариант при оформлении.</p>
          </div>

          <section className="delivery-region" aria-labelledby="delivery-russia-title">
            <span className="delivery-number" aria-hidden="true">01</span>
            <div>
              <h3 id="delivery-russia-title">По России</h3>
              <p>Отправляем заказы СДЭК: курьером или до пункта выдачи. Ещё один вариант — получить посылку в пункте выдачи Яндекс Маркета.</p>
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

        <section className="delivery-payment" aria-labelledby="delivery-payment-title">
          <p className="delivery-eyebrow">Спокойно и понятно</p>
          <h2 id="delivery-payment-title">Оплата</h2>
          <div className="delivery-payment-method">
            <span className="delivery-payment-symbol" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="7" width="24" height="18" rx="3" /><path d="M4 13h24M9 20h6" strokeLinecap="round" /></svg></span>
            <div><h3>Робокасса</h3><p>Онлайн-оплата заказа</p></div>
          </div>
          {shopConfig.checkoutEnabled ? (
            <>
              <p>После проверки заказа вы перейдёте на защищённую страницу Робокассы. Доступные способы оплаты будут показаны там.</p>
              <p>Перед оплатой проверьте состав заказа, стоимость доставки и контактные данные. Укажите действующую электронную почту для сообщений о покупке.</p>
            </>
          ) : (
            <>
              <p>Планируем принимать оплату через Робокассу. Онлайн-покупки откроются после подключения сервиса.</p>
              <p>Пока можно собрать корзину и выбрать доставку. Оплата на сайте ещё недоступна, деньги не списываются.</p>
            </>
          )}
          <a className="delivery-action delivery-action-primary" href="./cart.html">Перейти в корзину <Arrow /></a>
          <p className="delivery-payment-privacy">О том, как мы обращаемся с данными, — в <a href="./privacy.html">политике обработки персональных данных</a>.</p>
        </section>
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
        {shopConfig.seller && <p>Продавец: {shopConfig.seller}</p>}
      </div>
    </main>
  );
}
