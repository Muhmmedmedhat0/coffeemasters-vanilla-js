import { BaseComponent } from './BaseComponent.js';
import './CartItem.js';
import { cartService } from '../services/cart-service.js';
import { checkoutService } from '../services/checkout-service.js';

export class OrderPage extends BaseComponent {
  static styles = './components/OrderPage.css';

  #user = {
    name: '',
    phone: '',
    email: '',
  };
  #isSubmitting = false;

  constructor() {
    super();
    this.onCartChange = () => {
      void this.rerender();
    };
  }

  onConnected() {
    window.addEventListener('appcartchange', this.onCartChange);
  }

  onDisconnected() {
    window.removeEventListener('appcartchange', this.onCartChange);
  }

  getCartSummary() {
    return cartService.getSummary();
  }

  render() {
    const section = document.createElement('section');
    this.root.appendChild(section);

    const summary = this.getCartSummary();
    const cart = summary.items;

    if (cart.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty';
      empty.textContent = 'Your order is empty';
      section.appendChild(empty);
      return;
    }

    const title = document.createElement('h2');
    title.textContent = 'Your Order';
    section.appendChild(title);

    const list = document.createElement('ul');
    section.appendChild(list);

    for (const productInCart of cart) {
      const item = document.createElement('cart-item');
      item.dataset.item = JSON.stringify(productInCart);
      list.appendChild(item);
    }

    const totalRow = document.createElement('li');
    const totalLabel = document.createElement('p');
    totalLabel.className = 'total';
    totalLabel.textContent = 'Total';

    const totalPrice = document.createElement('p');
    totalPrice.className = 'price-total';
    totalPrice.textContent = `$${summary.totalPrice.toFixed(2)}`;

    totalRow.append(totalLabel, totalPrice);
    list.appendChild(totalRow);

    const formTemplate = document.getElementById('order-form-template');
    if (formTemplate) {
      section.appendChild(formTemplate.content.cloneNode(true));
    }

    this.setFormBindings(this.root.querySelector('form'));
  }

  setFormBindings(form) {
    if (!form) {
      return;
    }

    this.syncUserToForm(form);

    form.addEventListener('input', (event) => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement) || !input.name) {
        return;
      }

      this.#user[input.name] = input.value;
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (this.#isSubmitting) {
        return;
      }

      this.#isSubmitting = true;
      this.clearFormErrors(form);

      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = true;
      }

      try {
        const result = await checkoutService.placeOrder({
          name: this.readFormField(form, 'name'),
          phone: this.readFormField(form, 'phone'),
          email: this.readFormField(form, 'email'),
        });

        if (!result.ok) {
          this.applyFormErrors(form, result.errors);
          return;
        }

        this.#user = {
          name: '',
          phone: '',
          email: '',
        };
        form.reset();
        alert(`Thank you for your order, ${result.order.customer.name}!`);
      } catch (_error) {
        alert(
          'Something went wrong while placing your order. Please try again.',
        );
      } finally {
        this.#isSubmitting = false;

        if (submitButton instanceof HTMLButtonElement) {
          submitButton.disabled = false;
        }
      }
    });
  }

  readFormField(form, fieldName) {
    const input = this.getField(form, fieldName);
    return input ? input.value.trim() : '';
  }

  getField(form, fieldName) {
    const field = form.elements.namedItem(fieldName);
    return field instanceof HTMLInputElement ? field : null;
  }

  syncUserToForm(form) {
    for (const fieldName of Object.keys(this.#user)) {
      const field = this.getField(form, fieldName);
      if (field) {
        field.value = this.#user[fieldName];
      }
    }
  }

  clearFormErrors(form) {
    for (const fieldName of Object.keys(this.#user)) {
      const field = this.getField(form, fieldName);
      if (field) {
        field.setCustomValidity('');
      }
    }
  }

  applyFormErrors(form, errors) {
    for (const fieldName of Object.keys(this.#user)) {
      const field = this.getField(form, fieldName);
      if (field) {
        field.setCustomValidity(errors[fieldName] || '');
      }
    }

    if (errors.cart) {
      alert(errors.cart);
    }

    form.reportValidity();
  }
}

customElements.define('order-page', OrderPage);
