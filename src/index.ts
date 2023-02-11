import './styles.css';
import { registerComponents } from './utils/registerComponents';
import { BrowserRouter } from './core/router';
import { initialState } from './utils/initialState';
import { initRouter } from './utils/initRouter';
import { Store } from './core/Store';
import { AppState } from './models/app';

declare global {
  interface Window {
    store: Store<AppState>,
    router: BrowserRouter,
  }
}

registerComponents();

document.addEventListener('DOMContentLoaded', () => {
  const store = new Store<AppState>(initialState);
  const router = BrowserRouter.getInstance();

  window.store = store;
  window.router = router;

  initRouter(router, store);
});
