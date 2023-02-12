import { BrowserRouter } from '../core/router';
import { AppState, Page } from '../models/app';
import { Store } from '../core/Store';
import { getPageComponent } from './router-util';
import { renderDOM } from '../core';

type Route = {
  path: string,
  page: Page,
  isPrivate: boolean,
};

const routes: Array<Route> = [
  {
    path: '/login',
    page: Page.LOGIN,
    isPrivate: false,
  },
  {
    path: '/signup',
    page: Page.SIGN_UP,
    isPrivate: true,
  },
  {
    path: '/chat',
    page: Page.CHAT,
    isPrivate: true,
  },
  {
    path: '/profile',
    page: Page.PROFILE,
    isPrivate: true,
  },
  {
    path: '/error',
    page: Page.ERROR,
    isPrivate: false,
  },
  {
    path: '*',
    page: Page.NOT_FOUND,
    isPrivate: false,
  },
];

export function initRouter(router: BrowserRouter, store: Store) {
  routes.forEach((route: Route) => {
    router.use(route.path, () => {
      const isAuthorized = Boolean(store.getState().user);
      const currentPage = Boolean(store.getState().page);

      if (isAuthorized || !route.isPrivate) {
        store.dispatch({ page: route.page });
      }

      if (!isAuthorized || !currentPage) {
        store.dispatch({ page: Page.LOGIN });
      }
    });
  });

  router.start();

  store.on(Store.STATE_CHANGED, (prevState: AppState, nextState: AppState) => {
    const nextPage = nextState.page;
    if (nextPage && nextPage !== prevState.page) {
      const CurrentPage = getPageComponent(nextPage);
      renderDOM(new CurrentPage({}));
      document.title = `ChatApp / ${CurrentPage.componentName}`;
    }
  });
}
