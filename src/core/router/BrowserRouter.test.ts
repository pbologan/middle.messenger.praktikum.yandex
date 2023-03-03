import { BrowserRouter } from './BrowserRouter';
import { Store } from '../Store';
import { initRouter } from '../../utils';
import { Page } from '../../models/app';

const mockUser = {
  id: 1,
  login: 'string',
  firstName: 'string',
  secondName: 'string',
  phone: 'string',
  email: 'string',
};

describe('Routing', () => {
  const router = BrowserRouter.getInstance();
  const store = Store.getInstance();

  beforeEach(() => {
    window.history.forward = jest.fn();
    window.history.back = jest.fn();
    document.body.innerHTML = '<div id="root"></div>';
    router.clear();
    store.resetState();
    initRouter(router, store);
  });

  it('should move to back page', () => {
    router.back();
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should move to forward page', () => {
    router.forward();
    expect(window.history.forward).toHaveBeenCalled();
  });

  it('should change route to login if not authorized', () => {
    store.dispatch({
      page: null,
      user: null,
    });
    router.go(Page.CHAT);
    expect(store.getState().page).toBe(Page.LOGIN);
  });

  it('should change route to chat if authorized', () => {
    store.dispatch({
      page: Page.ANY_PATH,
      user: mockUser,
    });
    router.go(Page.CHAT);
    expect(store.getState().page).toBe(Page.CHAT);
  });
});
