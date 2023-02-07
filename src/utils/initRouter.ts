import { BrowserRouter } from '../core/router';
import { Store } from '../core/store';
import { AppState } from '../core/store/types';
import { Page } from './router-util';

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

export function initRouter(router: BrowserRouter, store: Store<AppState>) {
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
}
