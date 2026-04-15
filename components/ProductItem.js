import { BaseComponent } from './BaseComponent.js';
import { addToCart } from '../services/order.js';

export class ProductItem extends BaseComponent {
  static useShadow = false;

  get product() {
    try {
      return JSON.parse(this.dataset.product || 'null');
    } catch {
      return null;
    }
  }

  render() {
    const product = this.product;
    if (!product) {
      return;
    }

    this.renderTemplate('#product-item-template');

    this.querySelector('h4').textContent = product.name;
    this.querySelector('p.price').textContent = `$${product.price.toFixed(2)}`;
    this.querySelector('img').src = `data/images/${product.image}`;

    const link = this.querySelector('a');
    if (!link) {
      return;
    }

    link.addEventListener('click', (event) => {
      event.preventDefault();

      if (event.target instanceof Element && event.target.closest('button')) {
        void addToCart(product.id);
      } else {
        app.router.goTo(`/product-${product.id}`);
      }
    });
  }
}

customElements.define('product-item', ProductItem);
