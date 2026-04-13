import { ROUTER } from './router/route.js';
import { loadData } from './services/menu.js';
import { STORE } from './services/store.js';

window.app = {};
app.store = STORE;
app.router = ROUTER;

window.addEventListener('DOMContentLoaded', async () => {
  loadData();
  app.router.init();
});
