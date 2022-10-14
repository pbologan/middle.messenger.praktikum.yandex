import { Props, Route } from './Route';
import { BlockClass } from '../Block';

export class BrowserRouter {
  private static instance: BrowserRouter;

  private routes: Array<Route<any>> = [];

  private history: History = window.history;

  private currentRoute: Route<any> | null = null;

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

  use<P extends object>(pathname: string, block: BlockClass<P>, props: Props = {}) {
    const route = new Route(pathname, block, props);

    this.routes.push(route);

    return this;
  }

  start() {
    window.onpopstate = (() => {
      this.onRoute(window.location.pathname);
    });

    this.onRoute(window.location.pathname);
  }

  private onRoute(pathname: string) {
    const route = this.getRoute(pathname);
    if (!route) {
      return;
    }

    if (this.currentRoute && this.currentRoute !== route) {
      this.currentRoute.leave();
    }

    this.currentRoute = route;
    route.render();
  }

  go(pathname: string) {
    this.history.pushState({}, '', pathname);
    this.onRoute(pathname);
  }

  back() {
    this.history.back();
  }

  forward() {
    this.history.forward();
  }

  getRoute(pathname: string): Route<any> | undefined {
    const router = this.routes.find((route: Route<any>) => route.match(pathname));
    return router || this.routes.find((route: Route<any>) => route.match('*'));
  }
}
