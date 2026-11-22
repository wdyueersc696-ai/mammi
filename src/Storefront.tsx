
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
import { CartProvider, useCart } from "./CartState";
import CartDrawer from "./CartDrawer";
import CookieNotice from "./CookieNotice";
import CheckoutPage from "./CheckoutPage";
import DeliveryPage from "./DeliveryPage";
import ReturnsPage from "./ReturnsPage";
import PrivacyPage from "./PrivacyPage";
import { money, shopConfig } from "./shop-config";
export type StorePage = "home" | "cart" | "delivery" | "returns" | "privacy";
function Arrow(){return <svg aria-hidden="true" viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h17m-7-7 7 7-7 7"/></svg>}
function StoreLayout({page}:{page:StorePage}){
 const {count,add,cartHref}=useCart();
 const [cartOpen,setCartOpen]=useState(false);
 const [kind,setKind]=useState<ProductKind>("mittens");
 const [selectedProduct,setSelectedProduct]=useState<CatalogProduct|null>(null);
 const products=productsOfKind(kind);
 useEffect(()=>{if(new URLSearchParams(location.search).get("kind")==="cover")setKind("cover")},[]);
 function see(k?:ProductKind){
  if(page!=="home"){location.assign(`./index.html${k?`?kind=${k}`:""}#collection`);return;}
  if(k)setKind(k);requestAnimationFrame(()=>document.getElementById("collection")?.scrollIntoView({block:"start"}));
 }
 function addProduct(item:CatalogProduct){add(item.id);setSelectedProduct(null);setCartOpen(true)}
 return <><a href="#main-content" className="skip">К содержанию</a>
 <header className="mast"><div className="bounds mast-inner">
  <MenuDrawer onSelect={see} onPolicy={()=>location.assign("./privacy.html")} cartHref={cartHref} illustrationSrc="./illustrations/mammi-friends.png"/>
  <a className="wordmark" href="./index.html" aria-label="Причуды, на главную"><Wordmark/></a>
  <div className="mast-actions"><a className="mast-delivery" href="./delivery.html">Доставка и оплата</a><button className="mast-cart" type="button" aria-label={`Корзина, товаров: ${count}`} aria-controls="prichudy-cart" aria-expanded={cartOpen} data-cart-trigger onClick={()=>setCartOpen(true)}>
    <svg viewBox="0 0 28 30" width="27" height="29" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M5 9h18l2 18H3L5 9Z"/><path d="M9 10V7a5 5 0 0 1 10 0v3"/></svg>
    {count>0&&<span className="mast-cart-count" aria-hidden="true">{count}</span>}
  </button><span className="sr-only" role="status">В корзине: {count}</span></div>
 </div></header>

 {page==="home"?<main id="main-content"><div className="bounds">
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
 <section id="collection" aria-labelledby="collection-title"><div className="collection-head"><h2 id="collection-title">Коллекция</h2><div className="filters" aria-label="Вид изделия">{(["mittens","cover"] as ProductKind[]).map(k=><button key={k} aria-pressed={kind===k} onClick={()=>setKind(k)}>{productKindLabels[k]}</button>)}</div></div><div className="products">{products.map(item=><button key={item.id} className="product" onClick={()=>setSelectedProduct(item)} aria-label={productKindLabels[item.kind]+" «"+item.title+"», "+money(item.price)+", описание и состав"}><span className={"imagewell "+item.kind}><img loading="lazy" width={460} height={item.kind==="mittens"?460:614} src={item.image} srcSet={`${item.thumbnail} 460w, ${item.image} 900w`} sizes="(max-width:620px) 47vw, 24vw" alt={item.color}/></span><span className="productline"><strong>{item.title}</strong></span><span className="product-price">{money(item.price)}</span>{item.kind==="cover"&&<span className="detail">Зимний чехол</span>}</button>)}</div></section>
 </div><Lookbook items={lookbookItems}/><section id="preorder"><div className="bounds how"><div className="how-title"><h2>Как заказать</h2></div><div><p>Пока магазин готовится к открытию, можно выбрать принт, собрать корзину и посмотреть варианты доставки.</p><p className="how-small">Приём заказов и оплаты ещё не открыт. О коллекции можно спросить у нас в <a href={shopConfig.telegram} target="_blank" rel="noreferrer">Telegram</a>.</p><a className="cta" href="./delivery.html">Доставка и оплата <Arrow/></a></div><ScrollScene imageSrc="./illustrations/girl-winter-stroller-cutout.png"/></div></section></main>:page==="cart"?<CheckoutPage/>:page==="delivery"?<DeliveryPage/>:page==="returns"?<ReturnsPage/>:<PrivacyPage/>}
 <footer className="shop-footer"><div className="bounds shop-footer-grid">
   <div className="shop-footer-brand"><a href="./index.html" aria-label="Причуды, на главную" className="wordmark"><Wordmark illustrated={false}/></a><p>Нам хочется вас согреть.</p><small>© 2026 · {shopConfig.owner}</small></div>
   <nav aria-label="Информация"><a href="./delivery.html">Доставка и оплата</a><a href="./returns.html">Возврат и обмен</a><a href={cartHref}>Корзина</a><a href="./privacy.html">Политика обработки данных</a><a href="./privacy.html#newsletter">О новостях и рассылке</a></nav>
   <div className="shop-footer-contacts"><span>Будем на связи</span><a href={`mailto:${shopConfig.email}`}>{shopConfig.email}</a><a href="tel:+79676253241">{shopConfig.phone}</a><a href={shopConfig.telegram} target="_blank" rel="noopener noreferrer">Telegram · @infrastructureAi ↗</a></div>
 </div></footer>
 <CookieNotice hidden={!!selectedProduct||cartOpen}/>
 {selectedProduct&&<ShopDialogs key={selectedProduct.id} onClose={()=>setSelectedProduct(null)} onAdd={addProduct} product={selectedProduct}/>}
 <CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)}/></>
}

export default function Storefront({page="home"}:{page?:StorePage}){return <CartProvider><StoreLayout page={page}/></CartProvider>}
