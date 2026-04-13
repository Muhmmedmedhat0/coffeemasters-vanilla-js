// TODO: refactor to use a more generic approach to work with any application
// structure and support dynamic routes with parameters and query strings,
// and also to handle 404 not found pages and other edge cases and
// also to support nested routes and route guards for authentication and authorization,
// and also to optimize performance by lazy loading route components
// and using a virtual DOM for efficient updates, and also
// to provide a better developer experience with features like hot module replacement
// and error handling, and also to make it as an npm routing package for vanilla JS applications.
export const ROUTER = {
  init: () => {
    document.querySelectorAll('a.navlink').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const url = link.getAttribute('href');
        ROUTER.goTo(url);
      });
    });
    // event handler for URL changes (back/forward navigation)
    window.addEventListener('popstate', (event) => {
      ROUTER.goTo(event.state.route, false);
    });

    // check the initial URL and navigate to the corresponding page
    const initialPath = window.location.pathname;
    ROUTER.goTo(initialPath);
  },
  goTo: (route, addToHistory = true) => {
    console.log(`🚀 ~ route =>`, route);
    if (addToHistory) {
      history.pushState({ route }, '', route);
    }

    let pageElement = null;

    switch (route) {
      case '/':
        pageElement = document.createElement('menu-page');

        break;

      case '/order':
        pageElement = document.createElement('order-page');
        break;

      default:
        if (route.startsWith('/product-')) {
          pageElement = document.createElement('details-page');
          const id = route.substring(route.lastIndexOf('-') + 1);
          pageElement.dataset.id = id;
          pageElement.dataset.productId = id;
        }
        break;
    }

    if (!pageElement) {
      return;
    }

    const main = document.querySelector('main');
    if (!main) {
      return;
    }

    main.replaceChildren(pageElement);
    window.scrollTo(0, 0);
  },
};
