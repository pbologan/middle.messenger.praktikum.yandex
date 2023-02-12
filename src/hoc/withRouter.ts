import { Block, BrowserRouter } from '../core';

type WithRouterProps = { router: BrowserRouter };
export function withRouter<P extends WithRouterProps>(WrappedBlock: typeof Block) {
  return class extends WrappedBlock<P> {
    public static override componentName = WrappedBlock.componentName;

    constructor(props: P) {
      super({ ...props, router: BrowserRouter.getInstance() });
    }
  };
}
