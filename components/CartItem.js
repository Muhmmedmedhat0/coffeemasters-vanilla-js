import { BaseComponent } from './BaseComponent.js';
import { removeFromCart } from '../services/order.js';

export class CartItem extends BaseComponent {
  static useShadow = false;

  get item() {
    try {
      return JSON.parse(this.dataset.item || 'null');
    } catch {
      return null;
    }
  }

  render() {
    const item = this.item;
    if (!item?.product) {
      return;
    }

    this.renderTemplate('#cart-item-template');

    this.querySelector('.qty').textContent = `${Number(item.quantity || 0)}x`;
    this.querySelector('.name').textContent = item.product.name;
    this.querySelector('.price').textContent =
      `$${Number(item.product.price || 0).toFixed(2)}`;

    const deleteButton = this.querySelector('a.delete-button');
    if (deleteButton) {
      deleteButton.addEventListener('click', (event) => {
        event.preventDefault();
        removeFromCart(item.product.id);
      });
    }
  }
}

customElements.define('cart-item', CartItem);
