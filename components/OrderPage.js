export class OrderPage extends HTMLElement {
  constructor() {
    super();
  }
  // lifecycle method called when the element is added to the DOM
  connectedCallback() {
    const template = document.querySelector('#order-page-template');
    const clone = template.content.cloneNode(true);
    this.appendChild(clone);
  }
  // lifecycle method called when the element is removed from the DOM
  disconnectedCallback() {
    this.innerHTML = '';
  }
}

customElements.define('order-page', OrderPage);
