import test from "node:test";
import assert from "node:assert/strict";
import { CART_STORAGE_KEY, cartHref, cartTotals, parseCart, parseCartHash, parseCartHistory, serializeCart, syncCartFromStorage, updateCart, withCartHistory, withoutCartHash } from "../src/cart-model.ts";

const ids = new Set(["mittens-a", "cover-b"]);
const prices = new Map([["mittens-a", 2850], ["cover-b", 4970]]);

test("restore rejects corrupt JSON and non-array storage", () => {
  for (const value of [null, "", "{broken", "null", "{}", '"text"']) {
    assert.deepEqual(parseCart(value, ids), []);
  }
});

test("restore filters unknown products and invalid quantities, merges duplicates, caps at 99", () => {
  const restored = parseCart(JSON.stringify([
    { productId: "unknown", quantity: 2 },
    { productId: "mittens-a", quantity: 3.8, email: "private@example.com" },
    { productId: "mittens-a", quantity: 200 },
    { productId: "cover-b", quantity: -4 },
    { productId: "cover-b", quantity: "2" },
    { productId: "cover-b", quantity: null },
    { productId: "cover-b", quantity: 2 },
    null,
  ]), ids);
  assert.deepEqual(restored, [
    { productId: "mittens-a", quantity: 99 },
    { productId: "cover-b", quantity: 2 },
  ]);
});

test("add combines a product, keeps other products and never exceeds the limit", () => {
  let items = updateCart([], { type: "add", productId: "mittens-a" }, ids);
  items = updateCart(items, { type: "add", productId: "cover-b", quantity: 2 }, ids);
  items = updateCart(items, { type: "add", productId: "mittens-a", quantity: 100 }, ids);
  assert.deepEqual(items, [
    { productId: "mittens-a", quantity: 99 },
    { productId: "cover-b", quantity: 2 },
  ]);
  for (const action of [
    { type: "add", productId: "unknown", quantity: 5 },
    { type: "add", productId: "cover-b", quantity: -2 },
    { type: "add", productId: "cover-b", quantity: NaN },
    { type: "add", productId: "cover-b", quantity: Infinity },
  ]) assert.deepEqual(updateCart(items, action, ids), items);
});

test("quantity updates remove zero or negative lines and ignore non-finite values", () => {
  const items = [{ productId: "mittens-a", quantity: 2 }, { productId: "cover-b", quantity: 1 }];
  assert.deepEqual(updateCart(items, { type: "setQuantity", productId: "mittens-a", quantity: 4.9 }, ids), [
    { productId: "mittens-a", quantity: 4 }, { productId: "cover-b", quantity: 1 },
  ]);
  for (const quantity of [0, -1]) {
    assert.deepEqual(updateCart(items, { type: "setQuantity", productId: "mittens-a", quantity }, ids), [{ productId: "cover-b", quantity: 1 }]);
  }
  for (const quantity of [NaN, Infinity, -Infinity]) {
    assert.deepEqual(updateCart(items, { type: "setQuantity", productId: "mittens-a", quantity }, ids), items);
  }
  assert.deepEqual(updateCart(items, { type: "remove", productId: "cover-b" }, ids), [{ productId: "mittens-a", quantity: 2 }]);
  assert.deepEqual(updateCart(items, { type: "clear" }, ids), []);
  assert.deepEqual(items, [{ productId: "mittens-a", quantity: 2 }, { productId: "cover-b", quantity: 1 }]);
});

test("storage serializes only product IDs and quantities, total uses current catalog prices", () => {
  const items = [{ productId: "mittens-a", quantity: 2, email: "private@example.com", price: 1 }, { productId: "cover-b", quantity: 1 }];
  assert.equal(serializeCart(items), '[{"productId":"mittens-a","quantity":2},{"productId":"cover-b","quantity":1}]');
  assert.deepEqual(cartTotals(items, prices), { count: 3, total: 10670 });
});

test("cross-tab sync reads current storage instead of a stale event and never writes back", () => {
  const current = [{ productId: "cover-b", quantity: 3 }];
  let reads = 0;
  let writes = 0;
  const storage = {
    getItem(key) { assert.equal(key, CART_STORAGE_KEY); reads++; return JSON.stringify(current); },
    setItem() { writes++; },
  };
  const staleEvent = { key: CART_STORAGE_KEY, newValue: '[{"productId":"mittens-a","quantity":1}]' };
  assert.deepEqual(syncCartFromStorage(staleEvent, storage, ids), current);
  assert.equal(reads, 1);
  assert.equal(writes, 0);
  assert.equal(syncCartFromStorage({ key: "another-key" }, storage, ids), null);
  assert.equal(reads, 1);
  storage.getItem = () => null;
  assert.deepEqual(syncCartFromStorage({ key: null }, storage, ids), []);
});

test("failed persistence gets a portable cart URL containing only IDs and quantities", () => {
  const items = [{ productId: "mittens-a", quantity: 2, email: "private@example.com" }];
  assert.equal(cartHref(items, true), "./cart.html");
  const href = cartHref(items, false);
  assert.match(href, /^\.\/cart\.html#cart=[A-Za-z0-9_-]+$/);
  assert.deepEqual(parseCartHash(new URL(href, "https://shop.test/").hash, ids), [{ productId: "mittens-a", quantity: 2 }]);
  const raw = new URL(href, "https://shop.test/").hash.slice("#cart=".length);
  assert.equal(Buffer.from(raw, "base64url").toString("utf8"), '[{"productId":"mittens-a","quantity":2}]');
  assert.equal(cartHref([], false), "./cart.html");
});

test("cart URL restoration validates payloads and removes only its own hash parameter", () => {
  for (const hash of ["", "#consent", "#cart=!invalid", "#cart=" + Buffer.from('{}').toString('base64url')]) {
    assert.equal(parseCartHash(hash, ids), null);
  }
  const payload = Buffer.from(JSON.stringify([
    { productId: "unknown", quantity: 2 },
    { productId: "cover-b", quantity: 500 },
    { productId: "mittens-a", quantity: -1 },
  ])).toString("base64url");
  assert.deepEqual(parseCartHash(`#cart=${payload}`, ids), [{ productId: "cover-b", quantity: 99 }]);
  assert.equal(withoutCartHash(`#cart=${payload}`), "");
  assert.equal(withoutCartHash(`#cart=${payload}&other=keep`), "#other=keep");
  assert.equal(withoutCartHash("#consent"), "#consent");
});

test("history fallback survives clean-URL reload, updates an empty cart and preserves unrelated state", () => {
  const saved = withCartHistory({ other: "keep" }, [{ productId: "cover-b", quantity: 2, email: "private@example.com" }]);
  assert.deepEqual(saved, { other: "keep", __prichudyCart: [{ productId: "cover-b", quantity: 2 }] });
  const reloadedState = structuredClone(saved);
  assert.deepEqual(parseCartHistory(reloadedState, ids), [{ productId: "cover-b", quantity: 2 }]);
  assert.deepEqual(parseCartHistory(withCartHistory(saved, []), ids), []);
  assert.deepEqual(withCartHistory(saved, null), { other: "keep" });
  assert.equal(parseCartHistory(withCartHistory(saved, null), ids), null);
  assert.equal(parseCartHistory({ __prichudyCart: "bad" }, ids), null);
  assert.deepEqual(parseCartHistory({ __prichudyCart: [{ productId: "unknown", quantity: 3 }, { productId: "cover-b", quantity: 300 }] }, ids), [{ productId: "cover-b", quantity: 99 }]);
});
