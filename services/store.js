const STORE = {
  menu: null,
  cart: [],
};
const handler = {
  set(target, prop, value) {
    target[prop] = value;
    if (prop == 'menu') {
      window.dispatchEvent(new Event('appmenuchange'));
    }
    if (prop == 'cart') {
      window.dispatchEvent(new Event('appcartchange'));
    }
    return true;
  },
};
export const proxyStore = new Proxy(STORE, handler);
