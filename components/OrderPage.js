import './CartItem.js';

export class OrderPage extends HTMLElement {
  #user = {
    name: '',
    phone: '',
    email: '',
  };
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
    // set up the form bindings after rendering the form to ensure the #user object stays in sync with the form inputs
    this.setFormBindings(this.root.querySelector('form'));
  }

  // lifecycle method called when the element is removed from the DOM
  disconnectedCallback() {
    window.removeEventListener('appcartchange', this.onCartChange);
    this.root.innerHTML = '';
  }
  // double data binding for the form inputs to keep the #user object in sync with the form values
  setFormBindings(form) {
    if (!form) {
      return;
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      this.#user = {
        name: form.elements.name.value.trim(),
        phone: form.elements.phone.value.trim(),
        email: form.elements.email.value.trim(),
      };

      console.log('Order submitted:', this.#user);
      alert(`Thank you for your order, ${this.#user.name}!`);
      // reset the form and user data after submission
      this.#user = {
        name: '',
        phone: '',
        email: '',
      };
      form.reset();
      // TODO: send the order data to the server
    });

    this.#user = new Proxy(this.#user, {
      set: (target, prop, value) => {
        target[prop] = value;
        if (form.elements[prop]) {
          form.elements[prop].value = value;
        }
        return true;
      },
    });
    Array.from(form.elements).forEach((element) => {
      if (!element.name) {
        return;
      }

      element.addEventListener('input', () => {
        this.#user[element.name] = element.value;
      });
    });
  }
}

customElements.define('order-page', OrderPage);
