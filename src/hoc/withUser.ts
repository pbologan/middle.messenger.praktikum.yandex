import { User } from '../models/user';
import { Block, Store } from '../core';
import { AppState } from '../models/app';

export interface WithUserProps {
  user: User;
}

export function withUser<P extends WithUserProps = any>(WrappedBlock: typeof Block<P>) {
  return class extends WrappedBlock {
    constructor(props: P) {
      super({
        ...props,
        user: Store.getInstance().getState().user,
      });
    }

    private onChangeUserCallback = (prevState: AppState, nextState: AppState) => {
      if (JSON.stringify(prevState.user) !== JSON.stringify(nextState.user)) {
        this.setProps({
          ...this.props,
          user: nextState.user,
        });
      }
    };

    override componentDidMount(props: P) {
      super.componentDidMount(props);
      Store.getInstance().on(Store.STATE_CHANGED, this.onChangeUserCallback);
    }

    override componentWillUnmount() {
      super.componentWillUnmount();
      Store.getInstance().off(Store.STATE_CHANGED, this.onChangeUserCallback);
    }
  };
}
