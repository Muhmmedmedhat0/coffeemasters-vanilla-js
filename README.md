# Coffee Masters - Vanilla JavaScript SPA

A fully-featured **Single Page Application (SPA)** built with **vanilla JavaScript** (no frameworks!) demonstrating modern web development practices, progressive web app capabilities, and clean architecture patterns. This is a companion project to the [You Don't Need That Library][course] course on Frontend Masters.

[![Frontend Masters](images/FrontendMastersLogo.png)][fem]

**[Course Website][website]** | **[Frontend Masters][fem]** | **[Course Content][course]**

[fem]: https://www.frontendmasters.com
[website]: https://firtman.github.io/vanilla/
[course]: https://frontendmasters.com/courses/vanilla-js-apps/

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Core Concepts](#core-concepts)
- [Development Guide](#development-guide)
- [Learning Resources](#learning-resources)

---

## 🎯 Overview

**Coffee Masters** is a modern e-commerce application for ordering specialty coffee. It serves as a practical demonstration of building production-ready web applications using vanilla JavaScript, without relying on framework libraries like React, Vue, or Angular.

The application showcases:

- **Web Components** for reusable UI components
- **Custom routing** with history API integration
- **State management** via JavaScript Proxies
- **Object-Oriented Programming** for services and business logic
- **Progressive Web App (PWA)** capabilities
- **Service Workers** for offline support
- **Responsive design** with modern CSS

### Use Cases Demonstrated

✅ **Product Browsing** - Browse coffee menu organized by category  
✅ **Product Details** - View detailed product information with images  
✅ **Shopping Cart** - Add/remove items with real-time quantity updates  
✅ **Order Management** - Complete checkout with customer information validation  
✅ **Persistent State** - Cart state preserved across navigation  
✅ **Client-side Routing** - Smooth SPA navigation without page reloads  
✅ **PWA Features** - Installable app, offline support ready

---

## ✨ Key Features

### 1. **Web Components Architecture**

- Custom elements extending `BaseComponent` for consistent lifecycle management
- Shadow DOM encapsulation for styling isolation
- Light DOM mode for specific components (ProductItem, CartItem)
- Template-based rendering with CSS isolation

### 2. **Advanced State Management**

- **Proxy-based Store**: Reactive state management via JavaScript Proxies
- **Event Emission**: Custom window events (`appmenuchange`, `appcartchange`) for component communication
- **Cart Service**: OOP-based cart line and cart management with validation
- **Checkout Service**: Customer validation and order processing logic

### 3. **Custom Router**

- String-based routing with switch statement routing
- Browser History API integration for back/forward navigation
- Dynamic route parameters (e.g., `/product-{id}`)
- Support for initial URL path detection
- 404 fallback handling with query parameters

### 4. **OOP Services Layer**

```
services/
├── store.js           → Proxy-based reactive store
├── menu.js            → Menu data loading and product lookup
├── cart-service.js    → CartLine, Cart, CartService classes
├── checkout-service.js → Customer, CheckoutService classes
├── order.js           → Order utilities and cart operations
└── api.js             → API client for data fetching
```

### 5. **Progressive Web App (PWA) Ready**

- Web Manifest (`app.webmanifest`) with app metadata
- PWA-optimized icons (1024x1024 and maskable 512x512)
- Service Worker stub for caching and offline support
- Mobile-first responsive design
- Installable to home screen

### 6. **Component-Based UI**

- **MenuPage**: Displays categorized product list
- **DetailsPage**: Shows product details with add-to-cart functionality
- **OrderPage**: Shopping cart and checkout interface
- **ProductItem**: Individual product card (light DOM)
- **CartItem**: Cart line item display (light DOM)

---

## 🏗️ Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         App Bootstrap                       │
│                        (app.js)                             │
└──────────┬──────────────────────────────────────────────────┘
           │
           ├─► Load Menu Data (services/menu.js → API.fetchMenu)
           │
           ├─► Initialize Router (router/route.js)
           │
           └─► Initialize Global Store (window.app = { store, router })
                │
                ├─ app.store → Proxy with reactive behavior
                └─ app.router → ROUTER object with goTo() method

┌─────────────────────────────────────────────────────────────┐
│                    Event-Driven Updates                     │
└─────────────────────────────────────────────────────────────┘
                    ↓
    window.dispatchEvent('appmenuchange')
    window.dispatchEvent('appcartchange')
                    ↓
        Component listeners re-render UI
```

### Component Lifecycle

```
┌─────────────────────────────────────┐
│   connectedCallback()               │
│   ├─ loadStyles()                   │
│   ├─ rerender()                     │
│   │   └─ render() [user defined]   │
│   └─ onConnected() [hook]          │
└─────────────────────────────────────┘
            ↓ (user interaction)
        Event Handlers
            ↓
    rerender() or dispatch event
            ↓
┌─────────────────────────────────────┐
│   disconnectedCallback()            │
│   ├─ onDisconnected() [hook]       │
│   └─ clearContent()                │
└─────────────────────────────────────┘
```

### Routing Flow

```
User clicks navigation link
        ↓
Link click handler calls ROUTER.goTo(url)
        ↓
history.pushState({ route }, '', url)
        ↓
Router switch statement determines page component
        ↓
Create page element (menu-page, order-page, details-page)
        ↓
Replace main content via main.replaceChildren(pageElement)
        ↓
New component connectedCallback() triggers render
        ↓
Page scrolls to top (UX improvement)
```

### State Management Flow

```
User Action (add to cart)
        ↓
app.store.cart = [..., newItem]
        ↓
Proxy handler intercepts set operation
        ↓
Proxy dispatches 'appcartchange' event
        ↓
Components listening to 'appcartchange' rerender
        ↓
UI updates with new cart state
```

---

## 📁 Project Structure

```
coffeemasters-vanilla-js/
│
├── 📄 index.html                    # Main HTML file with templates
├── 📄 app.js                        # App bootstrap and initialization
├── 📄 styles.css                    # Global styles
├── 📄 serviceworker.js              # Service worker (PWA support)
├── 📄 app.webmanifest               # PWA manifest
│
├── 📂 components/                   # Web Components
│   ├── BaseComponent.js             # Base class for all components
│   ├── MenuPage.js                  # Menu display component
│   ├── MenuPage.css                 # Menu styling
│   ├── DetailsPage.js               # Product details component
│   ├── DetailsPage.css              # Details styling
│   ├── OrderPage.js                 # Shopping cart & checkout
│   ├── OrderPage.css                # Order page styling
│   ├── ProductItem.js               # Individual product card
│   ├── CartItem.js                  # Cart line item component
│   └── CartItem.css (optional)      # Cart item styling
│
├── 📂 router/                       # Routing system
│   └── route.js                     # Router implementation (ROUTER object)
│
├── 📂 services/                     # Business logic & data management
│   ├── api.js                       # API client
│   ├── menu.js                      # Menu data loading & queries
│   ├── store.js                     # Reactive state store (Proxy)
│   ├── cart-service.js              # Cart & CartLine classes
│   ├── checkout-service.js          # Customer & CheckoutService classes
│   └── order.js                     # Order utilities & helpers
│
├── 📂 data/                         # Static data
│   ├── menu.json                    # Menu items (JSON)
│   └── images/                      # Product images
│
├── 📂 images/                       # App assets
│   ├── logo.svg                     # App logo
│   └── icons/                       # PWA icons & favicon
│
├── 📂 product-{id}/                 # Product detail pages (SPA fallback)
│
└── 📄 README.md                     # This file
```

---

## 🛠️ Technology Stack

### Core Technologies

- **HTML5** - Semantic markup, templates
- **CSS3** - Grid, Flexbox, custom properties
- **JavaScript ES6+** - Modules, Classes, Async/Await
  - Web Components (Custom Elements API)
  - Proxy API (reactive state)
  - Fetch API (HTTP requests)
  - History API (SPA routing)
  - Service Workers API (PWA)

### Browser APIs

- **Custom Elements** - Define new HTML elements
- **Shadow DOM** - CSS encapsulation
- **History API** - Browser history management
- **Proxy** - Intercept and react to state changes
- **Template Element** - Client-side templates
- **Fetch API** - Asynchronous HTTP requests

### Architecture Patterns

- **Component-Based Architecture** - Modular UI components
- **Service Layer Pattern** - Separation of business logic
- **Observer Pattern** - Event-driven communication
- **Singleton Pattern** - Router and Store as singletons
- **Factory Pattern** - Component creation

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ or **Python 3.7+** (for local development server)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation & Running

#### Option 1: Using Python

```bash
cd coffeemasters-vanilla-js
python -m http.server 8000
# Open http://localhost:8000 in your browser
```

#### Option 2: Using Node.js

```bash
cd coffeemasters-vanilla-js
npx http-server -p 8000
# Open http://localhost:8000 in your browser
```

#### Option 3: Using VS Code Live Server

1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

### Project Structure Overview

The app initializes via:

1. **index.html** loads `app.js` as a module
2. **app.js** imports all components and initializes the app
3. **DOMContentLoaded** event triggers app bootstrap:
   - Menu data is loaded from `data/menu.json`
   - Router is initialized
   - Navigation listeners are attached
4. **User interactions** trigger routing and state updates

---

## 💡 Core Concepts

### 1. Web Components & BaseComponent

Every page/component extends `BaseComponent`:

```javascript
export class MenuPage extends BaseComponent {
  static styles = './components/MenuPage.css'; // CSS file to load

  onConnected() {
    // Hook called when component is mounted
    window.addEventListener('appmenuchange', this.handleChange);
  }

  render() {
    // Required method - render component content
    this.renderTemplate('#menu-page-template');
    // ... more rendering logic
  }

  onDisconnected() {
    // Hook called when component is unmounted
    window.removeEventListener('appmenuchange', this.handleChange);
  }
}

customElements.define('menu-page', MenuPage);
```

**Key Features:**

- Automatic style loading and caching
- Template rendering helpers
- Shadow DOM support (encapsulation)
- Light DOM mode via `static useShadow = false`
- Lifecycle hooks: `onConnected()`, `onDisconnected()`
- `rerender()` method for reactive updates

### 2. Reactive State Management

State is managed via JavaScript **Proxies**:

```javascript
// services/store.js
const STORE = {
  menu: null,
  cart: [],
};

const handler = {
  set(target, prop, value) {
    target[prop] = value;
    // Emit custom window event on state change
    if (prop === 'cart') {
      window.dispatchEvent(new Event('appcartchange'));
    }
    return true;
  },
};

export const proxyStore = new Proxy(STORE, handler);
```

**Usage:**

```javascript
app.store.cart = newCartItems; // Triggers 'appcartchange' event
```

**Components listen:**

```javascript
window.addEventListener('appcartchange', () => {
  this.rerender(); // Re-render when cart changes
});
```

### 3. OOP Service Pattern

**CartLine & Cart Classes** (services/cart-service.js):

```javascript
class CartLine {
  constructor(product, quantity = 1) {
    this.product = product;
    this.quantity = CartLine.normalizeQuantity(quantity);
  }

  increment(amount = 1) {
    this.quantity += CartLine.normalizeQuantity(amount);
  }

  get subtotal() {
    return this.product.price * this.quantity;
  }
}

class Cart {
  #lines = []; // Private field

  get total() {
    return this.#lines.reduce((sum, line) => sum + line.subtotal, 0);
  }
}

export const cartService = new CartService();
```

**CheckoutService** (services/checkout-service.js):

```javascript
class Customer {
  validate() {
    // Validation logic for name, email, phone
  }
}

class CheckoutService {
  async placeOrder(customerInput) {
    const customer = new Customer(customerInput);
    const errors = customer.validate();
    // Order processing
  }
}
```

### 4. Custom Router

Simple but powerful routing system:

```javascript
export const ROUTER = {
  init: () => {
    // Setup click handlers for nav links
    // Setup browser back/forward handling
    // Navigate to initial URL
  },

  goTo: (route, addToHistory = true) => {
    // route examples: '/', '/order', '/product-11'
    // Create appropriate component
    // Replace main element content
    // Scroll to top
  },
};
```

**Routing Examples:**

- `/` → MenuPage (browse products)
- `/order` → OrderPage (view cart & checkout)
- `/product-11` → DetailsPage (view product details)

### 5. Template-Based Rendering

```html
<!-- index.html -->
<template id="menu-page-template">
  <section>
    <ul id="menu"></ul>
  </section>
</template>
```

```javascript
// In component
renderTemplate(templateSelector) {
  const template = document.querySelector(templateSelector);
  this.root.appendChild(template.content.cloneNode(true));
}
```

---

## 👨‍💻 Development Guide

### Creating a New Component

1. **Create component file** (`components/NewComponent.js`):

```javascript
import { BaseComponent } from './BaseComponent.js';

export class NewComponent extends BaseComponent {
  static styles = './components/NewComponent.css';

  constructor() {
    super();
    this.onDataChange = () => void this.rerender();
  }

  onConnected() {
    window.addEventListener('appdatachange', this.onDataChange);
  }

  onDisconnected() {
    window.removeEventListener('appdatachange', this.onDataChange);
  }

  render() {
    // Create or update DOM content
    const heading = document.createElement('h1');
    heading.textContent = 'Hello World';
    this.root.appendChild(heading);
  }
}

customElements.define('new-component', NewComponent);
```

2. **Create CSS file** (`components/NewComponent.css`):

```css
:host {
  display: block;
  padding: 1rem;
}

h1 {
  font-size: 2rem;
  color: #333;
}
```

3. **Import in app.js**:

```javascript
import { NewComponent } from './components/NewComponent.js';
```

4. **Use in templates or code**:

```html
<new-component></new-component>
```

### Adding Routes

1. **Add to router** (`router/route.js`):

```javascript
case '/mynewpage':
  pageElement = document.createElement('my-new-page');
  break;
```

2. **Add navigation link** (`index.html`):

```html
<a class="navlink" id="linkNew" href="/mynewpage"> New Page </a>
```

### Updating Global State

```javascript
// From anywhere in the app
import { proxyStore } from './services/store.js';

// Update menu
app.store.menu = newMenuData; // Fires 'appmenuchange'

// Update cart
app.store.cart = newCart; // Fires 'appcartchange'

// Components listening will automatically rerender
```

### Debugging

Use browser DevTools:

```javascript
// Check store state
console.log(app.store);

// Check router
console.log(app.router);

// Check cart service
import { cartService } from './services/cart-service.js';
console.log(cartService.getSummary());
```

---

## 🎓 Learning Resources

### Key Concepts Covered

1. **Web Components**
   - Custom Elements API
   - Shadow DOM vs Light DOM
   - Lifecycle callbacks
   - Template element usage

2. **State Management Without Frameworks**
   - Proxy objects for reactivity
   - Custom event systems
   - Observer pattern

3. **Client-Side Routing**
   - History API
   - SPA patterns
   - Route parameters

4. **OOP in JavaScript**
   - Classes and inheritance
   - Encapsulation with private fields
   - Service layer pattern
   - Validation logic

5. **Progressive Web Apps**
   - Web Manifest
   - Service Workers
   - Offline support
   - App icons and metadata

6. **DOM Manipulation**
   - Template cloning
   - Dynamic content rendering
   - Event delegation
   - CSS encapsulation

### When to Use Vanilla JS vs Frameworks

This project demonstrates that **vanilla JavaScript is sufficient for**:

- ✅ Small to medium-sized applications
- ✅ Learning web fundamentals
- ✅ Applications with minimal dependencies
- ✅ Maximum performance (no framework overhead)
- ✅ Specific performance-critical sections

**Consider frameworks when**:

- ❌ Building large, complex applications
- ❌ Need extensive ecosystem/plugins
- ❌ Team unfamiliar with vanilla JS
- ❌ Rapid development required
- ❌ Need SSR or metaframework features

---

## 🔮 Future Improvements

The TODO in `router/route.js` outlines potential enhancements:

1. **Generic Routing System**
   - Dynamic route parameters: `/:id`, `/:category/:product`
   - Query string support: `?sort=price&filter=type`
   - 404 page handling
   - Nested routes

2. **Performance Optimizations**
   - Lazy loading route components
   - Virtual DOM for efficient updates
   - Code splitting and bundling

3. **Developer Experience**
   - Hot module replacement (HMR)
   - Better error handling and messages
   - Route guards for authentication
   - Middleware system

4. **Features**
   - Backend API integration for orders
   - User authentication
   - Persistent cart storage (localStorage)
   - Search and filtering
   - Analytics tracking

5. **Testing**
   - Unit tests for services
   - Component testing
   - E2E testing
   - Performance benchmarks

---

## 📊 Project Statistics

- **Components**: 5 (MenuPage, DetailsPage, OrderPage, ProductItem, CartItem)
- **Services**: 6 (API, menu, store, cart-service, checkout-service, order)
- **Routes**: 3 (/, /order, /product-{id})
- **LOC (Estimated)**: ~1500 lines of vanilla JavaScript
- **Dependencies**: 0 (zero external dependencies!)
- **Frameworks Used**: None ✨

---

## 📝 License

This project is part of the Frontend Masters "You Don't Need That Library" course.

---

## 🤝 Contributing

This is an educational project. For improvements or suggestions, refer to the course materials on [Frontend Masters][course].

---

**Happy Learning! 🚀☕**
