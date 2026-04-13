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
        pageElement = document.createElement('h1');
        pageElement.textContent = 'Menu';

        break;

      case '/order':
        pageElement = document.createElement('h1');
        pageElement.textContent = 'Order';
        break;

      default:
        if (route.startsWith('/product-')) {
          pageElement = document.createElement('h1');
          pageElement.textContent = 'Product Details';
          const id = route.substring(route.lastIndexOf('-') + 1);
          pageElement.dataset.id = id;
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
