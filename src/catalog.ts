export type ProductKind = "mittens" | "cover";

export type CatalogProduct = {
  id: string;
  kind: ProductKind;
  title: string;
  color: string;
  image: string;
  thumbnail: string;
  inscription: string | null;
  description?: string;
  price: number;
};

export const productKindLabels: Record<ProductKind, string> = {
  mittens: "Варежки",
  cover: "Чехлы на коляску",
};

function product(
  id: string,
  kind: ProductKind,
  title: string,
  color: string,
  file: string,
  inscription: string | null = null,
  description?: string,
): CatalogProduct {
  return { id, kind, title, color, inscription, description, price: kind === "mittens" ? 2850 : 4970, image: `./products/${file}.webp`, thumbnail: `./products/${file}-460.webp` };
}

export const catalog: CatalogProduct[] = [
  product("mittens-stripes", "mittens", "Туда сюда", "Розово-зелёная полоска", "mittens-stripes-v3", "туда / сюда"),
  product(
    "mittens-rose", "mittens", "Сама в ахуе", "Пудрово-розовые варежки с красными манжетами", "mittens-rose", "сама / в ахуе",
    "На левой варежке — «сама», на правой — «в ахуе». Буквы бордовым курсивом на пудрово-розовом фоне. У запястья ткань собрана на резинке, а по нижнему краю красных манжет проходит строчка в тон.",
  ),
  product("mittens-polka", "mittens", "Пу пупу", "Розовый горошек на бордовом", "mittens-polka-v3", "пу / пупу"),
  product("mittens-horses", "mittens", "Тоси Боси", "Красные кони на молочном", "mittens-horses-v3", "тоси / боси"),
  product("mittens-waves", "mittens", "Сикс севен", "Красная волна с молочным кантом на голубом", "mittens-waves-v3", "СИКС / СЕВЕН"),
  product("mittens-lines", "mittens", "Хочу на ручки", "Голубые и молочные полосы с тонкими красными линиями", "mittens-lines-v3", "ХОЧУ / НА РУЧКИ"),
  product(
    "mittens-coffee", "mittens", "Слабоумие и отвага", "Кофе с молоком и шоколадные манжеты в тонкую полоску", "mittens-coffee", "слабоумие / и отвага",
    "Сложите руки рядом, чтобы прочитать «слабоумие» на левой и «и отвага» на правой. Буквы цвета эспрессо на ткани оттенка кофе с молоком. На шоколадных манжетах тонкая вертикальная полоска и строчка по нижнему краю.",
  ),
  product("cover-graphite", "cover", "Графитовый горох", "Светлый горошек на графитовом", "cover-graphite-v3"),
  product("cover-espresso", "cover", "Шоколадная полоска", "Шоколадные и кофейные полосы с тонкими розовыми линиями", "cover-espresso-v3"),
  product("cover-geese", "cover", "Гуси", "Молочные гуси на глубоком бирюзовом", "cover-geese-v3"),
  product("cover-hearts", "cover", "Сердечки", "Маленькие розовые сердечки на молочном", "cover-hearts-v3"),
  product("cover-polka", "cover", "Бордовый горох", "Мелкий розовый горошек на бордовом", "cover-polka-v3"),
];

export function productsOfKind(kind: ProductKind) {
  return catalog.filter(item => item.kind === kind);
}
