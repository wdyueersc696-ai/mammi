
import {useState,useRef,useEffect} from "react";
import ShopDialogs from "./ShopDialogs";
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
 const menu=useRef<HTMLDialogElement>(null);
 useEffect(()=>{try{setNotice(localStorage.getItem("mammi_notice_v1")!=="read")}catch{setNotice(true)}},[]);
 function dismiss(){setNotice(false);try{localStorage.setItem("mammi_notice_v1","read")}catch{}}
 function see(k?:Kind){if(k)setKind(k);menu.current?.close();requestAnimationFrame(()=>document.getElementById("collection")?.scrollIntoView({block:"start"}))}
 function showPolicy(){menu.current?.close();dismiss();setModal("policy")}
 function open(item:Print){setPrint(item);dismiss();setModal("order")}
 const destinations=<><button onClick={()=>see("mittens")}>Варежки</button><button onClick={()=>see("cover")}>Чехлы на коляску</button><a href="#preorder" onClick={()=>menu.current?.close()}>Как заказать</a></>;
 return <><a href="#collection" className="skip">К коллекции</a>
 <header className="mast"><div className="bounds mast-inner"><a className="wordmark" href="#" aria-label="mammi, на главную">mammi</a><nav aria-label="Основное меню" className="desktop-links">{destinations}</nav><button className="mast-cta" onClick={()=>see()}>К коллекции <Arrow/></button><button className="menu-toggle" aria-label="Открыть меню" onClick={()=>menu.current?.showModal()}><svg width="27" height="27" viewBox="0 0 27 27" aria-hidden="true" stroke="currentColor" strokeWidth="2"><path d="M2 9h23M2 18h23"/></svg></button></div></header>
 <dialog ref={menu} className="mobilemenu" aria-label="Меню mammi" onClick={e=>{if(e.target===menu.current)menu.current?.close()}}><div><div className="menuheading"><strong className="wordmark">mammi</strong><button className="menuclose" aria-label="Закрыть меню" onClick={()=>menu.current?.close()}>×</button></div><nav>{destinations}<button onClick={showPolicy}>Политика конфиденциальности</button></nav></div></dialog>
 <main><div className="bounds"><div className="intro"><h1>Гулять тепло<span>.</span></h1><p>Варежки и чехлы на коляску<br/> в четырёх принтах. Предзаказ скоро.</p></div>
 <div className="duo">
 <article className="bill gloves"><div className="bill-text"><h2>Варежки</h2><button onClick={()=>see("mittens")}>Выбрать принт <Arrow/></button></div><img className="hero-item" src="./products/hero-mittens.webp" alt="Варежки «Туда / сюда» в розово-зелёную полоску" fetchPriority="high"/></article>
 <article className="bill covers"><div className="bill-text"><h2>Чехлы на<br/>коляску</h2><button onClick={()=>see("cover")}>Выбрать принт <Arrow/></button></div><img className="hero-item" src="./products/hero-cover.webp" alt="Зимний чехол в тон варежкам с прозрачным окном и молнией"/></article>
 </div>
 <section id="collection" aria-labelledby="collection-title"><div className="collection-head"><h2 id="collection-title">Коллекция</h2><div className="filters" aria-label="Вид изделия">{(["mittens","cover"] as Kind[]).map(k=><button key={k} aria-pressed={kind===k} onClick={()=>setKind(k)}>{kinds[k]}</button>)}</div></div><div className="products">{prints.map(item=><button key={item.id} className="product" onClick={()=>open(item.id)} aria-label={kinds[kind]+" «"+item.label+"», посмотреть форму"}><span className={"imagewell "+kind}><img loading="lazy" width={460} height={kind==="mittens"?460:614} src={"./products/"+kind+"-"+item.id+".webp"} srcSet={"./products/"+kind+"-"+item.id+"-460.webp 460w, ./products/"+kind+"-"+item.id+".webp 900w"} sizes="(max-width:620px) 47vw, 24vw" alt={item.color}/></span><span className="productline"><strong>{item.label}</strong><span className="round-arrow"><Arrow/></span></span><span className="detail">{kind==="mittens"?"Женские варежки · M":"Зимний чехол"}</span></button>)}</div></section>
 </div><section id="preorder"><div className="bounds how"><h2>Как заказать</h2><div><p>Предзаказ откроется, когда будут готовы цена и сроки первой партии. Пока можно выбрать вещь и принт и посмотреть, как будет выглядеть заявка.</p><p className="how-small">Изделия показаны в эскизах.</p><button className="cta" onClick={()=>see()}>К коллекции <Arrow/></button></div></div></section></main>
 <footer><div className="bounds foot"><a href="#" aria-label="mammi, наверх" className="wordmark">mammi</a><button onClick={showPolicy}>Политика конфиденциальности</button></div></footer>
 {notice&&!modal&&<aside className="notice" aria-label="О данных"><div><strong>Пару слов о данных</strong><button className="notice-x" onClick={dismiss} aria-label="Закрыть подсказку">×</button></div><p>Сейчас в форме указан пример почты. <button className="textlink" onClick={showPolicy}>Прочитать политику</button></p><button className="notice-ok" onClick={dismiss}>Всё схвачено</button></aside>}
 <ShopDialogs key={modal==="order"?kind+print:"policy"} modal={modal} onClose={()=>setModal(null)} kind={kind} print={print}/></>
}


