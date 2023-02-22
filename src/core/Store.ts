import { EventBus } from './EventBus';
import { Action, AppState } from '../models/app';
import { initialState } from '../utils/initialState';

export class Store extends EventBus {
  public static readonly STATE_CHANGED = 'state changed';

  private static instance: Store | null = null;

  private state: AppState;

  private constructor(state: AppState) {
    super();
    this.state = state;
  }

  public static getInstance() {
    if (!Store.instance) {
      Store.instance = new Store(initialState);
    }
    return Store.instance;
  }

  public getState() {
    return this.state;
  }

  public setState(nextState: Partial<AppState>) {
    const prevState = { ...this.state };
    this.state = { ...prevState, ...nextState };
    this.emit(Store.STATE_CHANGED, prevState, nextState);
  }

  public dispatch(
    nextStateOrAction: Partial<AppState> | Action<AppState>,
    payload?: any,
  ) {
    if (typeof nextStateOrAction === 'function') {
      nextStateOrAction(this.dispatch.bind(this), payload);
    } else {
      this.setState({ ...this.state, ...nextStateOrAction });
    }
  }
}
