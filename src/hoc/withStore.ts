import { Block, Store } from '../core';

type WithStateProps = { store: Store };

export function withStore<P extends WithStateProps>(WrappedBlock: typeof Block) {
  return class extends WrappedBlock<P> {
    public static override componentName = WrappedBlock.componentName;

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
      Store.getInstance().on(Store.STATE_CHANGED, this.onChangeStateCallback);
    }

    override componentWillUnmount() {
      super.componentWillUnmount();
      Store.getInstance().off(Store.STATE_CHANGED, this.onChangeStateCallback);
    }
  };
}
