
import {useState,useEffect} from "react";
import ShopDialogs from "./ShopDialogs";
import MenuDrawer from "./MenuDrawer";
import Wordmark from "./Wordmark";
import ScrollScene from "./ScrollScene";
import Snowfall from "./Snowfall";
import Lookbook from "./Lookbook";
import { lookbookItems } from "./lookbook-data";
import { catalog, productKindLabels, productsOfKind } from "./catalog";
import type { CatalogProduct, ProductKind } from "./catalog";
function Arrow(){return <svg aria-hidden="true" viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h17m-7-7 7 7-7 7"/></svg>}
export default function Home(){
 const [kind,setKind]=useState<ProductKind>("mittens");
 const [selectedProduct,setSelectedProduct]=useState<CatalogProduct>(catalog[0]);
 const products=productsOfKind(kind);
 const [modal,setModal]=useState<"order"|"policy"|null>(null);
 const [notice,setNotice]=useState(false);
 useEffect(()=>{try{setNotice(localStorage.getItem("mammi_notice_v1")!=="read")}catch{setNotice(true)}},[]);
 function dismiss(){setNotice(false);try{localStorage.setItem("mammi_notice_v1","read")}catch{}}
 function see(k?:ProductKind){if(k)setKind(k);requestAnimationFrame(()=>document.getElementById("collection")?.scrollIntoView({block:"start"}))}
 function showPolicy(){dismiss();setModal("policy")}
 function open(item:CatalogProduct){setSelectedProduct(item);dismiss();setModal("order")}
 return <><a href="#collection" className="skip">К коллекции</a>
 <header className="mast"><div className="bounds mast-inner">
  <MenuDrawer onSelect={see} onPolicy={showPolicy} illustrationSrc="./illustrations/mammi-friends.png"/>
  <a className="wordmark" href="#" aria-label="Причуды, на главную"><Wordmark/></a>
  <button className="mast-cta" onClick={()=>see()}>Каталог <Arrow/></button>
 </div></header>

 <main><div className="bounds">
 <div className="intro">
  <h1>Нам хочется вас согреть</h1>
  <div className="intro-copy">
   <p>Мы придумали «Причуды», чтобы даже в холодные дни хотелось выйти погулять. Наши варежки согревают руки, а необычные принты и забавные надписи помогают выразить себя — выбирайте те, что вам по настроению.</p>
   <p>А для прогулок с малышом у нас есть тёплые ветрозащитные чехлы на коляску. С яркими рисунками, чтобы и у маленького попутчика были свои «Причуды».</p>
  </div>
 </div>
 <div className="duo">
 <article className="bill gloves"><div className="bill-text"><h2>Варежки</h2><button onClick={()=>see("mittens")}>Выбрать принт</button></div><img className="hero-item" src="./products/hero-mittens-v3.webp" alt="Варежки «Туда сюда» в розово-зелёную полоску" fetchPriority="high"/><Snowfall/></article>
 <article className="bill covers"><div className="bill-text"><h2>Чехлы на<br/>коляску</h2><button onClick={()=>see("cover")}>Выбрать принт</button></div><img className="hero-item" src="./products/hero-cover-v3.webp" alt="Зимний чехол «Шоколадная полоска» с прозрачным окном и молнией"/><Snowfall offset={11}/></article>
 </div>
 <section id="collection" aria-labelledby="collection-title"><div className="collection-head"><h2 id="collection-title">Коллекция</h2><div className="filters" aria-label="Вид изделия">{(["mittens","cover"] as ProductKind[]).map(k=><button key={k} aria-pressed={kind===k} onClick={()=>setKind(k)}>{productKindLabels[k]}</button>)}</div></div><div className="products">{products.map(item=><button key={item.id} className="product" onClick={()=>open(item)} aria-label={productKindLabels[item.kind]+" «"+item.title+"», описание и состав"}><span className={"imagewell "+item.kind}><img loading="lazy" width={460} height={item.kind==="mittens"?460:614} src={item.image} srcSet={`${item.thumbnail} 460w, ${item.image} 900w`} sizes="(max-width:620px) 47vw, 24vw" alt={item.color}/></span><span className="productline"><strong>{item.title}</strong></span>{item.kind==="cover"&&<span className="detail">Зимний чехол</span>}</button>)}</div></section>
 </div><Lookbook items={lookbookItems}/><section id="preorder"><div className="bounds how"><div className="how-title"><h2>Как заказать</h2></div><div><p>Предзаказ откроется, когда будут готовы цена и сроки первой партии. Пока можно выбрать вещь и принт и посмотреть, как будет выглядеть заявка.</p><p className="how-small">Изделия показаны в эскизах.</p><button className="cta" onClick={()=>see()}>К коллекции <Arrow/></button></div><ScrollScene imageSrc="./illustrations/girl-winter-stroller-cutout.png"/></div></section></main>
 <footer><div className="bounds foot"><a href="#" aria-label="Причуды, наверх" className="wordmark"><Wordmark/></a><button onClick={showPolicy}>Политика конфиденциальности</button></div></footer>
 {notice&&!modal&&<aside className="notice" aria-label="О данных"><div><strong>Пару слов о данных</strong><button className="notice-x" onClick={dismiss} aria-label="Закрыть подсказку">×</button></div><p>Сейчас в форме указан пример почты. <button className="textlink" onClick={showPolicy}>Прочитать политику</button></p><button className="notice-ok" onClick={dismiss}>Всё схвачено</button></aside>}
 <ShopDialogs key={modal==="order"?selectedProduct.id:"policy"} modal={modal} onClose={()=>setModal(null)} product={selectedProduct}/></>
}
