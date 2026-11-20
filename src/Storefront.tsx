
import {useState,useEffect} from "react";
import ShopDialogs from "./ShopDialogs";
import MenuDrawer from "./MenuDrawer";
import Wordmark from "./Wordmark";
import ScrollScene from "./ScrollScene";
import Snowfall from "./Snowfall";
type Kind="mittens"|"cover";
type Print="stripes"|"dots"|"geese"|"horses";
const prints:{id:Print;label:string;color:string}[]=[
 {id:"stripes",label:"Туда / сюда",color:"Зелёный и розовый"},
 {id:"dots",label:"Ой / всё",color:"Баклажан и жёлтый"},
 {id:"geese",label:"Ни пуха / ни пера",color:"Белые гуси на голубом"},
 {id:"horses",label:"Конь / огонь",color:"Красные кони на голубом"}
];
const kinds:Record<Kind,string>={mittens:"Варежки",cover:"Чехлы на коляску"};
function Arrow(){return <svg aria-hidden="true" viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h17m-7-7 7 7-7 7"/></svg>}
export default function Home(){
 const [kind,setKind]=useState<Kind>("mittens"), [print,setPrint]=useState<Print>("stripes");
 const [modal,setModal]=useState<"order"|"policy"|null>(null);
 const [notice,setNotice]=useState(false);
 useEffect(()=>{try{setNotice(localStorage.getItem("mammi_notice_v1")!=="read")}catch{setNotice(true)}},[]);
 function dismiss(){setNotice(false);try{localStorage.setItem("mammi_notice_v1","read")}catch{}}
 function see(k?:Kind){if(k)setKind(k);requestAnimationFrame(()=>document.getElementById("collection")?.scrollIntoView({block:"start"}))}
 function showPolicy(){dismiss();setModal("policy")}
 function open(item:Print){setPrint(item);dismiss();setModal("order")}
 return <><a href="#collection" className="skip">К коллекции</a>
 <header className="mast"><div className="bounds mast-inner">
  <MenuDrawer onSelect={see} onPolicy={showPolicy} illustrationSrc="./illustrations/mammi-friends.png"/>
  <a className="wordmark" href="#" aria-label="Причуды, на главную"><Wordmark/></a>
  <button className="mast-cta" onClick={()=>see()}>Каталог <Arrow/></button>
 </div></header>

 <main><div className="bounds"><div className="intro"><h1>Нам хочется вас согреть.</h1><p>Мы придумали Причуды с простой мыслью: пусть зимой будет приятно гулять и малышу, и тому, кто везёт коляску.</p></div>
 <div className="duo">
 <article className="bill gloves"><div className="bill-text"><h2>Варежки</h2><button onClick={()=>see("mittens")}>Выбрать принт <Arrow/></button></div><img className="hero-item" src="./products/hero-mittens.webp" alt="Варежки «Туда / сюда» в розово-зелёную полоску" fetchPriority="high"/><Snowfall/></article>
 <article className="bill covers"><div className="bill-text"><h2>Чехлы на<br/>коляску</h2><button onClick={()=>see("cover")}>Выбрать принт <Arrow/></button></div><img className="hero-item" src="./products/hero-cover.webp" alt="Зимний чехол в тон варежкам с прозрачным окном и молнией"/><Snowfall offset={11}/></article>
 </div>
 <section id="collection" aria-labelledby="collection-title"><div className="collection-head"><h2 id="collection-title">Коллекция</h2><div className="filters" aria-label="Вид изделия">{(["mittens","cover"] as Kind[]).map(k=><button key={k} aria-pressed={kind===k} onClick={()=>setKind(k)}>{kinds[k]}</button>)}</div></div><div className="products">{prints.map(item=><button key={item.id} className="product" onClick={()=>open(item.id)} aria-label={kinds[kind]+" «"+item.label+"», описание и состав"}><span className={"imagewell "+kind}><img loading="lazy" width={460} height={kind==="mittens"?460:614} src={"./products/"+kind+"-"+item.id+".webp"} srcSet={"./products/"+kind+"-"+item.id+"-460.webp 460w, ./products/"+kind+"-"+item.id+".webp 900w"} sizes="(max-width:620px) 47vw, 24vw" alt={item.color}/></span><span className="productline"><strong>{item.label}</strong><span className="round-arrow"><Arrow/></span></span>{kind==="cover"&&<span className="detail">Зимний чехол</span>}</button>)}</div></section>
 </div><section id="preorder"><div className="bounds how"><div className="how-title"><h2>Как заказать</h2></div><div><p>Предзаказ откроется, когда будут готовы цена и сроки первой партии. Пока можно выбрать вещь и принт и посмотреть, как будет выглядеть заявка.</p><p className="how-small">Изделия показаны в эскизах.</p><button className="cta" onClick={()=>see()}>К коллекции <Arrow/></button></div><ScrollScene imageSrc="./illustrations/girl-winter-stroller-cutout.png"/></div></section></main>
 <footer><div className="bounds foot"><a href="#" aria-label="Причуды, наверх" className="wordmark"><Wordmark/></a><button onClick={showPolicy}>Политика конфиденциальности</button></div></footer>
 {notice&&!modal&&<aside className="notice" aria-label="О данных"><div><strong>Пару слов о данных</strong><button className="notice-x" onClick={dismiss} aria-label="Закрыть подсказку">×</button></div><p>Сейчас в форме указан пример почты. <button className="textlink" onClick={showPolicy}>Прочитать политику</button></p><button className="notice-ok" onClick={dismiss}>Всё схвачено</button></aside>}
 <ShopDialogs key={modal==="order"?kind+print:"policy"} modal={modal} onClose={()=>setModal(null)} kind={kind} print={print}/></>
}
