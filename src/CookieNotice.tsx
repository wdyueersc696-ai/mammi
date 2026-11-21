import { useEffect, useState } from "react";

const key = "prichudy_notice_v2";
const lifetime = 180 * 24 * 60 * 60;

export default function CookieNotice({ hidden = false }: { hidden?: boolean }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let remembered = false;
    try { remembered = document.cookie.split(";").some(part => part.trim() === `${key}=read`); } catch {}
    try { remembered ||= Number(localStorage.getItem(key)) > Date.now(); } catch {}
    setVisible(!remembered);
  }, []);
  function dismiss() {
    setVisible(false);
    try { document.cookie = `${key}=read; Max-Age=${lifetime}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`; } catch {}
    try { localStorage.setItem(key, String(Date.now() + lifetime * 1000)); } catch {}
  }
  if (!visible || hidden) return null;
  return <aside className="cookie-note" aria-labelledby="cookie-title">
    <button type="button" className="cookie-close" aria-label="Закрыть уведомление о cookie" onClick={dismiss}>×</button>
    <h2 id="cookie-title">Сначала маленькая формальность</h2>
    <p>Сайт использует файлы cookie, чтобы помнить, что вы уже видели это окно. И ещё одну вещь он помнит за вас — какие варежки вы положили в корзину. Особенно удобно, если вы из тех, у кого открыто сорок вкладок.</p>
    <a href="./privacy.html">Подробнее об обработке данных</a>
    <button type="button" className="cookie-accept" onClick={dismiss}>У меня сорок одна</button>
  </aside>;
}
