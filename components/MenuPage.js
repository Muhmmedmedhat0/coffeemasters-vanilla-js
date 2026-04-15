import { BaseComponent } from './BaseComponent.js';

export class MenuPage extends BaseComponent {
  static styles = './components/MenuPage.css';

  constructor() {
    super();
    this.onMenuChange = () => {
      void this.rerender();
    };
  }

  onConnected() {
    window.addEventListener('appmenuchange', this.onMenuChange);
  }

  onDisconnected() {
    window.removeEventListener('appmenuchange', this.onMenuChange);
  }

  render() {
    this.renderTemplate('#menu-page-template');

    const menuElement = this.root.querySelector('#menu');
    if (!menuElement) {
      return;
    }

    menuElement.replaceChildren();

    if (!Array.isArray(app.store.menu) || app.store.menu.length === 0) {
      const loadingItem = document.createElement('li');
      loadingItem.textContent = 'Loading menu...';
      menuElement.appendChild(loadingItem);
      return;
    }

    for (const category of app.store.menu) {
      const categoryItem = document.createElement('li');
      const title = document.createElement('h3');
      title.textContent = category.name;

      const categoryList = document.createElement('ul');
      categoryList.className = 'category';

      for (const product of category.products || []) {
        const productItem = document.createElement('product-item');
        productItem.dataset.product = JSON.stringify(product);
        categoryList.appendChild(productItem);
      }

      categoryItem.appendChild(title);
      categoryItem.appendChild(categoryList);
      menuElement.appendChild(categoryItem);
    }
  }
}

customElements.define('menu-page', MenuPage);
