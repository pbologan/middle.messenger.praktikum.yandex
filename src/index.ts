import './styles.css';
import { registerComponents, initRouter } from './utils';
import { BrowserRouter, Store } from './core';
import { initApp } from './service';

registerComponents();

document.addEventListener('DOMContentLoaded', () => {
  const store = Store.getInstance();
  const router = BrowserRouter.getInstance();

  initRouter(router, store);

  store.dispatch(initApp);

  router.start();
});
