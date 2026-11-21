export type CartItem = { productId: string; quantity: number };
export type CartAction =
  | { type: "add"; productId: string; quantity?: number }
  | { type: "setQuantity"; productId: string; quantity: number }
  | { type: "remove"; productId: string }
  | { type: "clear" };

export const CART_STORAGE_KEY = "prichudy_cart_v1";
export const MAX_CART_QUANTITY = 99;

function quantity(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.min(MAX_CART_QUANTITY, Math.max(0, Math.floor(value)));
}

function normalizeCart(value: unknown, ids: ReadonlySet<string>): CartItem[] {
  if (!Array.isArray(value)) return [];
  const result = new Map<string, number>();
  for (const item of value) {
    if (!item || typeof item !== "object" || typeof item.productId !== "string" || !ids.has(item.productId)) continue;
    const amount = quantity(item.quantity);
    if (!amount) continue;
    result.set(item.productId, Math.min(MAX_CART_QUANTITY, (result.get(item.productId) ?? 0) + amount));
  }
  return Array.from(result, ([productId, amount]) => ({ productId, quantity: amount }));
}

export function parseCart(value: string | null, ids: ReadonlySet<string>): CartItem[] {
  if (typeof value !== "string" || !value) return [];
  try { return normalizeCart(JSON.parse(value), ids); }
  catch { return []; }
}

export function updateCart(items: CartItem[], action: CartAction, ids: ReadonlySet<string>): CartItem[] {
  if (action.type === "clear") return [];
  const current = normalizeCart(items, ids);
  if (!ids.has(action.productId)) return current;
  if (action.type === "remove") return current.filter(item => item.productId !== action.productId);
  const amount = quantity(action.type === "add" ? action.quantity ?? 1 : action.quantity);
  if (amount === null) return current;
  const index = current.findIndex(item => item.productId === action.productId);
  if (action.type === "setQuantity") {
    if (amount === 0) return current.filter(item => item.productId !== action.productId);
    if (index !== -1) current[index] = { productId: action.productId, quantity: amount };
  } else if (amount > 0) {
    if (index === -1) current.push({ productId: action.productId, quantity: amount });
    else current[index] = { productId: action.productId, quantity: Math.min(MAX_CART_QUANTITY, current[index].quantity + amount) };
  }
  return current;
}

export function serializeCart(items: CartItem[]): string {
  return JSON.stringify(items.map(({ productId, quantity }) => ({ productId, quantity })));
}

export function cartTotals(items: CartItem[], prices: ReadonlyMap<string, number>) {
  return items.reduce((result, item) => {
    const amount = quantity(item.quantity);
    const price = prices.get(item.productId);
    if (!amount || typeof price !== "number" || !Number.isFinite(price) || price < 0) return result;
    return { count: result.count + amount, total: result.total + amount * price };
  }, { count: 0, total: 0 });
}

export function syncCartFromStorage(
  event: { key: string | null; newValue?: string | null },
  storage: { getItem: (key: string) => string | null },
  ids: ReadonlySet<string>,
): CartItem[] | null {
  if (event.key !== CART_STORAGE_KEY && event.key !== null) return null;
  // An event may be queued behind a newer write by another tab.
  return parseCart(storage.getItem(CART_STORAGE_KEY), ids);
}

export function cartHref(items: CartItem[], persisted: boolean): string {
  if (persisted || !items.length) return "./cart.html";
  const bytes = new TextEncoder().encode(serializeCart(items));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const payload = btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `./cart.html#cart=${payload}`;
}

export function parseCartHash(hash: string, ids: ReadonlySet<string>): CartItem[] | null {
  const payload = new URLSearchParams(hash.replace(/^#/, "")).get("cart");
  if (!payload || payload.length > 20000 || !/^[A-Za-z0-9_-]+$/.test(payload)) return null;
  try {
    const binary = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    const value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    return Array.isArray(value) ? normalizeCart(value, ids) : null;
  } catch { return null; }
}

export function withoutCartHash(hash: string): string {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  if (!params.has("cart")) return hash;
  params.delete("cart");
  const rest = params.toString();
  return rest ? `#${rest}` : "";
}

export function parseCartHistory(state: unknown, ids: ReadonlySet<string>): CartItem[] | null {
  if (!state || typeof state !== "object" || Array.isArray(state)) return null;
  const value = (state as Record<string, unknown>).__prichudyCart;
  return Array.isArray(value) ? normalizeCart(value, ids) : null;
}

export function withCartHistory(state: unknown, items: CartItem[] | null): unknown {
  const previous = state && typeof state === "object" && !Array.isArray(state) ? state as Record<string, unknown> : {};
  if (items === null) {
    if (!Object.prototype.hasOwnProperty.call(previous, "__prichudyCart")) return state;
    const next = { ...previous };
    delete next.__prichudyCart;
    return next;
  }
  return { ...previous, __prichudyCart: items.map(({ productId, quantity }) => ({ productId, quantity })) };
}
