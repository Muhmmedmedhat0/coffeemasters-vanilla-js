import { cartService } from './cart-service.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+]?[\d\s()\-]{7,20}$/;

export class Customer {
  constructor({ name = '', phone = '', email = '' } = {}) {
    this.name = String(name).trim();
    this.phone = String(phone).trim();
    this.email = String(email).trim();
  }

  validate() {
    const errors = {};

    if (!this.name) {
      errors.name = 'Name is required.';
    }

    if (this.email && !EMAIL_PATTERN.test(this.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (this.phone && !PHONE_PATTERN.test(this.phone)) {
      errors.phone = 'Please enter a valid phone number.';
    }

    return errors;
  }

  toJSON() {
    return {
      name: this.name,
      phone: this.phone,
      email: this.email,
    };
  }
}

export class CheckoutService {
  constructor(service = cartService) {
    this.cartService = service;
  }

  async placeOrder(customerInput) {
    const customer = new Customer(customerInput);
    const errors = customer.validate();
    const summary = this.cartService.getSummary();

    if (summary.items.length === 0) {
      errors.cart = 'Your cart is empty.';
    }

    if (Object.keys(errors).length > 0) {
      return {
        ok: false,
        errors,
      };
    }

    const order = {
      id: globalThis.crypto?.randomUUID
        ? globalThis.crypto.randomUUID()
        : `order-${Date.now()}`,
      customer: customer.toJSON(),
      items: summary.items,
      totalQuantity: summary.totalQuantity,
      totalPrice: Number(summary.totalPrice.toFixed(2)),
      createdAt: new Date().toISOString(),
    };

    this.cartService.clear();

    return {
      ok: true,
      order,
    };
  }
}

export const checkoutService = new CheckoutService();
