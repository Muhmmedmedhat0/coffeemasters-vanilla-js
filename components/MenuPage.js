export class MenuPage extends HTMLElement {
  constructor() {
    super();
    // attach a shadow DOM to the element for encapsulation and style isolation
    this.root = this.attachShadow({ mode: 'open' });
    this.onMenuChange = () => this.render();
  }

  // load css files asynchronously to avoid blocking the rendering of the page
  async loadStyles() {
    const request = await fetch('./components/MenuPage.css');
    const cssText = await request.text();
    const style = document.createElement('style');
    style.textContent = cssText;
    this.root.appendChild(style);
  }

  // lifecycle method called when the element is added to the DOM
  connectedCallback() {
    this.loadStyles();
    const template = document.querySelector('#menu-page-template');
    if (!template) {
      return;
    }

    const clone = template.content.cloneNode(true);
    this.root.appendChild(clone);
    this.render();

    // Re-render when menu data changes.
    window.addEventListener('appmenuchange', this.onMenuChange);
  }

  render() {
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

  // lifecycle method called when the element is removed from the DOM
  disconnectedCallback() {
    window.removeEventListener('appmenuchange', this.onMenuChange);
    this.root.innerHTML = '';
  }
}

customElements.define('menu-page', MenuPage);
