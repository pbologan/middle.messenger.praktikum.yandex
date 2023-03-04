export class BrowserRouter {
  private static instance: BrowserRouter;

  private routes: Record<string, Function> = {};

  private history: History = window.history;

  private isStarted = false;

  private constructor() {
    if (BrowserRouter.instance) {
      throw new Error('Singleton. Use getInstance() method');
    }
  }

  public static getInstance(): BrowserRouter {
    if (!BrowserRouter.instance) {
      BrowserRouter.instance = new BrowserRouter();
    }
    return BrowserRouter.instance;
  }

  use(pathname: string, callback :Function) {
    this.routes[pathname] = callback;
    return this;
  }

  start() {
    if (!this.isStarted) {
      this.isStarted = true;

      window.addEventListener('popstate', () => {
        this.onRouteChange.call(this);
      });

      this.onRouteChange();
    }
  }

  private onRouteChange(pathname: string = window.location.pathname) {
    const found = Object.entries(this.routes).some(([routePath, callback]) => {
      if (routePath === pathname) {
        callback();
        return true;
      }
      return false;
    });

    if (!found && this.routes['*']) {
      this.routes['*']();
    }
  }

  go(pathname: string) {
    this.history.pushState({}, '', pathname);
    this.onRouteChange(pathname);
  }

  back() {
    this.history.back();
  }

  forward() {
    this.history.forward();
  }

  clear() {
    this.routes = {};
    this.isStarted = false;
  }
}
