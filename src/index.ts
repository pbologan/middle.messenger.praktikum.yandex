import './styles.css';
import { registerComponents } from './utils/registerComponents';
import { BrowserRouter } from './core/router';
import { initRouter } from './utils/initRouter';
import { Store } from './core/Store';

registerComponents();

document.addEventListener('DOMContentLoaded', () => {
  const store = Store.getInstance();
  const router = BrowserRouter.getInstance();

  initRouter(router, store);
});
