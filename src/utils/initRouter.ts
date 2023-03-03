import { BrowserRouter, renderDOM, Store } from '../core';
import { AppState, Page } from '../models/app';
import { getPageComponent } from './router-util';
import { localStorageUtils } from './localStorageUtils';

type Route = {
  path: string,
  page: Page,
  isPrivate: boolean,
};

const routes: Array<Route> = [
  {
    path: Page.LOGIN,
    page: Page.LOGIN,
    isPrivate: false,
  },
  {
    path: Page.SIGN_UP,
    page: Page.SIGN_UP,
    isPrivate: true,
  },
  {
    path: Page.CHAT,
    page: Page.CHAT,
    isPrivate: true,
  },
  {
    path: Page.PROFILE,
    page: Page.PROFILE,
    isPrivate: true,
  },
  {
    path: Page.ERROR,
    page: Page.ERROR,
    isPrivate: false,
  },
  {
    path: '*',
    page: Page.LOGIN,
    isPrivate: false,
  },
];

export function initRouter(router: BrowserRouter, store: Store) {
  routes.forEach((route: Route) => {
    router.use(route.path, () => {
      const isAuthorized = Boolean(store.getState().user);
      const currentPage = Boolean(store.getState().page);

      localStorageUtils.storeCurrentPage(route.page);
      if (!currentPage || !isAuthorized) {
        store.dispatch({ page: Page.LOGIN });
      } else if (isAuthorized && route.page === Page.ANY_PATH) {
        store.dispatch({ page: Page.CHAT });
      } else {
        store.dispatch({ page: route.page });
      }
    });
  });

  store.on(Store.STATE_CHANGED, (prevState: AppState, nextState: AppState) => {
    if (nextState.page && prevState) {
      const CurrentPage = getPageComponent(nextState.page);
      renderDOM(new CurrentPage({}));
      document.title = `ChatApp / ${CurrentPage.componentName}`;
    }
  });
}
