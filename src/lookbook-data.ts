import { catalog } from "./catalog";
import type { LookbookItem } from "./Lookbook";

const places: Record<string, string> = {
  stripes: "Дом Зингера",
  blocks: "Новая Голландия",
  polka: "Исаакиевская площадь",
  horses: "Каток Новой Голландии",
  waves: "Дворцовая площадь",
  lines: "Канал Грибоедова",
  hearts: "Таврический сад",
};

const styles: Record<string, string> = {
  stripes: "Пальто и трикотаж",
  blocks: "Сливовый пуховик и деним",
  polka: "Дублёнка и шерсть",
  horses: "Светлая шуба и деним",
  waves: "Спортивный городской",
  lines: "Светлый пуховик",
  hearts: "Парка на каждый день",
};

const photos: Record<string, string> = {
  stripes: "stripes-final-20261122.webp",
  blocks: "blocks-final-20261122.webp",
  polka: "polka-final-20261122.webp",
  horses: "horses-final-20261122.webp",
  waves: "waves-final-20261122.webp",
  lines: "lines-final-20261122.webp",
  hearts: "hearts.webp",
};

export const lookbookItems: LookbookItem[] = catalog
  .filter(item => item.kind === "mittens")
  .map(item => {
    const print = item.id.replace("mittens-", "");
    return {
      id: item.id,
      title: item.title,
      location: places[print],
      style: styles[print],
      image: `./lookbook/${photos[print]}`,
    };
  });
