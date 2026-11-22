import { catalog } from "./catalog";
import type { LookbookItem } from "./Lookbook";

const styles: Record<string, string> = {
  stripes: "Пальто и трикотаж",
  rose: "Сливовый пуховик и розовая шапка",
  polka: "Дублёнка и шерсть",
  horses: "Светлая шуба и деним",
  waves: "Спортивный городской",
  lines: "Светлый пуховик",
  coffee: "Оливковая парка и молочный шарф",
};

const photos: Record<string, string> = {
  stripes: "stripes-final-20261122.webp",
  rose: "rose.webp",
  polka: "polka-final-20261122.webp",
  horses: "horses-final-20261122.webp",
  waves: "waves-final-20261122.webp",
  lines: "lines-final-20261122.webp",
  coffee: "coffee.webp",
};

export const lookbookItems: LookbookItem[] = catalog
  .filter(item => item.kind === "mittens")
  .map(item => {
    const print = item.id.replace("mittens-", "");
    return {
      id: item.id,
      title: item.title,
      style: styles[print],
      image: `./lookbook/${photos[print]}`,
    };
  });
