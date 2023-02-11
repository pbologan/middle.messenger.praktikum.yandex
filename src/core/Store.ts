import { EventBus } from './EventBus';
import { Action } from '../models/app';

export class Store<State extends Record<string, any>> extends EventBus {
  private state: State = {} as State;

  constructor(state: State) {
    super();
    this.state = state;
    this.setState(state);
  }

  public getState() {
    return this.state;
  }

  public setState(nextState: Partial<State>) {
    const prevState = { ...this.state };
    this.state = { ...prevState, ...nextState };
    this.emit('changed', prevState, nextState);
  }

  public dispatch(nextStateOrAction: Partial<State> | Action<State>, payload?: any) {
    if (typeof nextStateOrAction === 'function') {
      nextStateOrAction(this.dispatch.bind(this), this.state, payload);
    } else {
      this.setState({ ...this.state, ...nextStateOrAction });
    }
  }
}
