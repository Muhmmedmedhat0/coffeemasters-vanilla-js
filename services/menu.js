import { API } from './api.js';

export async function loadData(params) {
  app.store.menu = await API.fetchMenu();
  // console.log(app.store.menu);
  // window.dispatchEvent(new Event('appmenuchange'));
  // return app.store.menu;
}

export async function getProductById(id) {
  if (app.store.menu == null) {
    await loadData();
  }
  for (const category of app.store.menu) {
    const product = category.products?.find((item) => item.id == id);
    if (product) {
      return product;
    }
  }
  return null;
}
