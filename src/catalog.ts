export type ProductKind = "mittens" | "cover";

export type CatalogProduct = {
  id: string;
  kind: ProductKind;
  title: string;
  color: string;
  image: string;
  thumbnail: string;
  inscription: string | null;
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
): CatalogProduct {
  return { id, kind, title, color, inscription, price: kind === "mittens" ? 2850 : 4970, image: `./products/${file}.webp`, thumbnail: `./products/${file}-460.webp` };
}

export const catalog: CatalogProduct[] = [
  product("mittens-stripes", "mittens", "Туда сюда", "Розово-зелёная полоска", "mittens-stripes-v3", "туда / сюда"),
  product("mittens-blocks", "mittens", "Пятое десятое", "Красные и сиреневые блоки с тонким жёлтым кантом", "mittens-blocks-hem-v4", "пятое / десятое"),
  product("mittens-polka", "mittens", "Пу пупу", "Розовый горошек на бордовом", "mittens-polka-v3", "пу / пупу"),
  product("mittens-horses", "mittens", "Тоси Боси", "Красные кони на молочном", "mittens-horses-v3", "тоси / боси"),
  product("mittens-waves", "mittens", "Сикс севен", "Красная волна с молочным кантом на голубом", "mittens-waves-v3", "СИКС / СЕВЕН"),
  product("mittens-lines", "mittens", "Хочу на ручки", "Голубые и молочные полосы с тонкими красными линиями", "mittens-lines-v3", "ХОЧУ / НА РУЧКИ"),
  product("mittens-hearts", "mittens", "Сердечки", "Маленькие розовые сердечки на молочном", "mittens-hearts-v3"),
  product("cover-graphite", "cover", "Графитовый горох", "Светлый горошек на графитовом", "cover-graphite-v3"),
  product("cover-espresso", "cover", "Шоколадная полоска", "Шоколадные и кофейные полосы с тонкими розовыми линиями", "cover-espresso-v3"),
  product("cover-geese", "cover", "Гуси", "Молочные гуси на глубоком бирюзовом", "cover-geese-v3"),
  product("cover-hearts", "cover", "Сердечки", "Маленькие розовые сердечки на молочном", "cover-hearts-v3"),
  product("cover-polka", "cover", "Бордовый горох", "Мелкий розовый горошек на бордовом", "cover-polka-v3"),
];

export function productsOfKind(kind: ProductKind) {
  return catalog.filter(item => item.kind === kind);
}
