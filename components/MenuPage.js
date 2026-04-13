export class MenuPage extends HTMLElement {
  constructor() {
    super();
  }
  // lifecycle method called when the element is added to the DOM
  connectedCallback() {
    const template = document.querySelector('#menu-page-template');
    const clone = template.content.cloneNode(true);
    this.appendChild(clone);
  }
}

customElements.define('menu-page', MenuPage);
