import { getProductById } from './menu.js';

export async function addToCart(id) {
  const product = await getProductById(id);
  if (!product) {
    return;
  }

  const cart = Array.isArray(app.store.cart) ? app.store.cart : [];
  const result = cart.filter((item) => String(item.product.id) === String(id));

  if (result.length === 1) {
    app.store.cart = cart.map((item) =>
      String(item.product.id) === String(id)
        ? { ...item, quantity: Number(item.quantity || 0) + 1 }
        : item,
    );
  } else {
    app.store.cart = [...cart, { product, quantity: 1 }];
  }
}

export function removeFromCart(id) {
  const cart = Array.isArray(app.store.cart) ? app.store.cart : [];
  app.store.cart = cart.filter(
    (item) => String(item.product.id) !== String(id),
  );
}
