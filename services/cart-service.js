function getStore() {
  const store = globalThis.app?.store;
  if (!store) {
    throw new Error('Store is not initialized.');
  }

  return store;
}

export class CartLine {
  constructor(product, quantity = 1) {
    if (!product || typeof product.id === 'undefined') {
      throw new TypeError('CartLine requires a product with an id.');
    }

    this.product = product;
    this.quantity = CartLine.normalizeQuantity(quantity);
  }

  static normalizeQuantity(quantity) {
    const normalized = Math.floor(Number(quantity));
    return Number.isFinite(normalized) && normalized > 0 ? normalized : 1;
  }

  increment(amount = 1) {
    this.quantity += CartLine.normalizeQuantity(amount);
  }

  get subtotal() {
    const price = Number(this.product?.price || 0);
    return price * this.quantity;
  }

  toJSON() {
    return {
      product: this.product,
      quantity: this.quantity,
    };
  }

  static from(item) {
    if (!item?.product || typeof item.product.id === 'undefined') {
      return null;
    }

    return new CartLine(item.product, item.quantity);
  }
}

export class Cart {
  #lines = [];

  constructor(lines = []) {
    this.#lines = lines;
  }

  static from(items = []) {
    const lines = items
      .map((item) => CartLine.from(item))
      .filter((line) => line !== null);

    return new Cart(lines);
  }

  findLineIndex(productId) {
    return this.#lines.findIndex(
      (line) => String(line.product.id) === String(productId),
    );
  }

  addProduct(product, quantity = 1) {
    const index = this.findLineIndex(product.id);

    if (index >= 0) {
      this.#lines[index].increment(quantity);
      return;
    }

    this.#lines.push(new CartLine(product, quantity));
  }

  removeProduct(productId) {
    this.#lines = this.#lines.filter(
      (line) => String(line.product.id) !== String(productId),
    );
  }

  clear() {
    this.#lines = [];
  }

  get items() {
    return this.#lines.map((line) => line.toJSON());
  }

  get totalQuantity() {
    return this.#lines.reduce((total, line) => total + line.quantity, 0);
  }

  get totalPrice() {
    return this.#lines.reduce((total, line) => total + line.subtotal, 0);
  }
}

export class CartService {
  readCart() {
    const store = getStore();
    return Cart.from(Array.isArray(store.cart) ? store.cart : []);
  }

  writeCart(cart) {
    const store = getStore();
    store.cart = cart.items;
  }

  getItems() {
    return this.readCart().items;
  }

  addProduct(product, quantity = 1) {
    const cart = this.readCart();
    cart.addProduct(product, quantity);
    this.writeCart(cart);
  }

  removeProduct(productId) {
    const cart = this.readCart();
    cart.removeProduct(productId);
    this.writeCart(cart);
  }

  clear() {
    const store = getStore();
    store.cart = [];
  }

  getSummary() {
    const cart = this.readCart();

    return {
      items: cart.items,
      totalQuantity: cart.totalQuantity,
      totalPrice: cart.totalPrice,
    };
  }
}

export const cartService = new CartService();
