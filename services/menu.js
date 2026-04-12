import { API } from './api.js';

export async function loadData(params) {
  app.store.menu = await API.fetchMenu();
	console.log(app.store.menu);
  return app.store.menu;
}
