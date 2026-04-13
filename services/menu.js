import { API } from './api.js';

export async function loadData(params) {
  app.store.menu = await API.fetchMenu();
  console.log(app.store.menu);
  window.dispatchEvent(new Event('appmenuchange'));
  return app.store.menu;
}
