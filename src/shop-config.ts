// Public storefront configuration. Payment credentials must never be stored here.
export const shopConfig = {
  owner: "Крицких Иван Алексеевич",
  email: "ikritskikh@mail.ru",
  phone: "+7 967 625-32-41",
  telegram: "https://t.me/infrastructureAi",
  checkoutEnabled: false,
  // A real order endpoint must validate prices, delivery and payment on the server.
  checkoutEndpoint: "",
};

export const money = (amount: number) => new Intl.NumberFormat("ru-RU", {
  style: "currency", currency: "RUB", maximumFractionDigits: 0,
}).format(amount);
