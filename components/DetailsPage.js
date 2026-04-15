import { getProductById } from '../services/menu.js';
import { addToCart } from '../services/order.js';

export class DetailsPage extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'open' });

    const template = document.getElementById('details-page-template');
    const content = template.content.cloneNode(true);
    const styles = document.createElement('style');
    this.root.appendChild(content);
    this.root.appendChild(styles);

    async function loadCSS() {
      const request = await fetch('/components/DetailsPage.css');
      styles.textContent = await request.text();
    }
    loadCSS();
  }

  async renderData() {
    const productId = this.dataset.productId || this.dataset.id;

    if (productId) {
      this.product = await getProductById(productId);
      if (!this.product) {
        this.root.querySelector('h2').textContent = 'Product not found';
        return;
      }

      this.root.querySelector('h2').textContent = this.product.name;
      this.root.querySelector('img').src = `/data/images/${this.product.image}`;
      this.root.querySelector('.description').textContent =
        this.product.description;
      this.root.querySelector('.price').textContent =
        `$ ${this.product.price.toFixed(2)} ea`;
      this.root.querySelector('button').addEventListener('click', () => {
        addToCart(this.product.id);
      });
    } else {
      this.root.querySelector('h2').textContent = 'Invalid Product ID';
    }
  }

  connectedCallback() {
    this.renderData();
  }
}

customElements.define('details-page', DetailsPage);
