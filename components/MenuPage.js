export class MenuPage extends HTMLElement {
  constructor() {
    super();
    // attach a shadow DOM to the element for encapsulation and style isolation
    this.root = this.attachShadow({ mode: 'open' });
  }
  // lifecycle method called when the element is added to the DOM
  connectedCallback() {
    const template = document.querySelector('#menu-page-template');
    const clone = template.content.cloneNode(true);
    this.root.appendChild(clone);
  }
  // lifecycle method called when the element is removed from the DOM
  disconnectedCallback() {
    this.root.innerHTML = '';
  }
}

customElements.define('menu-page', MenuPage);
