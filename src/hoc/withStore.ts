import { Block, Store } from '../core';

export interface WithStoreProps {
  store: Store;
}

export function withStore<P extends WithStoreProps = any>(WrappedBlock: typeof Block<P>) {
  return class extends WrappedBlock {
    constructor(props: P) {
      super({
        ...props,
        store: Store.getInstance(),
      });
    }

    private onChangeStateCallback = () => {
      this.setProps({
        ...this.props,
        store: Store.getInstance(),
      });
    };

    override componentDidMount(props: P) {
      super.componentDidMount(props);
      Store.getInstance()
        .on(Store.STATE_CHANGED, this.onChangeStateCallback);
    }

    override componentWillUnmount() {
      super.componentWillUnmount();
      Store.getInstance()
        .off(Store.STATE_CHANGED, this.onChangeStateCallback);
    }
  };
}
