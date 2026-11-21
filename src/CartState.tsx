import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { catalog } from "./catalog";
import { CART_STORAGE_KEY, cartHref as makeCartHref, cartTotals, parseCart, parseCartHash, parseCartHistory, serializeCart, syncCartFromStorage, updateCart, withCartHistory, withoutCartHash } from "./cart-model";
import type { CartAction, CartItem } from "./cart-model";

export { CART_STORAGE_KEY } from "./cart-model";
export type { CartItem } from "./cart-model";

export type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  ready: boolean;
  cartHref: string;
  persistenceAvailable: boolean;
  add: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const productIds = new Set(catalog.map(product => product.id));
const productPrices = new Map(catalog.map(product => [product.id, product.price]));
const CartContext = createContext<CartContextValue | null>(null);

function rememberCart(items: CartItem[], persisted: boolean, cleanUrl?: string) {
  try {
    const previous = window.history.state;
    const next = withCartHistory(previous, persisted ? null : items);
    if (next !== previous || cleanUrl !== undefined) {
      if (cleanUrl === undefined) window.history.replaceState(next, "");
      else window.history.replaceState(next, "", cleanUrl);
    }
  } catch { /* Keep any transfer hash intact if saving the history entry fails. */ }
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Storage is read after hydration: the server and the first client render match.
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [persistenceAvailable, setPersistenceAvailable] = useState(true);
  const itemsRef = useRef<CartItem[]>([]);
  const readyRef = useRef(false);
  const pending = useRef<CartAction[]>([]);

  useEffect(() => {
    if (!readyRef.current) {
      let restored: CartItem[] = [];
      let persisted = false;
      try {
        restored = parseCart(window.localStorage.getItem(CART_STORAGE_KEY), productIds);
        persisted = true;
      } catch { /* A transfer URL can restore a cart even with storage blocked. */ }
      const transferred = parseCartHash(window.location.hash, productIds);
      let remembered: CartItem[] | null = null;
      try { remembered = parseCartHistory(window.history.state, productIds); } catch {}
      const fallback = transferred ?? remembered;
      if (fallback !== null) restored = fallback;
      const hasPending = pending.current.length > 0;
      for (const action of pending.current) restored = updateCart(restored, action, productIds);
      pending.current = [];
      if (fallback !== null || hasPending) {
        try { window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(restored)); persisted = true; }
        catch { persisted = false; }
      }
      const cleanHash = withoutCartHash(window.location.hash);
      // Store the fallback and remove its URL fragment atomically, so reload keeps it.
      rememberCart(restored, persisted, cleanHash !== window.location.hash
        ? `${window.location.pathname}${window.location.search}${cleanHash}` : undefined);
      itemsRef.current = restored;
      readyRef.current = true;
      setItems(restored);
      setPersistenceAvailable(persisted);
      setReady(true);
    }
    function onStorage(event: StorageEvent) {
      if (event.key !== CART_STORAGE_KEY && event.key !== null) return;
      try {
        if (event.storageArea && event.storageArea !== window.localStorage) return;
        const latest = syncCartFromStorage(event, window.localStorage, productIds);
        if (latest === null) return;
        itemsRef.current = latest;
        setItems(latest);
        setPersistenceAvailable(true);
        rememberCart(latest, true);
      } catch { setPersistenceAvailable(false); rememberCart(itemsRef.current, false); }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const apply = useCallback((action: CartAction) => {
    if (!readyRef.current) { pending.current.push(action); return; }
    const next = updateCart(itemsRef.current, action, productIds);
    itemsRef.current = next;
    let persisted = false;
    // Only a local action writes storage. External events never feed back.
    try { window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(next)); persisted = true; }
    catch { /* The checkout link carries only IDs/quantities when persistence fails. */ }
    rememberCart(next, persisted);
    setItems(next);
    setPersistenceAvailable(persisted);
  }, []);
  const add = useCallback((productId: string, quantity = 1) => apply({ type: "add", productId, quantity }), [apply]);
  const setQuantity = useCallback((productId: string, quantity: number) => apply({ type: "setQuantity", productId, quantity }), [apply]);
  const remove = useCallback((productId: string) => apply({ type: "remove", productId }), [apply]);
  const clear = useCallback(() => apply({ type: "clear" }), [apply]);
  const totals = useMemo(() => cartTotals(items, productPrices), [items]);
  const cartHref = useMemo(() => makeCartHref(items, persistenceAvailable), [items, persistenceAvailable]);
  const value = useMemo(() => ({ items, ...totals, ready, cartHref, persistenceAvailable, add, setQuantity, remove, clear }), [items, totals, ready, cartHref, persistenceAvailable, add, setQuantity, remove, clear]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart должен использоваться внутри CartProvider.");
  return value;
}
