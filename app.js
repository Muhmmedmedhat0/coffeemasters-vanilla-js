import { loadData } from './services/menu.js';
import { STORE } from './services/store.js';

window.app = {};
app.store = STORE;

window.addEventListener('DOMContentLoaded', async () => {
  loadData();
});
