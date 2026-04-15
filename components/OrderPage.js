import './CartItem.js';

export class OrderPage extends HTMLElement {
  constructor() {
    super();
    // attach a shadow DOM to the element for encapsulation and style isolation
    this.root = this.attachShadow({ mode: 'open' });
    this.onCartChange = () => this.render();
  }

  // load css files asynchronously to avoid blocking the rendering of the page
  async loadStyles() {
    if (this.root.querySelector('style[data-order-page]')) {
      return;
    }

    const request = await fetch('./components/OrderPage.css');
    if (!request.ok) {
      return;
    }

    const cssText = await request.text();
    const style = document.createElement('style');
    style.dataset.orderPage = 'true';
    style.textContent = cssText;
    this.root.appendChild(style);
  }

  // lifecycle method called when the element is added to the DOM
  connectedCallback() {
    this.loadStyles();
    this.render();
    window.addEventListener('appcartchange', this.onCartChange);
  }

  getCartItems() {
    return Array.isArray(app.store.cart) ? app.store.cart : [];
  }

  getSection() {
    let section = this.root.querySelector('section');
    if (!section) {
      section = document.createElement('section');
      this.root.appendChild(section);
    }

    return section;
  }

  render() {
    const section = this.getSection();
    const cart = this.getCartItems();

    section.replaceChildren();

    if (cart.length === 0) {
      section.innerHTML = `
          <p class="empty">Your order is empty</p>
      `;
      return;
    }

    const title = document.createElement('h2');
    title.textContent = 'Your Order';
    section.appendChild(title);

    const list = document.createElement('ul');
    section.appendChild(list);

    let total = 0;
    for (const productInCart of cart) {
      const item = document.createElement('cart-item');
      item.dataset.item = JSON.stringify(productInCart);
      list.appendChild(item);

      total +=
        Number(productInCart.quantity || 0) *
        Number(productInCart.product?.price || 0);
    }

    const totalRow = document.createElement('li');
    totalRow.innerHTML = `
      <p class='total'>Total</p>
      <p class='price-total'>$${total.toFixed(2)}</p>
    `;
    list.appendChild(totalRow);

    const formTemplate = document.getElementById('order-form-template');
    if (formTemplate) {
      section.appendChild(formTemplate.content.cloneNode(true));
    }
  }

  // lifecycle method called when the element is removed from the DOM
  disconnectedCallback() {
    window.removeEventListener('appcartchange', this.onCartChange);
    this.root.innerHTML = '';
  }
}

customElements.define('order-page', OrderPage);
