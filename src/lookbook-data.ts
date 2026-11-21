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
  stripes: "stripes.webp",
  blocks: "blocks-v4.webp",
  polka: "polka-v2.webp",
  horses: "horses-v2.webp",
  waves: "waves.webp",
  lines: "lines.webp",
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
