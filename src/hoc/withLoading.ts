import { Block, Store } from '../core';

export interface WithLoadingProps {
  isLoading: boolean;
}

export function withLoading<P extends WithLoadingProps>(WrappedBlock: typeof Block<P>) {
  return class extends WrappedBlock {
    constructor(props: P) {
      super({
        ...props,
        isLoading: () => Store.getInstance().getState().isLoading,
      });
    }
  };
}
