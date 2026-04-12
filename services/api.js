export const API = {
  url: '/data/menu.json',
  fetchMenu: async () => {
    const response = await fetch(API.url);
    return await response.json();
  },
};
