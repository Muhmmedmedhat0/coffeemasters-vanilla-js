import { ROUTER } from './router/route.js';
import { loadData } from './services/menu.js';
import { proxyStore } from './services/store.js';

// link to the web components
import { MenuPage } from './components/MenuPage.js';
import { DetailsPage } from './components/DetailsPage.js';
import { OrderPage } from './components/OrderPage.js';
import { ProductItem } from './components/ProductItem.js';

// global app object to hold the store and router
window.app = {};
app.store = proxyStore;
app.router = ROUTER;

// initialize the app when the DOM is ready
window.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  app.router.init();
});
