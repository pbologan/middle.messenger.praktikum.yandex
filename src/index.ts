import './styles.css';
import { registerComponents } from './utils/registerComponents';
import { Store } from './core/store';
import { BrowserRouter } from './core/router';
import { AppState } from './core/store/types';
import { initialState } from './utils/initialState';
import { initRouter } from './utils/initRouter';

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
