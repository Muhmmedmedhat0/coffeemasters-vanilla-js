export class MenuPage extends HTMLElement {
  constructor() {
    super();
    // attach a shadow DOM to the element for encapsulation and style isolation
    this.root = this.attachShadow({ mode: 'open' });
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
    window.addEventListener('appmenuchange', () => this.render());
  }

  render() {
    if (app.store.menu) {
      for (const category of app.store.menu) {
        const listCategory = document.createElement('li');
        listCategory.innerHTML = `
					<h3>${category.name}</h3>
					<ul class ='category'></ul>

				`;
        this.root.querySelector('#menu').appendChild(listCategory);
				category.products.forEach((product) => {
					const item = document.createElement('li');
					item.dataset.product = JSON.stringify(product);
					listCategory.querySelector('ul').appendChild(item);

					// listCategory.querySelector('.category').appendChild(item);
				});
      }
    }
  }

  // lifecycle method called when the element is removed from the DOM
  disconnectedCallback() {
    window.removeEventListener('appmenuchange', () => this.render());
    this.root.innerHTML = '';
  }
}

customElements.define('menu-page', MenuPage);
