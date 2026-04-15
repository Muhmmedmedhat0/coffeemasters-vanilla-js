import { BaseComponent } from './BaseComponent.js';
import { getProductById } from '../services/menu.js';
import { addToCart } from '../services/order.js';

export class DetailsPage extends BaseComponent {
  static styles = './components/DetailsPage.css';

  render() {
    this.renderTemplate('#details-page-template');
    void this.renderData();
  }

  async renderData() {
    const title = this.root.querySelector('h2');
    if (!title) {
      return;
    }

    const productId = this.dataset.productId || this.dataset.id;

    if (!productId) {
      title.textContent = 'Invalid Product ID';
      return;
    }

    const product = await getProductById(productId);
    if (!this.isConnected) {
      return;
    }

    if (!product) {
      title.textContent = 'Product not found';
      return;
    }

    this.product = product;

    const image = this.root.querySelector('img');
    const description = this.root.querySelector('.description');
    const price = this.root.querySelector('.price');
    const button = this.root.querySelector('button');

    title.textContent = this.product.name;
    if (image) {
      image.src = `/data/images/${this.product.image}`;
    }

    if (description) {
      description.textContent = this.product.description;
    }

    if (price) {
      price.textContent = `$ ${this.product.price.toFixed(2)} ea`;
    }

    if (button) {
      button.addEventListener('click', () => {
        addToCart(this.product.id);
      });
    }
  }
}

customElements.define('details-page', DetailsPage);
