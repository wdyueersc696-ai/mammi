import { useId } from "react";

type ProductFactsProps = {
  confirmed?: boolean;
};

const measurements = [
  { mark: "А", name: "Полная длина", value: "28 см" },
  { mark: "Б", name: "Ширина варежки", value: "13 см" },
  { mark: "В", name: "От кончика до резинки", value: "20 см" },
  { mark: "Г", name: "Длина манжеты", value: "8 см" },
];

function MittenDiagram() {
  return (
    <svg className="product-facts__diagram" viewBox="0 0 280 334" aria-hidden="true" focusable="false">
      <path className="product-facts__shell" d="M81 219C85 184 78 140 81 88C83 56 102 39 131 39C164 39 183 59 185 90L186 169L201 145C208 134 220 135 226 145C231 155 224 173 218 184L181 225L194 301Q137 314 69 301Z" />
      <path className="product-facts__seam" d="M82 218Q130 230 181 223M72 290Q134 304 190 291" />
      <path className="product-facts__gathers" d="M92 211L96 226M108 214L110 230M126 216L126 231M143 216L141 232M160 215L157 230M175 215L171 228" />
      <g className="product-facts__guides">
        <path d="M43 40V302M37 40H49M37 302H49M81 20H185M81 14V26M185 14V26M249 40V219M243 40H255M243 219H255M249 233V302M243 233H255M243 302H255" />
      </g>
      <g className="product-facts__marks">
        <g transform="translate(43 170)"><circle r="13" /><text y="4.5">А</text></g>
        <g transform="translate(133 20)"><circle r="13" /><text y="4.5">Б</text></g>
        <g transform="translate(249 126)"><circle r="13" /><text y="4.5">В</text></g>
        <g transform="translate(249 268)"><circle r="13" /><text y="4.5">Г</text></g>
      </g>
    </svg>
  );
}

export default function ProductFacts({ confirmed = true }: ProductFactsProps) {
  const id = useId();
  const layers = [
    { key: "shell", label: "Снаружи", name: "Плащёвая ткань", detail: "Верх с нашим принтом" },
    { key: "insulation", label: "Между слоями", name: confirmed ? "Слайтекс" : "Синтетический утеплитель", detail: "Отдельный слой утепления" },
    { key: "lining", label: "Внутри", name: "Флис", detail: "Мягкая подкладка" },
  ];

  return (
    <section className="product-facts" aria-labelledby={`${id}-title`}>
      <h3 className="product-facts__title" id={`${id}-title`}>Размер и материалы</h3>
      <section className="product-facts__measurements" aria-labelledby={`${id}-size`}>
        <h4 id={`${id}-size`}>{confirmed ? "Размеры варежки" : "Размеры уточняем на образце"}</h4>
        {!confirmed && <p className="product-facts__intro">После примерки добавим четыре мерки, чтобы вам было проще выбрать.</p>}
        <div className="product-facts__size-layout">
          <figure className="product-facts__figure">
            <MittenDiagram />
            <figcaption>Схема без масштаба</figcaption>
          </figure>
          <dl className="product-facts__sizes">
            {measurements.map(({ mark, name, value }) => (
              <div key={mark}>
                <dt><span className="product-facts__letter" aria-hidden="true">{mark}</span>{name}</dt>
                <dd className={confirmed ? undefined : "product-facts__pending"}>{confirmed ? value : "Уточняем на образце"}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className="product-facts__materials" aria-labelledby={`${id}-layers`}>
        <h4 id={`${id}-layers`}>{confirmed ? "Три слоя" : "Планируемые материалы"}</h4>
        <ol className="product-facts__layers">
          {layers.map(({ key, label, name, detail }) => (
            <li key={key}>
              <span className={`product-facts__swatch product-facts__swatch--${key}`} aria-hidden="true" />
              <div><span className="product-facts__layer-label">{label}</span><strong>{name}</strong><p>{detail}</p></div>
            </li>
          ))}
        </ol>
        <p className="product-facts__note">{confirmed
          ? "Точный состав в процентах и рекомендации по уходу добавим отдельно."
          : "Окончательный состав и рекомендации по уходу укажем после утверждения образца."}</p>
      </section>
    </section>
  );
}
