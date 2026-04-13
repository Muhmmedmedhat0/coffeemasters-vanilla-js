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
	// lifecycle method called when the element is removed from the DOM
	disconnectedCallback() {
		this.innerHTML = '';
	}
	// // lifecycle method called when an observed attribute changes
	// attributeChangedCallback(name, oldValue, newValue) {
	// 	// handle attribute changes if needed
	// 	console.log(name, oldValue, newValue);
	// }
}

customElements.define('menu-page', MenuPage);
