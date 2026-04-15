import { getProductById } from './menu.js';
import { cartService } from './cart-service.js';

export async function addToCart(id) {
  const product = await getProductById(id);
  if (!product) {
    return false;
  }

  cartService.addProduct(product);
  return true;
}

export function removeFromCart(id) {
  cartService.removeProduct(id);
}

export function clearCart() {
  cartService.clear();
}

export function getCartSummary() {
  return cartService.getSummary();
}
